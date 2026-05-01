import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req) {
  try {
    // ─── Auth ────────────────────────────────────────────────────────────────
    const decoded = await requireAdmin(req);
    if (decoded instanceof NextResponse) return decoded;

    const {
      title,
      caption,
      description,
    } = await req.json();

    if (!title || !caption || !description) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (title.length > 255 || caption.length > 500) {
      return NextResponse.json(
        { success: false, message: "Title or caption too long" },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO announcement (title, short_description, long_description)
       VALUES ($1, $2, $3)`,
      [title.trim(), caption.trim(), description.trim()]
    );

    return NextResponse.json({
      success: true,
      message: "Announcement created successfully",
    });

  } catch (error) {
    console.error("[announcement/post] error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}