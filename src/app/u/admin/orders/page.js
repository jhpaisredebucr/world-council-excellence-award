'use client';

import { useEffect, useState } from "react";
import { format } from "date-fns";
import OrderApproveModal from "./OrderApproveModal";
import ProfileModal from "@/app/components/admin/ProfileModal";

export default function Page() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch orders
      const resOrders = await fetch("/api/products/orders");
      const ordersData = await resOrders.json();
      setOrders(ordersData.orders || []);

      // Fetch products for display
      const resProducts = await fetch("/api/products");
      const productsData = await resProducts.json();
      setProducts(productsData.products || []);

// Fetch users
      const resUsers = await fetch("/api/users?list=true");
      const usersData = await resUsers.json();
      setUsers(usersData.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId, action = "approve") => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/products/orders/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        // Refresh data
        await fetchData();
      } else {
        alert(data.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
      setSelectedOrder(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

// Helper functions
  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product?.product_name || product?.name || `Product #${productId}`;
  };

  const getProductPrice = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product?.price || 0;
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return `User #${userId}`;
    return `${user.first_name} ${user.last_name}`;
  };

  const getUserEmail = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user?.email || "";
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-dashed"></div>
          <div className="text-xl text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

return (
    <div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold">Order Approvals</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
          >
            Refresh
          </button>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All Orders</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold">
            {orders.filter((o) => o.status === "pending").length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter((o) => o.status === "approved").length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-600">{orders.length}</p>
        </div>
      </div>

{/* Table Header */}
      <div className="hidden md:grid md:grid-cols-6 gap-4 p-4 bg-white font-semibold rounded-xl shadow-sm text-sm text-gray-500">
        <div>Date</div>
        <div>Order ID</div>
        <div>Customer</div>
        <div>Product</div>
        <div>Total</div>
        <div>Status</div>
      </div>

      {/* Order Rows */}
      {filteredOrders.length === 0 ? (
        <div className="p-10 text-center text-gray-400 mt-3 rounded-xl bg-white shadow-sm">
          No orders found
        </div>
      ) : (
        filteredOrders.map((order, i) => {
          const productPrice = getProductPrice(order.product_id);
          const total = Number(productPrice) * Number(order.quantity || 1);

return (
            <div
              key={order.id || i}
              className="mt-3 rounded-xl bg-white p-5 shadow-sm md:grid md:grid-cols-6 md:gap-4"
            >
              <div className="text-sm">
                <span className="text-xs text-gray-400 md:hidden">Date: </span>
                {order.created_at
                  ? format(new Date(order.created_at), "MMM dd, yyyy HH:mm")
                  : "N/A"}
              </div>

              <div className="text-sm font-mono md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Order ID: </span>
                <span className="bg-gray-50 px-2 py-0.5 rounded text-xs">
                  #{order.id}
                </span>
              </div>

              <div className="text-sm md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Customer: </span>
                <div className="font-medium">{getUserName(order.user_id)}</div>
              </div>

<div className="text-sm md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Product: </span>
                {getProductName(order.product_id)} x{order.quantity || 1}
              </div>

              <div className="text-sm font-medium md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Total: </span>
                ₱{total.toLocaleString()}
              </div>

              <div className="text-sm md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Status: </span>
                <span
                  className={
                    order.status === "approved"
                      ? "text-green-600"
                      : order.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-500"
                  }
                >
                  {order.status || "pending"}
                </span>
              </div>

<div className="mt-2 flex flex-wrap items-center gap-2 md:flex-nowrap md:mt-0">
                <button
                  onClick={() => setSelectedUserId(order.user_id)}
                  className="rounded-lg border-2 border-blue-500 bg-white px-3 py-1.5 text-xs font-semibold text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200"
                >
                  Details
                </button>

                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() => setSelectedOrder({ ...order, action: "approve" })}
                      className="rounded-lg border-2 border-green-500 bg-white px-3 py-1.5 text-xs font-semibold text-green-500 hover:bg-green-500 hover:text-white transition-all duration-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setSelectedOrder({ ...order, action: "reject" })}
                      className="rounded-lg border-2 border-red-500 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })
      )}

{/* Modal */}
      <OrderApproveModal
        isOpen={!!selectedOrder}
        order={selectedOrder}
        loading={actionLoading}
        onClose={() => setSelectedOrder(null)}
        onConfirm={handleApprove}
        productName={selectedOrder ? getProductName(selectedOrder.product_id) : ""}
        userName={selectedOrder ? getUserName(selectedOrder.user_id) : ""}
      />

      {/* User Details Modal */}
      <ProfileModal
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        userId={selectedUserId}
      />
    </div>
  );
}
