import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      username,
      referralCode,
      password,
      email,
      contactNumber,
      firstName,
      middleName,
      lastName,
      dob,
      city,
      barangay,
      streetAddress,
      postalCode,
      packagePrice,
      maxLevel,
      paymentMethod,
      captchaToken,
      status: signupStatus,
    } = body;

    // ─── Verify reCAPTCHA token ──────────────────────────────────────────
    if (!captchaToken) {
      return NextResponse.json({ 
        success: false, 
        message: "Captcha verification required" 
      }, { status: 400 });
    }

    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY || "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"}&response=${captchaToken}`,
    });

    const recaptchaResult = await recaptchaResponse.json();

    if (!recaptchaResult.success) {
      return NextResponse.json({ 
        success: false, 
        message: "Captcha verification failed" 
      }, { status: 400 });
    }

    // ─── Validate required fields ──────────────────────────────────────────
    if (!username || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: "Username, password, first name, and last name are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // ─── Check username uniqueness ─────────────────────────────────────────
    const existingUser = await query(
      "SELECT id FROM users WHERE username = $1",
      [username.trim()]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: "Username is already taken" },
        { status: 409 }
      );
    }

    const hashedPass = await bcrypt.hash(password, 10);

    // ─── Generate unique referral code ─────────────────────────────────────
    const code = `WCEA-${nanoid(7).toUpperCase()}`;

    // ─── Insert into users ─────────────────────────────────────────────────
    const result = await query(
      `INSERT INTO users (username, password, referred_by, referral_code, package, max_levels, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        username.trim(),
        hashedPass,
        referralCode || null,
        code,
        packagePrice || null,
        maxLevel || null,
        paymentMethod || null,
      ]
    );

    const user = result[0];
    const userID = user.id;

    // ─── Insert into user_contacts ─────────────────────────────────────────
    await query(
      `INSERT INTO user_contacts (user_id, email, contact_no)
       VALUES ($1, $2, $3)`,
      [userID, email?.trim() || "", contactNumber?.trim() || ""]
    );

    // ─── Insert into user_profiles ─────────────────────────────────────────
    await query(
      `INSERT INTO user_profiles (user_id, first_name, middle_name, last_name, dob)
       VALUES ($1, $2, $3, $4, $5)`,
      [userID, firstName.trim(), middleName?.trim() || "", lastName.trim(), dob || null]
    );

    // ─── Insert into user_addresses ────────────────────────────────────────
    await query(
      `INSERT INTO user_addresses (user_id, city, barangay, postal_code, street_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [userID, city || "", barangay || "", postalCode || "", streetAddress || ""]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Successfully signed up",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          referral_code: user.referral_code,
        },
      },
      { status: 201 }
    );

  } catch (err) {
    console.error("[signup] error:", err);
    // Handle unique constraint violation from the DB
    if (err.code === "23505") {
      return NextResponse.json(
        { success: false, message: "Username or email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}