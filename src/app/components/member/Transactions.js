//CLIENT COMPONENT

"use client";

import { useState } from "react";
import { format } from "date-fns";
import ApproveModal from "../modal/ApproveModal";

export default function Transactions({ transactions = [], userData, onRefresh, limit=20, pagination }) {

  const [selectedTx, setSelectedTx] = useState(null);
  const [loading, setLoading] = useState(false);

  async function Approve(transactionId) {
    setLoading(true);

    try {
      const res = await fetch("/api/transaction/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId })
      });

      const data = await res.json();
      console.log(data);
      if (data.success && onRefresh) {
        onRefresh();
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSelectedTx(null);
    }
  }

  return (
    <div>
      <div className="hidden md:grid md:grid-cols-7 p-5 mt-5 bg-white font-semibold rounded-lg shadow-sm">
        <div>Date</div>
        <div>Type</div>
        <div>Amount</div>
        <div>Payment Method</div>
        <div>Transaction ID</div>
        <div>Reference No.</div>
        <div>Status</div>
      </div>

      {/* ROWS */}
{Array.isArray(transactions) && transactions.map((t, i) => (
        <div key={t.id || i} className="mt-2 rounded-lg bg-white p-4 shadow-sm md:grid md:grid-cols-7 md:p-5">
          <div className="mb-2 text-sm text-gray-600 md:mb-0 md:text-base md:text-black">{format(new Date(t.created_at), "MMM dd, yyyy HH:mm")}</div>

          <div className="mb-1 md:mb-0">
            <span className="text-xs text-gray-500 md:hidden">Type: </span>
            {t.type ? t.type.charAt(0).toUpperCase() + t.type.slice(1) : 'N/A'}
          </div>

          <div className="mb-1 md:mb-0">
            <span className="text-xs text-gray-500 md:hidden">Amount: </span>
            ₱{t.amount || 0}
          </div>

          <div className="mb-1 md:mb-0">
            <span className="text-xs text-gray-500 md:hidden">Method: </span>
            {t.payment_method || 'N/A'}
          </div>

          <div className="mb-1 md:mb-0 break-all">
            <span className="text-xs text-gray-500 md:hidden">Transaction ID: </span>
            {t.transaction_id || `TXN-${t.id || "-"}`}
          </div>

          <div className="mb-1 md:mb-0 break-all">
            <span className="text-xs text-gray-500 md:hidden">Reference No: </span>
            {t.reference_no || 'N/A'}
          </div>

          <div className="mt-2 flex items-center justify-between md:mt-0">

            <span
              className={
                t.status === "approved"
                  ? "text-green-600"
                  : t.status === "pending"
                  ? "text-yellow-500"
                  : "text-red-600"
              }
            >
              {t.status || 'unknown'}
            </span>

            {t.status === "pending" && userData?.userInfo?.role === "admin" && (
              <button
                onClick={() => setSelectedTx(t)}
                className="px-2 py-1 bg-(--primary) text-white rounded"
              >
                Approve
              </button>
            )}

          </div>
        </div>
      ))}

      {(!Array.isArray(transactions) || transactions.length === 0) && (
        <div className="p-8 text-center text-gray-500">
          No transactions found{pagination?.hasMore !== false && ' (showing first page)'}
        </div>
      )}
      {pagination && (
        <div className="flex justify-between mt-4">
          <span>Page {Math.floor(pagination.offset / pagination.limit) + 1} of {Math.ceil(pagination.total / pagination.limit)}</span>
          {pagination.hasMore && (
            <button onClick={onRefresh} className="px-4 py-2 bg-blue-500 text-white rounded">
              Load More
            </button>
          )}
        </div>
      )}

      {/* MODAL COMPONENT */}
      <ApproveModal
        isOpen={!!selectedTx}
        transaction={selectedTx}
        loading={loading}
        onClose={() => setSelectedTx(null)}
        onConfirm={Approve}
      />

    </div>
  );
}
