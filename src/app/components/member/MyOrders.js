//CLIENT COMPONENT

"use client"

import { format } from "date-fns";

export default function OrdersMember({ orders = [], products = [], userData }) {

    if (!userData) {
        return <p>Loading orders...</p>;
    }

    const hasOrder = orders.length > 0;

return (
        <div>
            <div className="hidden md:grid md:grid-cols-7 p-5 mt-5 bg-white font-semibold rounded-lg shadow-sm">
                <div>Date</div>
                <div>Product</div>
                <div>Quantity</div>
                <div>Amount</div>
                <div>Order ID</div>
                <div>Status</div>
                <div>Reference No.</div>
            </div>

            {/* ROWS */}
            {Array.isArray(orders) && orders.map((order, i) => {
                const product = products.find(p => p.id === order?.product_id);
                const status = order.status || 'pending';
                return (
                    <div key={order.id || i} className="mt-2 rounded-lg bg-white p-4 shadow-sm md:grid md:grid-cols-7 md:p-5">
                        <div className="mb-2 text-sm text-gray-600 md:mb-0 md:text-base md:text-black">
                            {format(new Date(order.created_at), "MMM dd, yyyy HH:mm")}
                        </div>

                        <div className="mb-1 md:mb-0">
                            <span className="text-xs text-gray-500 md:hidden">Product: </span>
                            {product?.product_name || 'Unknown Product'}
                        </div>

                        <div className="mb-1 md:mb-0">
                            <span className="text-xs text-gray-500 md:hidden">Quantity: </span>
                            {order.quantity || 0}
                        </div>

                        <div className="mb-1 md:mb-0">
                            <span className="text-xs text-gray-500 md:hidden">Amount: </span>
                            ₱{product?.price ? (product.price * order.quantity).toFixed(2) : '0.00'}
                        </div>

                        <div className="mb-1 md:mb-0 font-mono">
                            <span className="text-xs text-gray-500 md:hidden">Order ID: </span>
                            <span className="bg-gray-50 px-2 py-0.5 rounded text-xs">
                                #{order.id || `ORD-${order.id || "-"}`}
                            </span>
                        </div>

                        <div className="mb-1 md:mb-0">
                            <span className="text-xs text-gray-500 md:hidden">Status: </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                status === 'approved' 
                                    ? 'bg-green-100 text-green-800'
                                    : status === 'rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : status === 'pending'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {status}
                            </span>
                        </div>

                        <div className="mb-1 md:mb-0 font-mono">
                            <span className="text-xs text-gray-500 md:hidden">Reference No: </span>
                            <span className="bg-gray-50 px-2 py-0.5 rounded text-xs">
                                {order.reference_number || 'N/A'}
                            </span>
                        </div>
                    </div>
                );
            })}

            {(!Array.isArray(orders) || orders.length === 0) && (
                <div className="p-8 text-center text-gray-500">
                    No orders found
                </div>
            )}
        </div>
    );
}