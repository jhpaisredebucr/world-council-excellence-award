import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
        const offset = parseInt(searchParams.get("offset") || "0");
        const userId = searchParams.get("userId") || null;

        let orders;
        let totalResult;

        if (userId) {
            // Fetch orders filtered by user_id
            orders = await query(
                "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
                [userId, limit, offset]
            );
            totalResult = await query("SELECT COUNT(*) FROM orders WHERE user_id = $1", [userId]);
        } else {
            // Fetch all orders with pagination
            orders = await query(
                "SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2",
                [limit, offset]
            );
            totalResult = await query("SELECT COUNT(*) FROM orders");
        }

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
