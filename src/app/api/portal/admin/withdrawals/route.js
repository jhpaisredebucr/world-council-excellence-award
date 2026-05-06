import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET - List all withdrawal transactions for admin review
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

    let whereClause = "WHERE t.type = 'withdrawal'";
    let params = [];

    if (status !== "all") {
      whereClause += " AND t.status = $1";
      params.push(status);
    }

    params.push(limit, offset);

    const withdrawals = await query(
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

    // Get counts for stats (all withdrawals regardless of filter)
    const pendingResult = await query(
      `SELECT COUNT(*) FROM transactions t WHERE t.type = 'withdrawal' AND t.status = 'pending'`
    );
    const approvedResult = await query(
      `SELECT COUNT(*) FROM transactions t WHERE t.type = 'withdrawal' AND t.status = 'approved'`
    );
    const rejectedResult = await query(
      `SELECT COUNT(*) FROM transactions t WHERE t.type = 'withdrawal' AND t.status = 'rejected'`
    );

    return NextResponse.json({
      success: true,
      withdrawals,
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
    console.error("[admin/withdrawals] GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Approve or reject a withdrawal
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
    const { withdrawalId, action } = body;

    if (!withdrawalId) {
      return NextResponse.json(
        { success: false, message: "Withdrawal ID is required" },
        { status: 400 }
      );
    }

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    const withdrawalIdNum = Number(withdrawalId);
    if (!Number.isInteger(withdrawalIdNum) || withdrawalIdNum <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid withdrawal ID" },
        { status: 400 }
      );
    }

    // Fetch withdrawal
    const withdrawalResult = await query(
      `SELECT t.*, up.first_name, up.last_name, uc.email, u.balance
       FROM transactions t
       LEFT JOIN users u ON t.user_id = u.id
       LEFT JOIN user_profiles up ON t.user_id = up.user_id
       LEFT JOIN user_contacts uc ON t.user_id = uc.user_id
       WHERE t.id = $1 AND t.type = 'withdrawal'`,
      [withdrawalIdNum]
    );

    if (!withdrawalResult.length) {
      return NextResponse.json(
        { success: false, message: "Withdrawal not found" },
        { status: 404 }
      );
    }

    const withdrawal = withdrawalResult[0];

    // Check if already processed
    if (withdrawal.status !== "pending") {
      return NextResponse.json(
        { success: false, message: `Withdrawal is already ${withdrawal.status}` },
        { status: 400 }
      );
    }

    // Start transaction
    await query("BEGIN");

    try {
      if (action === "approve") {
        // Update withdrawal status
        await query(
          `UPDATE transactions SET status = 'approved' WHERE id = $1`,
          [withdrawalIdNum]
        );

        // Create notification
        await query(
          `INSERT INTO notifications (user_id, title, message, type, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [
            withdrawal.user_id,
            "Withdrawal Approved",
            `Your withdrawal of ₱${Number(withdrawal.amount).toLocaleString()} has been approved. Reference: ${withdrawal.reference_number}`,
            "success"
          ]
        );

      } else if (action === "reject") {
        // Refund the balance back to user (since it was deducted on submission)
        await query(
          `UPDATE users SET balance = balance + $1 WHERE id = $2`,
          [withdrawal.amount, withdrawal.user_id]
        );

        // Update withdrawal status
        await query(
          `UPDATE transactions SET status = 'rejected' WHERE id = $1`,
          [withdrawalIdNum]
        );

        // Create notification
        await query(
          `INSERT INTO notifications (user_id, title, message, type, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [
            withdrawal.user_id,
            "Withdrawal Rejected",
            `Your withdrawal of ₱${Number(withdrawal.amount).toLocaleString()} has been rejected. The amount has been credited back to your balance. Reference: ${withdrawal.reference_number}. Please contact support for more information.`,
            "warning"
          ]
        );
      }

      await query("COMMIT");

      return NextResponse.json({
        success: true,
        message: `Withdrawal ${action}d successfully`,
        withdrawal: { ...withdrawal, status: action === "approve" ? "approved" : "rejected" }
      });

    } catch (innerError) {
      await query("ROLLBACK");
      throw innerError;
    }

  } catch (error) {
    console.error("[admin/withdrawals] PATCH error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}