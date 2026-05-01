import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function PUT(req) {
  try {
    // ─── Auth ────────────────────────────────────────────────────────────────
    const decoded = await requireAuth(req);
    if (decoded instanceof NextResponse) return decoded;

    const tokenUserID = decoded.id;

    const body = await req.json();
    const { userInfo, profile, contacts, address } = body;

    // Users can only update their own profile (admins could be added later)
    const targetUserID = Number(userInfo?.id);
    if (!targetUserID) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    // Security: ensure the authenticated user is updating their own profile
    if (tokenUserID !== targetUserID) {
      return NextResponse.json(
        { success: false, message: "Forbidden — you can only update your own profile" },
        { status: 403 }
      );
    }

    // ─── Input validation ──────────────────────────────────────────────────
    if (!profile?.first_name || !profile?.last_name) {
      return NextResponse.json(
        { success: false, message: "First name and last name are required" },
        { status: 400 }
      );
    }

    if (contacts?.email && !contacts.email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    // ─── Update users table ────────────────────────────────────────────────
    if (userInfo?.username) {
      await query(
        `UPDATE users SET username = $1 WHERE id = $2`,
        [userInfo.username.trim(), targetUserID]
      );
    }

    // ─── Update profile table ──────────────────────────────────────────────
    await query(
      `UPDATE user_profiles
       SET first_name   = $1,
           middle_name  = $2,
           last_name    = $3,
           dob          = $4,
           img_url      = $5
       WHERE user_id = $6`,
      [
        profile.first_name.trim(),
        profile.middle_name || "",
        profile.last_name.trim(),
        profile.dob || null,
        // Sanitize img_url — block javascript: etc
        profile.img_url?.startsWith("http") ? profile.img_url : null,
        targetUserID,
      ]
    );

    // ─── Update contact table ──────────────────────────────────────────────
    if (contacts) {
      await query(
        `UPDATE user_contacts
         SET email       = $1,
             contact_no  = $2
         WHERE user_id = $3`,
        [
          contacts.email?.trim() || "",
          contacts.contact_no?.trim() || "",
          targetUserID,
        ]
      );
    }

    // ─── Update address table ──────────────────────────────────────────────
    if (address) {
      await query(
        `UPDATE user_addresses
         SET city          = $1,
             barangay      = $2,
             postal_code    = $3,
             street_address = $4
         WHERE user_id = $5`,
        [
          address.city || "",
          address.barangay || "",
          address.postal_code || "",
          address.street_address || "",
          targetUserID,
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });

  } catch (err) {
    console.error("[users/update] error:", err);
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
}