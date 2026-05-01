import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req) {
  try {
    // ─── Auth ────────────────────────────────────────────────────────────────
    const decoded = await requireAdmin(req);
    if (decoded instanceof NextResponse) return decoded;

    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const txId = Number(transactionId);
    if (!Number.isInteger(txId) || txId <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid transaction ID" },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE transactions
       SET status = 'approved'
       WHERE id = $1
         AND status = 'pending'
       RETURNING id, user_id, status`,
      [txId]
    );

    // Fix: db.js returns res.rows, not the result object — check array length
    if (!result.length) {
      return NextResponse.json(
        { success: false, message: "Transaction not eligible for approval" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Transaction approved successfully",
      updated: result[0],
    });

  } catch (error) {
    console.error("[transaction/approve] error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}