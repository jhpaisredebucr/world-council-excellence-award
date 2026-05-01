import DashboardAdmin from "@/app/components/admin/Dashboard";
import { getUserFromToken } from "@/lib/users";
import { getAdminAnalytics } from "@/lib/analytics";
import { getCurrentUserToken } from "@/lib/token";

export const revalidate = 60;

export default async function AdminPage() {
  const user = await getCurrentUserToken();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const userId = user.id;

  const userData = await getUserFromToken(userId);
  const dashboardData = await getAdminAnalytics();

  return (
    <DashboardAdmin
      dashboardData={dashboardData}
      userData={userData}
    />
  );
}