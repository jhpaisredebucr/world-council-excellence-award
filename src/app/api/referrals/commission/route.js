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

    if (!userId || !amount) {
      return NextResponse.json(
        { success: false, message: "missing userId or amount" },
        { status: 400 }
      );
    }

    const userIdNum = Number(userId);
    const totalAmount = Number(amount);

    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid userId" },
        { status: 400 }
      );
    }

    if (isNaN(totalAmount) || totalAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Get uplines + each ancestor's plan limit
    const uplines = await query(
      `SELECT
        r.ancestor_id,
        r.depth,
        u.max_levels,
        CASE
          WHEN r.depth <= COALESCE(u.max_levels, 0)
          THEN 0.1 * POWER(0.5, r.depth - 1)
          ELSE 0
        END AS percentage
      FROM referrals r
      JOIN users u ON u.id = r.ancestor_id
      WHERE r.descendant_id = $1`,
      [userIdNum]
    );

    const rows = uplines.rows || uplines;

    // Distribute rewards per ancestor rule
    for (const row of rows) {
      const percentage = Number(row.percentage);
      const commission = totalAmount * percentage;

      if (commission <= 0) continue;

      await query(
        `INSERT INTO referral_rewards (referrer_id, referred_id, reward_amount, status, created_at)
         VALUES ($1, $2, $3, 'approved', NOW())`,
        [row.ancestor_id, userIdNum, commission]
      );

      await query(
        `UPDATE users SET pc_credit = pc_credit + $1 WHERE id = $2`,
        [commission, row.ancestor_id]
      );
    }

    return NextResponse.json({
      success: true,
      message: "referral rewards processed",
      uplines_credited: rows.length,
    });

  } catch (error) {
    console.error("[referrals/commission] error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}