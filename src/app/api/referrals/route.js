import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { newUserId, referrerId } = body;

    // Validate referrer exists before creating referral relationship
    if (referrerId) {
      const referrerCheck = await query(
        `SELECT id, referral_code FROM users WHERE referral_code = $1 OR id = $1`,
        [referrerId]
      );

      if (!referrerCheck.length) {
        return NextResponse.json(
          { message: "Invalid referrer code" },
          { status: 400 }
        );
      }

      await query(`
        INSERT INTO referrals (ancestor_id, descendant_id, depth)

        SELECT ancestor_id, $1::int, depth + 1
        FROM referrals
        WHERE descendant_id = $2::int

        UNION ALL

        SELECT $2::int, $1::int, 1
        `, [newUserId, referrerId]);
    }

    return NextResponse.json({ message: "working" });

  } catch (error) {
    return NextResponse.json(
      { message: "not working", errors: error.message },
      { status: 500 }
    );
  }
}