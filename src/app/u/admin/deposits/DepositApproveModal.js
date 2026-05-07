'use client';

import { useState } from "react";
import { format } from "date-fns";

export default function DepositApproveModal({ isOpen, deposit, loading, onClose, onConfirm }) {
  const [showProof, setShowProof] = useState(false);

  if (!isOpen || !deposit) return null;

  const isApprove = deposit.action === "approve";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="mb-4 text-xl font-bold">
          {isApprove ? "Approve Deposit" : "Reject Deposit"}
        </h3>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="font-medium">Deposit ID:</span>
            <span className="font-mono">#{deposit.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Customer:</span>
            <span>{deposit.first_name} {deposit.last_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{deposit.email || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Phone:</span>
            <span>{deposit.phone || "N/A"}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-medium">Amount:</span>
            <span className="font-semibold">₱{Number(deposit.amount || 0).toLocaleString()}</span>
          </div>
          {deposit.fee > 0 && (
            <div className="flex justify-between">
              <span className="font-medium">Processing Fee:</span>
              <span className="text-red-600">-₱{Number(deposit.fee).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-medium">Net Amount:</span>
            <span className="text-green-600">₱{Number(deposit.net_amount ?? deposit.amount ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Payment Method:</span>
            <span className="capitalize">{deposit.payment_method?.replace(/_/g, " ") || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Reference #:</span>
            <span className="font-mono text-xs">{deposit.reference_number || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date:</span>
            <span>{deposit.created_at ? format(new Date(deposit.created_at), "MMM dd, yyyy HH:mm") : "N/A"}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-medium">Current Status:</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              deposit.status === "approved"
                ? "bg-green-100 text-green-800"
                : deposit.status === "rejected"
                ? "bg-red-100 text-red-800"
                : deposit.status === "awaiting_payment"
                ? "bg-blue-100 text-blue-800"
                : "bg-orange-100 text-orange-800"
            }`}>
              {deposit.status || "pending"}
            </span>
          </div>
        </div>

        {/* Proof of Payment */}
        {deposit.proof && (
          <div className="mt-4">
            <button
              onClick={() => setShowProof(!showProof)}
              className="w-full rounded-xl border-2 border-blue-500 px-4 py-2 font-semibold text-blue-500 hover:bg-blue-50 transition"
            >
              {showProof ? "Hide Proof" : "View Proof of Payment"}
            </button>
            {showProof && (
              <div className="mt-3">
                <img
                  src={deposit.proof}
                  alt="Proof of Payment"
                  className="w-full rounded-lg border shadow-sm"
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(deposit.id, deposit.action)}
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
    </div>
  );
}