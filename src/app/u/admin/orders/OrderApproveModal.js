'use client';

import { useState } from "react";
import ProfileModal from "@/app/components/admin/ProfileModal";

export default function OrderApproveModal({ isOpen, order, loading, onClose, onConfirm, productName = "", userName = "" }) {
  const [showAddress, setShowAddress] = useState(false);

  if (!isOpen || !order) return null;

  const isApprove = order.action === "approve";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="mb-4 text-xl font-bold">
          {isApprove ? "Approve Order" : "Reject Order"}
        </h3>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="font-medium">Order ID:</span>
            <span className="font-mono">#{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Customer:</span>
            <span>{userName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Product:</span>
            <span>{productName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Quantity:</span>
            <span>{order.quantity || 1}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-medium">Status:</span>
            <span className={isApprove ? "text-green-600" : "text-red-600"}>
              {isApprove ? "Approve" : "Reject"}
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setShowAddress(true)}
            className="flex-1 rounded-xl border-2 border-blue-500 px-4 py-2 font-semibold text-blue-500 hover:bg-blue-50 transition"
          >
            View Delivery Address
          </button>
        </div>

        <div className="mt-3 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(order.id, order.action)}
            disabled={loading}
            className={`flex-1 rounded-xl px-4 py-2 font-semibold text-white transition-all disabled:opacity-50 ${
              isApprove
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? "Processing..." : isApprove ? "Approve" : "Reject"}
          </button>
        </div>
      </div>

      {/* Delivery Address Modal */}
      <ProfileModal
        isOpen={showAddress}
        onClose={() => setShowAddress(false)}
        userId={order.user_id}
      />
    </div>
  );
}
