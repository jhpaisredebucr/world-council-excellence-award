import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req) {
  try {
    // ─── Auth ────────────────────────────────────────────────────────────────
    const decoded = await requireAdmin(req);
    if (decoded instanceof NextResponse) return decoded;

    const body = await req.json();
    const { userId, amount } = body;

    // Validate inputs
    if (!userId || !amount) {
      return NextResponse.json(
        { success: false, message: "userId and amount are required" },
        { status: 400 }
      );
    }

    const userIdNum = Number(userId);
    const rewardAmount = Number(amount);

    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid userId" },
        { status: 400 }
      );
    }

    if (isNaN(rewardAmount) || rewardAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Get the newly approved user — find their referrer via the referred_by field
    const userResult = await query(
      `SELECT id, referred_by FROM users WHERE id = $1`,
      [userIdNum]
    );

    if (!userResult.length) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const user = userResult[0];
    if (!user.referred_by) {
      return NextResponse.json(
        { success: false, message: "This user has no referrer" },
        { status: 400 }
      );
    }

    // Look up referrer by referral_code (not id, since referred_by stores the code)
    const referrerResult = await query(
      `SELECT id, referral_code FROM users WHERE referral_code = $1 LIMIT 1`,
      [user.referred_by]
    );

    if (!referrerResult.length) {
      return NextResponse.json(
        { success: false, message: "Referrer not found" },
        { status: 404 }
      );
    }

    const referrerId = referrerResult[0].id;

    // ─── Insert referral reward ─────────────────────────────────────────────
    await query(
      `INSERT INTO referral_rewards (referrer_id, referred_id, reward_amount, status, created_at)
       VALUES ($1, $2, $3, 'approved', NOW())
       RETURNING *`,
      [referrerId, userIdNum, rewardAmount]
    );

    // ─── Credit referrer's PC balance ──────────────────────────────────────
    await query(
      `UPDATE users SET pc_credit = pc_credit + $1 WHERE id = $2`,
      [rewardAmount, referrerId]
    );

    return NextResponse.json({
      success: true,
      message: "Referral reward credited successfully",
      reward_amount: rewardAmount,
      referrer_id: referrerId,
    });

  } catch (error) {
    console.error("[referral-reward] error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}