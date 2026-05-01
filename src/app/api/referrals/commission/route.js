import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, amount } = body;

    if (!userId || !amount) {
      return NextResponse.json(
        { message: "missing userId or amount" },
        { status: 400 }
      );
    }

    // 1. Get uplines + each ancestor's plan limit
    const uplines = await query(
      `
      SELECT
        r.ancestor_id,
        r.depth,
        u.max_levels,
        CASE
          WHEN r.depth <= u.max_levels
          THEN 0.1 * POWER(0.5, r.depth - 1)
          ELSE 0
        END AS percentage
      FROM referrals r
      JOIN users u ON u.id = r.ancestor_id
      WHERE r.descendant_id = $1
      `,
      [userId]
    );

    const rows = uplines.rows || uplines;

    // 2. Distribute rewards per ancestor rule
    for (const row of rows) {
      const percentage = Number(row.percentage);
      const commission = Number(amount) * percentage;

      if (commission <= 0) continue;

      await query(
        `
        INSERT INTO referral_rewards (
          referrer_id,
          referred_id,
          reward_amount
        )
        VALUES ($1, $2, $3)
        `,
        [
          row.ancestor_id, // who earns
          userId,          // who triggered signup
          commission
        ]
      );

      await query(
        `
          UPDATE users
          SET pc_credit = pc_credit + $1
          WHERE id = $2;
        `, [commission, row.ancestor_id]
      );
    }

    return NextResponse.json({
      message: "referral rewards processed",
      total: rows.length
    });

  } catch (error) {
    return NextResponse.json(
      { message: "error", error: error.message },
      { status: 500 }
    );
  }
}