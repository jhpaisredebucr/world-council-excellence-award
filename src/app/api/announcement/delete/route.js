import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(req) {
  try {
    // ─── Auth ────────────────────────────────────────────────────────────────
    const decoded = await requireAdmin(req);
    if (decoded instanceof NextResponse) return decoded;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing id parameter" },
        { status: 400 }
      );
    }

    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid announcement ID" },
        { status: 400 }
      );
    }

    const result = await query(
      `DELETE FROM announcement WHERE id = $1 RETURNING id`,
      [idNum]
    );

    if (!result.length) {
      return NextResponse.json(
        { success: false, message: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully",
    });

  } catch (error) {
    console.error("[announcement/delete] error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}