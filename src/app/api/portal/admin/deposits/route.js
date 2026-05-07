import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET - List all deposit transactions for admin review
export async function GET(req) {
  try {
    // Auth check - manually verify admin
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const jwt = await import("jsonwebtoken");
    let decoded;
    try {
      decoded = jwt.default.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }
    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    let whereClause = "WHERE t.type = 'deposit'";
    let params = [];

    if (status !== "all") {
      whereClause += " AND t.status = $1";
      params.push(status);
    }

    params.push(limit, offset);

    const deposits = await query(
      `SELECT t.*, up.first_name, up.last_name, uc.email
       FROM transactions t
       LEFT JOIN users u ON t.user_id = u.id
       LEFT JOIN user_profiles up ON t.user_id = up.user_id
       LEFT JOIN user_contacts uc ON t.user_id = uc.user_id
       ${whereClause}
       ORDER BY t.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    // Count total
    let countParams = [];
    if (status !== "all") {
      countParams = [status];
    }
    const countResult = await query(
      `SELECT COUNT(*) FROM transactions t ${whereClause}`,
      countParams
    );
    const total = Number(countResult[0].count);

    // Get counts for stats (all deposits regardless of filter)
    const pendingResult = await query(
      `SELECT COUNT(*) FROM transactions t WHERE t.type = 'deposit' AND (t.status = 'pending' OR t.status = 'awaiting_payment')`
    );
    const approvedResult = await query(
      `SELECT COUNT(*) FROM transactions t WHERE t.type = 'deposit' AND t.status = 'approved'`
    );
    const rejectedResult = await query(
      `SELECT COUNT(*) FROM transactions t WHERE t.type = 'deposit' AND t.status = 'rejected'`
    );

    return NextResponse.json({
      success: true,
      deposits,
      counts: {
        pending: Number(pendingResult[0].count),
        approved: Number(approvedResult[0].count),
        rejected: Number(rejectedResult[0].count)
      },
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("[admin/deposits] GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Approve or reject a deposit
export async function PATCH(req) {
  try {
    // Auth check - manually verify admin
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const jwtModule = await import("jsonwebtoken");
    let decoded;
    try {
      decoded = jwtModule.default.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }
    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { depositId, action } = body;

    if (!depositId) {
      return NextResponse.json(
        { success: false, message: "Deposit ID is required" },
        { status: 400 }
      );
    }

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    const depositIdNum = Number(depositId);
    if (!Number.isInteger(depositIdNum) || depositIdNum <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid deposit ID" },
        { status: 400 }
      );
    }

    // Fetch deposit
    const depositResult = await query(
      `SELECT t.*, up.first_name, up.last_name, uc.email, u.balance
       FROM transactions t
       LEFT JOIN users u ON t.user_id = u.id
       LEFT JOIN user_profiles up ON t.user_id = up.user_id
       LEFT JOIN user_contacts uc ON t.user_id = uc.user_id
       WHERE t.id = $1 AND t.type = 'deposit'`,
      [depositIdNum]
    );

    if (!depositResult.length) {
      return NextResponse.json(
        { success: false, message: "Deposit not found" },
        { status: 404 }
      );
    }

    const deposit = depositResult[0];

    // Check if already processed
    if (deposit.status !== "pending" && deposit.status !== "awaiting_payment") {
      return NextResponse.json(
        { success: false, message: `Deposit is already ${deposit.status}` },
        { status: 400 }
      );
    }

    // Start transaction
    await query("BEGIN");

    try {
      if (action === "approve") {
        // Credit the user's main balance using NET amount (amount minus processing fee)
        await query(
          `UPDATE users SET balance = balance + $1 WHERE id = $2`,
          [deposit.net_amount ?? deposit.amount, deposit.user_id]
        );

        // Update deposit status
        await query(
          `UPDATE transactions SET status = 'approved' WHERE id = $1`,
          [depositIdNum]
        );

        // Create notification
        await query(
          `INSERT INTO notifications (user_id, title, message, type, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [
            deposit.user_id,
            "Deposit Approved",
            `Your deposit of ₱${Number(deposit.net_amount ?? deposit.amount).toLocaleString()} has been approved and credited to your main balance. Reference: ${deposit.reference_number}`,
            "success"
          ]
        );

      } else if (action === "reject") {
        // Update deposit status
        await query(
          `UPDATE transactions SET status = 'rejected' WHERE id = $1`,
          [depositIdNum]
        );

        // Create notification
        await query(
          `INSERT INTO notifications (user_id, title, message, type, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [
            deposit.user_id,
            "Deposit Rejected",
            `Your deposit of ₱${Number(deposit.amount).toLocaleString()} has been rejected. Reference: ${deposit.reference_number}. Please contact support for more information.`,
            "warning"
          ]
        );
      }

      await query("COMMIT");

      return NextResponse.json({
        success: true,
        message: `Deposit ${action}d successfully`,
        deposit: { ...deposit, status: action === "approve" ? "approved" : "rejected" }
      });

    } catch (innerError) {
      await query("ROLLBACK");
      throw innerError;
    }

  } catch (error) {
    console.error("[admin/deposits] PATCH error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}