import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
        const offset = parseInt(searchParams.get("offset") || "0");

        // Fetch orders with pagination
        const orders = await query(
            "SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2",
            [limit, offset]
        );

        // Get total count for pagination
        const totalResult = await query("SELECT COUNT(*) FROM orders");
        const total = Number(totalResult[0].count);

        return NextResponse.json({
            success: true,
            orders: orders || [],
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total
            }
        }, { status: 200 });

    } catch (err) {
        console.error("Failed to fetch orders:", err);
        return NextResponse.json(
            { success: false, message: "Failed to fetch orders. Please try again." },
            { status: 500 }
        );
    }
}
