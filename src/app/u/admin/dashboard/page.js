import DashboardAdmin from "@/app/components/admin/Dashboard";
import { getUserFromToken } from "@/lib/users";
import { getAdminAnalytics } from "@/lib/analytics";
import { getCurrentUserToken } from "@/lib/token";

export const revalidate = 60;

export default async function AdminPage() {
  try {
    const user = await getCurrentUserToken();
    
    if (!user) {
      return <div>Unauthorized</div>;
    }

    const userId = user.id;

    // USER
    const userData = await getUserFromToken(userId);

    // DASHBOARD
    const dashboardData = await getAdminAnalytics();

    return (
      <DashboardAdmin
        dashboardData={dashboardData}
        userData={userData}
      />
    );
  } catch (error) {
    console.error("[admin/dashboard/page.js] error:", error);
    return <div className="p-6 text-red-500">Error loading admin dashboard. Please try again later.</div>;
  }
}