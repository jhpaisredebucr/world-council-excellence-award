import { query } from "@/lib/db";

export async function getUserFromToken(userID) {
  try {
    // -----------------------
    // 1. MAIN USER
    // -----------------------
    const userRes = await query(
      `SELECT id, username, referral_code, referred_by, role, created_at 
       FROM users 
       WHERE id = $1`,
      [userID]
    );

    if (!userRes.length) {
      throw new Error("User not found");
    }

    const user = userRes[0];

    // -----------------------
    // 2. PROFILE
    // -----------------------
    const profileRes = await query(
      `SELECT * FROM user_profiles WHERE user_id = $1`,
      [userID]
    );

    // -----------------------
    // 3. CONTACTS
    // -----------------------
    const contactRes = await query(
      `SELECT * FROM user_contacts WHERE user_id = $1`,
      [userID]
    );

    // -----------------------
    // 4. ADDRESS
    // -----------------------
    const addressRes = await query(
      `SELECT * FROM user_addresses WHERE user_id = $1`,
      [userID]
    );

    // -----------------------
    // 5. REFERRED USER
    // -----------------------
    let referredBy = null;

    if (user.referred_by) {
      const ref = await query(
        `SELECT id, username, referral_code 
         FROM users 
         WHERE referral_code = $1`,
        [user.referred_by]
      );

      referredBy = ref[0] || null;
    }

    return {
      userInfo: user,
      profile: profileRes[0] || null,
      contacts: contactRes[0] || null,
      address: addressRes[0] || null,
      referredBy,
    };
  } catch (error) {
    console.error("[getUserFromToken] error:", error);
    throw error;
  }
}