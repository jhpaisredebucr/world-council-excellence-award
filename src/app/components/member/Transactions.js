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
      <div className="hidden md:grid md:grid-cols-7 gap-4 p-6 mt-6 bg-white font-semibold rounded-xl shadow-sm text-sm text-gray-500">
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
        <div key={t.id || i} className="mt-3 rounded-xl bg-white p-5 shadow-sm md:grid md:grid-cols-7 md:gap-4">
          <div className="text-sm">
            <span className="text-xs text-gray-400 md:hidden">Date: </span>
            {format(new Date(t.created_at), "MMM dd, yyyy HH:mm")}
          </div>

          <div className="text-sm md:mt-0 mt-1">
            <span className="text-xs md:hidden">Type: </span>
            {t.type ? t.type.charAt(0).toUpperCase() + t.type.slice(1) : 'N/A'}
          </div>

          <div className="text-sm font-medium md:mt-0 mt-1">
            <span className="text-xs text-gray-400 md:hidden">Amount: </span>
            ₱{t.amount ? Number(t.amount).toLocaleString() : '0'}
          </div>

          <div className="text-sm text-gray-500 md:mt-0 mt-1">
            <span className="text-xs text-gray-400 md:hidden">Method: </span>
            {t.payment_method || 'N/A'}
          </div>

          <div className="text-sm font-mono md:mt-0 mt-1">
            <span className="text-xs text-gray-400 md:hidden">Transaction ID: </span>
            <span className="bg-gray-50 px-2 py-0.5 rounded text-xs">
              {t.transaction_id || `TXN-${t.id || "-"}`}
            </span>
          </div>

          <div className="text-sm font-mono md:mt-0 mt-1">
            <span className="text-xs text-gray-400 md:hidden">Reference No: </span>
            <span className="bg-gray-50 px-2 py-0.5 rounded text-xs">
              {t.reference_number || 'N/A'}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3 md:mt-0">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                t.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : t.status === "pending"
                  ? "bg-orange-100 text-orange-800"
                  : t.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {t.status || 'unknown'}
            </span>

            {t.status === "pending" && userData?.userInfo?.role === "admin" && (
              <button
                onClick={() => setSelectedTx(t)}
                className="rounded-lg border-2 border-(--primary) bg-white px-3 py-1.5 text-xs font-semibold text-(--primary) hover:bg-(--primary) hover:text-white transition-all duration-200"
              >
                Approve
              </button>
            )}

          </div>
        </div>
      ))}

      {(!Array.isArray(transactions) || transactions.length === 0) && (
        <div className="p-10 text-center text-gray-400 mt-3 rounded-xl bg-white shadow-sm">
          No transactions found
        </div>
      )}
      {pagination && (
        <div className="flex justify-between items-center mt-6 text-sm text-gray-500 pb-6">
          <span>Page {Math.floor(pagination.offset / pagination.limit) + 1} of {Math.ceil(pagination.total / pagination.limit)}</span>
          {pagination.hasMore && (
            <button onClick={onRefresh} className="rounded-xl border-2 border-(--primary) bg-white px-5 py-2 text-sm font-semibold text-(--primary) hover:bg-(--primary) hover:text-white transition-all duration-200">
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
