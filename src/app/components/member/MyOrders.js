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
            <div className="hidden md:grid md:grid-cols-6 p-5 mt-5 bg-white font-semibold rounded-lg shadow-sm">
                <div>Date</div>
                <div>Product</div>
                <div>Quantity</div>
                <div>Amount</div>
                <div>Order ID</div>
                <div>Reference No.</div>
            </div>

            {/* ROWS */}
            {Array.isArray(orders) && orders.map((order, i) => {
                const product = products.find(p => p.id === order?.product_id);
                return (
                    <div key={order.id || i} className="mt-2 rounded-lg bg-white p-4 shadow-sm md:grid md:grid-cols-6 md:p-5">
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

                        <div className="mb-1 md:mb-0 break-all">
                            <span className="text-xs text-gray-500 md:hidden">Order ID: </span>
                            {order.id || `ORD-${order.id || "-"}`}
                        </div>

                        <div className="mb-1 md:mb-0 break-all">
                            <span className="text-xs text-gray-500 md:hidden">Reference No: </span>
                            {order.reference_number || 'N/A'}
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