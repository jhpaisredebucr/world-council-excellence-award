import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req) {
  try {
    // ─── Auth ────────────────────────────────────────────────────────────────
    const decoded = await requireAdmin(req);
    if (decoded instanceof NextResponse) return decoded;

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const userIdNum = Number(userId);
    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    // ─── 1. Approve user & get referral code ────────────────────────────────
    const updated = await query(
      `UPDATE users
       SET status = $1
       WHERE id = $2
       RETURNING id, referred_by, package`,
      ["approved", userIdNum]
    );

    if (!updated.length) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const user = updated[0];
    let referrerId = null;

    // ─── 2. Find referrer ID from referral code ──────────────────────────────
    if (user.referred_by) {
      const referrer = await query(
        `SELECT id FROM users WHERE referral_code = $1 LIMIT 1`,
        [user.referred_by]
      );
      referrerId = referrer[0]?.id || null;
    }

    // ─── 3. Approve the corresponding pending plan transaction ──────────────
    // Transaction type is stored based on the user's package (e.g. 'plan', 'package_purchase')
    // Use a fallback of 'plan' for legacy compatibility
    const planType = "plan";

    const txResult = await query(
      `UPDATE transactions
       SET status = 'approved'
       WHERE user_id = $1
         AND status = 'pending'
         AND type = $2
       RETURNING id`,
      [userIdNum, planType]
    );

    return NextResponse.json({
      success: true,
      message: "User approved successfully",
      userId: user.id,
      referredByCode: user.referred_by,
      referrerId,
      transactionApproved: txResult.length > 0,
    });

  } catch (error) {
    console.error("[portal/admin/members] error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}