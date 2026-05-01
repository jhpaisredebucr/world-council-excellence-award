import { query } from "@/lib/db";
import Shop from "@/app/components/member/Shop";
import { getUserFromToken } from "@/lib/users";
import { getMemberDashboardData } from "@/lib/dashboard";
import { getCurrentUserToken } from "@/lib/token";

export const revalidate = 120;

export default async function Page() {
  const user = await getCurrentUserToken();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const referral_code = user.referral_code;

  const [dashboardData, userData, productsData, packagesData] = await Promise.all([
    getMemberDashboardData({ userReferralCode: referral_code }),
    getUserFromToken(user.id),
    query("SELECT * FROM products"),
    query("SELECT * FROM packages"),
  ]);

  const products = productsData.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  const packages = packagesData.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return (
    <div>
      <Shop
        products={products}
        packages={packages}
        userData={userData}
        dashboardData={dashboardData.dashboardData}
      />
    </div>
  );
}