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
  const [filterUserId, setFilterUserId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 20;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData(newPage, filterUserId);
  };

  const handleNextPage = () => {
    if (pagination?.hasMore) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleUserFilterChange = (userId) => {
    setFilterUserId(userId);
    setCurrentPage(0);
    fetchData(0, userId);
  };

  const fetchData = async (page = currentPage, userId = filterUserId) => {
    // Ensure we always use the latest filter before requesting data
    const effectiveUserId = userId || filterUserId;
    try {
      const offset = page * limit;

      // Build URL with optional userId filter
      let ordersUrl = `/api/products/orders?limit=${limit}&offset=${offset}`;
      if (effectiveUserId) {
        ordersUrl += `&userId=${effectiveUserId}`;
      }

      // Fetch orders with pagination
      const resOrders = await fetch(ordersUrl);
      const ordersData = await resOrders.json();
      setOrders(ordersData.orders || []);
      setPagination(ordersData.pagination || null);

      // Fetch products and packages for display (only on first load)
      if (products.length === 0) {
        const resProducts = await fetch("/api/products");
        const productsData = await resProducts.json();
        // Combine products and packages into one array for name/price lookup
        const allProducts = [
          ...(productsData.products || []),
          ...(productsData.packages || [])
        ];
        setProducts(allProducts);
      }

      // Fetch users (only on first load)
      if (users.length === 0) {
        const resUsers = await fetch("/api/users?list=true");
        const usersData = await resUsers.json();
        setUsers(usersData.users || []);
      }
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
    fetchData(0, filterUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper functions
  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product?.package_name || product?.product_name || product?.name || `Product #${productId}`;
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

  // Filter orders by status (client-side)
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
            onClick={() => { fetchData(); }}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
          >
            Refresh
          </button>
          {/* User Filter */}
          <select
            value={filterUserId}
            onChange={(e) => handleUserFilterChange(e.target.value)}
            className="px-4 py-2 border rounded max-w-[200px]"
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
          {/* Status Filter */}
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

      {/* Active User Filter Badge */}
      {filterUserId && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm text-gray-500">Showing orders for:</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {getUserName(Number(filterUserId))}
            <button
              onClick={() => handleUserFilterChange("")}
              className="ml-1 text-blue-400 hover:text-blue-700 font-bold"
              title="Clear filter"
            >
              ✕
            </button>
          </span>
        </div>
      )}

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
          <p className="text-2xl font-bold text-gray-600">{pagination?.total ?? orders.length}</p>
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
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : order.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : order.status === "pending"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
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

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex justify-between items-center mt-6 text-sm text-gray-500 pb-6">
          <div className="flex items-center gap-2">
            <span>Page {currentPage + 1} of {Math.max(1, Math.ceil(pagination.total / pagination.limit))}</span>
            <span className="text-gray-400">({pagination.total} total orders)</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={!pagination.hasMore}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
