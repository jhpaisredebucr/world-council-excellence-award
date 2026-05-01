import { query } from "@/lib/db";
import PackageShop from "@/app/components/member/PackageShop";

import { getPackages } from "@/lib/packages";
import { getUserFromToken } from "@/lib/users";
import { getMemberDashboardData } from "@/lib/dashboard";
import { getCurrentUserToken } from "@/lib/token";

export const revalidate = 120;

export default async function Page() {
  const user = await getCurrentUserToken();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const userId = user.id;
  const referral_code = user.referral_code;

  const dashboardData = await getMemberDashboardData({userReferralCode: referral_code});
  const userData = await getUserFromToken(userId);
  const packages = await getPackages();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Packages</h1>
      <PackageShop
        packages={packages.packages}
        userData={userData}
        dashboardData={dashboardData.dashboardData}
      />
    </div>
  );
}
