import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req) {
    try {
        const res = await query("SELECT * FROM orders ORDER BY created_at DESC");

        if (!res || res.length === 0) {
            return NextResponse.json({ orders: [] }, { status: 200 });
        }

        return NextResponse.json({ orders: res }, { status: 200 });

    } catch (err) {
        console.error("Failed to fetch orders:", err);
        return NextResponse.json(
            { message: "Failed to fetch orders. Please try again." },
            { status: 500 }
        );
    }
}
