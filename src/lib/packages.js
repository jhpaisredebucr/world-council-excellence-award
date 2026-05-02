import { query } from "@/lib/db";

export async function getPackages() {
  try {
    const packages = await query("SELECT * FROM packages");

    const formattedPackages = packages.map((packageItem) => ({
      ...packageItem,
      price: Number(packageItem.price),
    }));

    return {
      success: true,
      packages: formattedPackages,
    };
  } catch (err) {
    console.error("[getPackages] error:", err);

    return {
      success: false,
      message: err.message || "Failed to fetch packages",
      packages: [],
    };
  }
}

export async function getPackageOrders(userId) {
  try {
const res = await query("SELECT * FROM orders WHERE user_id = $1 AND package_id IS NOT NULL ORDER BY created_at DESC", [userId]);

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
    console.error("[getPackageOrders] error:", err);

    return {
      success: false,
      message: err.message || "Failed to fetch package orders. Please try again.",
      orders: [],
    };
  }
}
