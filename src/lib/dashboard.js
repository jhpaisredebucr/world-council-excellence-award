import { query } from "@/lib/db";

export async function getMemberDashboardData({
  userReferralCode,
  limit = 20,
  offset = 0,
}) {
  try {
    if (!userReferralCode) {
      throw new Error("userReferralCode required");
    }

    const safeLimit = Math.min(parseInt(limit), 100);
    const safeOffset = parseInt(offset);

    // Get total count of level 1 referred members
    const totalCountRes = await query(
      `SELECT COUNT(*) AS total_count FROM users WHERE referred_by = $1`,
      [userReferralCode]
    );

    const totalReferredMembers = Number(totalCountRes[0]?.total_count || 0);

    // Get referred members (level 1 descendants)
    const referredMembers = await query(
      `
      SELECT 
          u.id,
          u.username,
          u.status,
          u.referral_code,
          u.created_at,
          p.first_name,
          p.last_name
      FROM users u
      JOIN user_profiles p ON p.user_id = u.id
      WHERE u.referred_by = $1
      ORDER BY u.created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [userReferralCode, safeLimit, safeOffset]
    );

    const pendingCount = referredMembers.filter(
      (member) => member.status === "pending"
    ).length;

    // Total commission
    const totalCommissionRes = await query(
      `
      SELECT COALESCE(SUM(rr.reward_amount), 0) AS total_commission
      FROM referral_rewards rr
      JOIN users u ON u.id = rr.referrer_id
      WHERE u.referral_code = $1
      `,
      [userReferralCode]
    );

    // Total spent
    const totalOrderRes = await query(
      `
      SELECT COALESCE(SUM(p.price), 0) AS total_spent
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN users u ON u.id = o.user_id
      WHERE u.referral_code = $1
      `,
      [userReferralCode]
    );

    const totalCommissionValue = Number(
      totalCommissionRes[0]?.total_commission || 0
    );

    const totalSpent = Number(
      totalOrderRes[0]?.total_spent || 0
    );

    const userBalance = totalCommissionValue - totalSpent;

    const activeMembers = totalReferredMembers - pendingCount;

    return {
      dashboardData: {
        totalReferredMembers,
        pendingCount,
        activeMembers,
        totalCommissionValue,
        totalSpent,
        userBalance,
        referredMembers,
      },
      pagination: {
        limit: safeLimit,
        offset: safeOffset,
        total: totalReferredMembers,
        hasMore: referredMembers.length === safeLimit,
      },
    };
  } catch (error) {
    console.error("[getReferralDashboardData] error:", error);
    throw error;
  }
}
