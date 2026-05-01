import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import {nanoid} from "nanoid";

export async function POST(req) {
    try {
        const body = await req.json();
const {
            //users
            // Keep username case-sensitive (as-is)
            username,
            referralCode,
            password,
            //user_contacts
            email,
            contactNumber,
            // user_profiles
            firstName,
            middleName,
            lastName,
            dob,
            city,
            barangay,
            streetAddress,
            postalCode,
            // Step 3
            packagePrice,
            maxLevel,
            // Step 4
            paymentMethod,
            paymentUrl,
            // Step 5
            status
        } = body;

        const hashedPass = await bcrypt.hash(password, 10);

        //user referral code
        function generateReferralCode() {
            let code = `MEM-${nanoid(6).toUpperCase()}`;
            
            return code;
        }

        const code = generateReferralCode();

        //users
        const result = await query(
            `
                INSERT INTO users (username, password, referred_by, referral_code, package, max_levels, payment_method)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `,
[username, hashedPass, referralCode, code, packagePrice, maxLevel, paymentMethod]
        );

        const user = result[0];
        const userID = user.id;

        //user contacts
        await query(
            `
                INSERT INTO user_contacts (user_id, email, contact_no)
                VALUES ($1, $2, $3)
            `,
            [userID, email, contactNumber]
        );

        //user profiles
        await query(
            `
                INSERT INTO user_profiles (user_id, first_name, middle_name, last_name, dob)
                VALUES ($1, $2, $3, $4, $5)
            `,
            [userID, firstName, middleName, lastName, dob]
        );

        //user addresses
        await query(
            `
                INSERT INTO user_addresses (user_id, city, barangay, postal_code, street_address)
                VALUES ($1, $2, $3, $4, $5)
            `,
            [userID, city, barangay, postalCode, streetAddress]
        );

        return NextResponse.json({
            success: true,
            message: "Successfully signed up",
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                referral_code: user.referral_code
            }},
            {status: 201}
        );

    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            message: err.message
        },{status: 500});
    }
}