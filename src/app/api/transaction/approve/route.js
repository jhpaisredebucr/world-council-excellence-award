import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PATCH(req) {

    try {
        const { transactionId } = await req.json();

        // Validate input
        if (!transactionId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Transaction ID is required",
                },
                { status: 400 }
            );
        }
const result = await query(
            `
            UPDATE transactions
            SET status = $1
            WHERE id = $2
            AND status = $3
            RETURNING user_id, status
            `,
            ["approved", transactionId, "pending"]
        );

        // If no rows updated
        if (result.rowCount === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Transaction not eligible for approval",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Transaction approved successfully",
            updatedUser: result[0],
        });

    } catch (error) {
        console.error("Approval error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message, // show actual error temporarily
            },
            { status: 500 }
        );
    }
}