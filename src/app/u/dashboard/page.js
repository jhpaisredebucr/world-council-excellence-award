//SERVER COMPONENT

import DashboardMember from "@/app/components/member/Dashboard";
import Transactions from "@/app/components/member/Transactions";

import { getCurrentUserToken } from "@/lib/token";
import { getUserFromToken } from "@/lib/users";
import { getMemberDashboardData } from "@/lib/dashboard";
import { getTransactions } from "@/lib/transaction";

export const revalidate = 10;

export default async function Page() {

  const user = await getCurrentUserToken();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const userId = user.id;
  const role = user.role;
  const referral_code = user.referral_code;

  const dashboardData = await getMemberDashboardData({userReferralCode: referral_code});
  const userData = await getUserFromToken(userId);
  const transactions = await getTransactions({ userID: userId , role: role });
  console.log(dashboardData);

  // MAIN
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      <DashboardMember dashboardData={dashboardData.dashboardData} userData={userData} />
      <h2 className="text-2xl text-center font-semibold my-6 p-6 rounded-lg shadow bg-white">Latest Transaction</h2>
      <Transactions transactions={transactions.transactions} limit={3}/>
      {/* <MembershipFormPage></MembershipFormPage> */}
    </div>
  );
}