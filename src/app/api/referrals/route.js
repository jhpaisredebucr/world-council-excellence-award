import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req) {
  try {
    // ─── Auth ─────────────────────────────────────────────
    let decoded;
    try {
      decoded = await requireAdmin(req);
    } catch {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    if (decoded instanceof NextResponse) return decoded;

    // ─── Body ─────────────────────────────────────────────
    const { newUserId, referrerId } = await req.json();

    if (!newUserId || !referrerId) {
      return NextResponse.json(
        { success: false, message: "newUserId and referrerId are required" },
        { status: 400 }
      );
    }

    const newUserIdNum = Number(newUserId);
    if (isNaN(newUserIdNum)) {
      return NextResponse.json(
        { success: false, message: "Invalid newUserId" },
        { status: 400 }
      );
    }

    // ─── Check new user exists ────────────────────────────
    const newUser = await query(
      "SELECT id FROM users WHERE id = $1",
      [newUserIdNum]
    );

    if (!newUser.length) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ─── Resolve referrer (ID or referral_code) ───────────
    const referrer = await query(
      `SELECT id FROM users 
       WHERE id::text = $1 OR referral_code = $1
       LIMIT 1`,
      [String(referrerId)]
    );

    if (!referrer.length) {
      return NextResponse.json(
        { success: false, message: "Invalid referrer" },
        { status: 400 }
      );
    }

    const referrerIdNum = referrer[0].id;

    // Prevent self-referral
    if (referrerIdNum === newUserIdNum) {
      return NextResponse.json(
        { success: false, message: "User cannot refer themselves" },
        { status: 400 }
      );
    }

    // ─── Prevent duplicates ───────────────────────────────
    const existing = await query(
      `SELECT 1 FROM referrals 
       WHERE ancestor_id = $1 AND descendant_id = $2
       LIMIT 1`,
      [referrerIdNum, newUserIdNum]
    );

    if (existing.length) {
      return NextResponse.json(
        { success: false, message: "Referral already exists" },
        { status: 409 }
      );
    }

    // ─── Insert referral tree ─────────────────────────────
    await query(
      `INSERT INTO referrals (ancestor_id, descendant_id, depth)
       
       SELECT ancestor_id, $1::int, depth + 1
       FROM referrals
       WHERE descendant_id = $2::int

       UNION ALL

       SELECT $2::int, $1::int, 1`,
      [newUserIdNum, referrerIdNum]
    );

    return NextResponse.json({
      success: true,
      message: "Referral link created",
    });

  } catch (error) {
    console.error("[referrals POST] error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const decoded = await requireAdmin(req);
    if (decoded instanceof NextResponse) return decoded;

    const referrals = await query(
      `SELECT r.*,
              a.username AS ancestor_username,
              d.username AS descendant_username
       FROM referrals r
       JOIN users a ON a.id = r.ancestor_id
       JOIN users d ON d.id = r.descendant_id
       ORDER BY r.depth ASC`
    );

    return NextResponse.json({ success: true, referrals });

  } catch (error) {
    console.error("[referrals GET] error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}