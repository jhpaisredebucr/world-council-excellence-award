import Commissions from "@/app/components/member/Commissions";
import { getUserCommissions, getAdminCommissions } from "@/lib/commissions";
import { getCurrentUserToken } from "@/lib/token";

export const revalidate = 60;

export default async function Page() {

  const user = await getCurrentUserToken();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const userId = user.id;
  const role = user.role;

  const commissions =
    role === "admin"
      ? await getAdminCommissions()
      : await getUserCommissions(userId);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Commissions</h1>
      <Commissions commissions={commissions} />
    </div>
  );
}