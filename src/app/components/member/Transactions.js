//CLIENT COMPONENT

"use client";

import { format } from "date-fns";

export default function Transactions({ transactions = [], userData, onRefresh, limit=20, pagination }) {

  const isAdminView = userData?.userInfo?.role === "admin";

  // Build a quick lookup: user_id -> { first_name, last_name, email }
  const userMap = {};
  if (userData?.users && Array.isArray(userData.users)) {
    userData.users.forEach(u => {
      userMap[u.id] = u;
    });
  }

  // Friendly description for each transaction type
  function getTypeLabel(type) {
    switch (type) {
      case "deposit":    return "Deposit";
      case "withdrawal": return "Withdrawal";
      case "commission": return "Commission";
      case "order":      return "Order Purchase";
      case "refund":     return "Refund";
      case "plan":       return "Plan";
      default:           return type ? type.charAt(0).toUpperCase() + type.slice(1) : "N/A";
    }
  }

  // Status colour helper
  function statusClass(status) {
    switch (status) {
      case "approved":  return "bg-green-100 text-green-800";
      case "pending":   return "bg-orange-100 text-orange-800";
      case "rejected":  return "bg-red-100 text-red-800";
      default:          return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div>
      <div className={`hidden md:grid gap-4 p-6 mt-6 bg-white font-semibold rounded-xl shadow-sm text-sm text-gray-500 ${isAdminView ? "md:grid-cols-8" : "md:grid-cols-7"}`}>
        <div>Date</div>
        <div>User</div>
        <div>Type</div>
        <div>Amount</div>
        <div>Method</div>
        <div>Reference No.</div>
        <div>Status</div>
        {isAdminView && <div>Transaction ID</div>}
      </div>

      {/* ROWS */}
{Array.isArray(transactions) && transactions.map((t, i) => {
        const txnUser = userMap[t.user_id];
        return (
        <div key={t.id || i} className={`mt-3 rounded-xl bg-white p-5 shadow-sm md:grid gap-4 ${isAdminView ? "md:grid-cols-8" : "md:grid-cols-7"}`}>
          <div className="text-sm">
            <span className="text-xs text-gray-400 md:hidden">Date: </span>
            {format(new Date(t.created_at), "MMM dd, yyyy HH:mm")}
          </div>

          {/* User info */}
          <div className="text-sm md:mt-0 mt-1">
            <span className="text-xs text-gray-400 md:hidden">User: </span>
            {txnUser
              ? <span className="font-medium">{txnUser.first_name} {txnUser.last_name}</span>
              : t.user_id
                ? <span className="text-gray-400">User #{t.user_id}</span>
                : <span className="text-gray-400">N/A</span>
            }
          </div>

          <div className="text-sm md:mt-0 mt-1">
            <span className="text-xs text-gray-400 md:hidden">Type: </span>
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
              {getTypeLabel(t.type)}
            </span>
          </div>

          <div className="text-sm font-medium md:mt-0 mt-1">
            <span className="text-xs text-gray-400 md:hidden">Amount: </span>
            ₱{t.amount ? Number(t.amount).toLocaleString() : '0'}
          </div>

          <div className="text-sm text-gray-500 md:mt-0 mt-1">
            <span className="text-xs text-gray-400 md:hidden">Method: </span>
            {t.payment_method || 'N/A'}
          </div>

          <div className="text-sm font-mono md:mt-0 mt-1 md:max-w-32">
            <span className="text-xs text-gray-400 md:hidden">Reference No: </span>
            <span className="bg-gray-50 px-2 py-0.5 rounded text-xs break-all inline-block align-top">
              {t.reference_number || 'N/A'}
            </span>
          </div>

          <div className="mt-3 md:mt-0 flex items-center gap-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(t.status)}`}>
              {t.status || 'unknown'}
            </span>
          </div>

          {isAdminView && (
            <div className="text-sm font-mono md:mt-0 mt-1">
              <span className="text-xs text-gray-400 md:hidden">Transaction ID: </span>
              <span className="bg-gray-50 px-2 py-0.5 rounded text-xs">
                {t.transaction_id || `TXN-${t.id || "-"}`}
              </span>
            </div>
          )}
        </div>
        );
      })}

      
      {(!Array.isArray(transactions) || transactions.length === 0) && (
        <div className="p-10 text-center text-gray-400 mt-3 rounded-xl bg-white shadow-sm">
          No transactions found
        </div>
      )}
      {pagination && (
        <div className="flex justify-center items-center mt-6 text-sm text-gray-500 pb-6">
          <div className="flex items-center">
            <button
              onClick={onRefresh}
              disabled={pagination.offset === 0}
              className="px-3 py-1.5 border rounded-l-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
            >
              ← Prev
            </button>
            <span className="px-4 py-1.5 border-t border-b text-gray-600 text-sm">
              {Math.floor(pagination.offset / pagination.limit) + 1} <span className="text-gray-400">/</span> {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <button
              onClick={onRefresh}
              disabled={!pagination.hasMore}
              className="px-3 py-1.5 border rounded-r-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
            >
              Next →
            </button>
          </div>
          <span className="ml-4 text-xs text-gray-400">{pagination.total} total</span>
        </div>
      )}
    </div>
  );
}
