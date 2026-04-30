//SERVER COMPONENT

import { getOrders } from "@/lib/orders";
import { getProducts } from "@/lib/products";
import { getCurrentUserToken } from "@/lib/token";
import { getUserFromToken } from "@/lib/users";

import OrdersMember from "@/app/components/member/MyOrders";

export default async function Page() {
  const user = await getCurrentUserToken();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const userId = user.id;

  const orders = await getOrders(userId);
  const products = await getProducts();
  const userData = getUserFromToken(userId);

  // -----------------------
  // MAIN UI
  // -----------------------
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">My Orders</h1>

      <OrdersMember
        orders={orders.orders}
        products={products.products}
        userData={userData}
      />
    </div>
  );
}