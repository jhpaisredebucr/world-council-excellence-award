import { query } from "@/lib/db";

export async function getOrders(userId) {
  try {
const res = await query("SELECT * FROM orders WHERE user_id =$1 ORDER BY created_at DESC", [userId]);

    if (!res || res.length === 0) {
      return {
        success: true,
        orders: [],
      };
    }

    return {
      success: true,
      orders: res,
    };
  } catch (err) {
    console.error("[getOrders] error:", err);

    return {
      success: false,
      message: err.message || "Failed to fetch orders. Please try again.",
      orders: [],
    };
  }
}