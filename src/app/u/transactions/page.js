//SERVER COMPONENT

import TransactionsContainer from "@/app/components/member/TransactionsContainer";
import { getTransactions } from "@/lib/transaction";
import { getCurrentUserToken } from "@/lib/token";

export const revalidate = 10;

export default async function Page() {
  const user = await getCurrentUserToken();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const userId = user.id;
  const role = user.role;

  const transactions = await getTransactions({userID: userId, role: role});
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Transactions</h1>
      <TransactionsContainer transactions={transactions.transactions}/>
    </div>
  )
}