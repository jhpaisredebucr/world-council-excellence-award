import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const userReferralCode = searchParams.get("referralCode");
    const myUserId = searchParams.get("userId");
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = Number(searchParams.get("offset")) || 0;

    if (!userReferralCode || !myUserId) {
      return NextResponse.json(
        { message: "missing required params" },
        { status: 400 }
      );
    }

    const referredMembers = await query(
      `
      SELECT 
          u.id, 
          u.username, 
          u.status, 
          u.referral_code, 
          u.created_at,
          u.package,
          p.first_name, 
          p.last_name,
          p.img_url,

          COALESCE(SUM(rr.reward_amount), 0) AS earnings_from_user,

          (
            SELECT COUNT(*) 
            FROM users u2 
            WHERE u2.referred_by = u.referral_code
          ) AS total_count

      FROM users u

      JOIN user_profiles p 
        ON p.user_id = u.id

      LEFT JOIN referral_rewards rr
        ON rr.referred_id = u.id
        AND rr.referrer_id = $4
        AND rr.status = 'approved'

      WHERE u.referred_by = $1

      GROUP BY 
        u.id, u.username, u.status, u.referral_code, u.created_at,
        p.first_name, p.last_name, p.img_url, u.referral_code

      ORDER BY u.created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [userReferralCode, limit, offset, Number(myUserId)]
    );

    const rows = referredMembers.rows || referredMembers;

    return NextResponse.json({
      message: "success",
      data: rows,
      total: rows.length > 0 ? rows[0].total_count : 0
    });

  } catch (error) {
    return NextResponse.json(
      { message: "error", error: error.message },
      { status: 500 }
    );
  }
}
