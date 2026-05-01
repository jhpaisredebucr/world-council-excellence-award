import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "5"), 20);
    const offset = parseInt(searchParams.get("offset") || "0");

    const announcements = await query(
      `SELECT * FROM announcement ORDER BY id DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("[announcement/route.js] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}