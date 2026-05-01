import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req) {
  try {
    // ─── Auth ────────────────────────────────────────────────────────────────
    const decoded = await requireAdmin(req);
    if (decoded instanceof NextResponse) return decoded;

    const body = await req.json();
    const { newUserId, referrerId } = body;

    // Validate both IDs are provided
    if (!newUserId || !referrerId) {
      return NextResponse.json(
        { success: false, message: "newUserId and referrerId are required" },
        { status: 400 }
      );
    }

    // Verify the new user exists
    const newUserCheck = await query(
      "SELECT id FROM users WHERE id = $1",
      [Number(newUserId)]
    );
    if (!newUserCheck.length) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Validate referrer exists
    const referrerCheck = await query(
      "SELECT id, referral_code FROM users WHERE referral_code = $1 OR id = $1",
      [referrerId]
    );
    if (!referrerCheck.length) {
      return NextResponse.json(
        { success: false, message: "Invalid referrer code" },
        { status: 400 }
      );
    }

    const referrerIdNum = Number(referrerId);

    // Check if referral relationship already exists
    const existingRef = await query(
      "SELECT 1 FROM referrals WHERE descendant_id = $1 AND ancestor_id = $2 LIMIT 1",
      [Number(newUserId), referrerIdNum]
    );
    if (existingRef.length) {
      return NextResponse.json(
        { success: false, message: "Referral relationship already exists" },
        { status: 409 }
      );
    }

    // Build referral tree: insert all ancestors of referrer + the direct link
    await query(
      `INSERT INTO referrals (ancestor_id, descendant_id, depth)
       SELECT ancestor_id, $1::int, depth + 1
       FROM referrals
       WHERE descendant_id = $2::int
       UNION ALL
       SELECT $2::int, $1::int, 1`,
      [Number(newUserId), referrerIdNum]
    );

    return NextResponse.json({ success: true, message: "Referral link created" });

  } catch (error) {
    console.error("[referrals/route.js] error:", error);
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
    console.error("[referrals/route.js] GET error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}