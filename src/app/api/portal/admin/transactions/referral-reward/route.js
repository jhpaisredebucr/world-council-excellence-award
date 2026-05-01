import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req) {
    try {
        const { referral_code, referred_id, reward_amount } = await req.json();

        const referrerIDResult = await query(
            `
                SELECT * FROM users WHERE referral_code=$1
            `,
            [referral_code]
        )

        const referrerIDRes = referrerIDResult[0];

        if (!referrerIDRes) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid referral code - no user found",
                    referral_code
                },
                { status: 400 }
            );
        }

        await query(
            `
                INSERT INTO referral_rewards (referrer_id, referred_id, reward_amount)
                VALUES ($1, $2, $3)
            `,
            [referrerIDRes.id, referred_id, reward_amount]
        );

        await query(
            `
                UPDATE users
                SET pc_credit = pc_credit + $1
                WHERE id = $2;
            `, [reward_amount, referrerIDRes.id]
        )

        return NextResponse.json({ message: "referral transaction successful", reward_amount });
    }
    catch(error) {
        console.error("Approval error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message, // show actual error temporarily
            },
            { status: 500 }
        );
    }

    // const { referral_code, referred_id, reward_amount } = await req.json();

    // const referrerIDResult = await query(
    //     `
    //         SELECT * FROM users WHERE referral_code=$1
    //     `,
    //     [referral_code]
    // )

    // const referrerIDRes = referrerIDResult[0];
    // const userID = referrerIDRes.id;

    // return NextResponse.json({userID});
}