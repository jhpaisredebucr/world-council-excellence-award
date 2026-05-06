import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const { searchParams } = new URL(req.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
        const offset = parseInt(searchParams.get("offset") || "0");

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized (no token)" },
                { status: 401 }
            );
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 401 }
            );
        }

        const userID = decoded.id;

        // Fetch user orders with pagination
        const orders = await query(
            "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
            [userID, limit, offset]
        );

        // Get total count for pagination
        const totalResult = await query("SELECT COUNT(*) FROM orders WHERE user_id = $1", [userID]);
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
        console.error("Failed to fetch user orders:", err);
        return NextResponse.json(
            { success: false, message: "Failed to fetch orders. Please try again." },
            { status: 500 }
        );
    }
}
