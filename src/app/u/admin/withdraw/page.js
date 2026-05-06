'use client';

import { useEffect, useState } from "react";
import { format } from "date-fns";
import WithdrawApproveModal from "./WithdrawApproveModal";

export default function Page() {
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);

  const fetchWithdrawals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/portal/admin/withdrawals?status=${filterStatus}`);
      const data = await res.json();
      console.log("[Admin Withdrawals] Response:", data);
      if (data.success) {
        setWithdrawals(data.withdrawals || []);
        setApiData(data);
      } else {
        setError(data.message || "Failed to fetch");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (withdrawalId, action) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/portal/admin/withdrawals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawalId, action }),
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        await fetchWithdrawals();
      } else {
        alert(data.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
      setSelectedWithdrawal(null);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [filterStatus]);

  // Stats - use global counts from API response
  const counts = apiData?.counts || { pending: 0, approved: 0, rejected: 0 };
  const pendingCount = counts.pending;
  const approvedCount = counts.approved;
  const rejectedCount = counts.rejected;

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
        <h2 className="text-xl font-bold">Withdrawal Approvals</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchWithdrawals}
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
            <option value="all">All Withdrawals</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          <strong>Error:</strong> {error}
          <button onClick={() => setError(null)} className="ml-4 underline">dismiss</button>
        </div>
      )}

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-orange-500">
            {pendingCount}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {approvedCount}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold text-red-600">
            {rejectedCount}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-600">{withdrawals.length}</p>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid md:grid-cols-7 gap-4 p-4 bg-white font-semibold rounded-xl shadow-sm text-sm text-gray-500">
        <div>Date</div>
        <div>Reference #</div>
        <div>Customer</div>
        <div>Method</div>
        <div>Amount</div>
        <div>Account</div>
        <div>Status</div>
      </div>

      {/* Withdrawal Rows */}
      {withdrawals.length === 0 ? (
        <div className="p-10 text-center text-gray-400 mt-3 rounded-xl bg-white shadow-sm">
          No withdrawals found
        </div>
      ) : (
        withdrawals.map((withdrawal, i) => {
          const canAct = withdrawal.status === "pending";

          // Show actual account info
          const maskedAccount = withdrawal.account_info || 'N/A';

          return (
            <div
              key={withdrawal.id || i}
              className="mt-3 rounded-xl bg-white p-5 shadow-sm md:grid md:grid-cols-7 md:gap-4"
            >
              <div className="text-sm">
                <span className="text-xs text-gray-400 md:hidden">Date: </span>
                {withdrawal.created_at
                  ? format(new Date(withdrawal.created_at), "MMM dd, yyyy HH:mm")
                  : "N/A"}
              </div>

              <div className="text-sm font-mono md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Ref #: </span>
                <span className="bg-gray-50 px-2 py-0.5 rounded text-xs break-all">
                  {withdrawal.reference_number || "N/A"}
                </span>
              </div>

              <div className="text-sm md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Customer: </span>
                <div className="font-medium">{withdrawal.first_name} {withdrawal.last_name}</div>
                <div className="text-xs text-gray-400">{withdrawal.email}</div>
              </div>

              <div className="text-sm capitalize md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Method: </span>
                {withdrawal.payment_method?.replace(/_/g, " ") || "N/A"}
              </div>

              <div className="text-sm font-medium md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Amount: </span>
                ₱{Number(withdrawal.amount || 0).toLocaleString()}
              </div>

              <div className="text-sm font-mono text-gray-600 md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Account: </span>
                {maskedAccount}
              </div>

              <div className="text-sm md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Status: </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    withdrawal.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : withdrawal.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {withdrawal.status || "pending"}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 md:flex-nowrap md:mt-0 col-span-full md:col-span-1">
                {canAct && (
                  <>
                    <button
                      onClick={() => setSelectedWithdrawal({ ...withdrawal, action: "approve" })}
                      className="rounded-lg border-2 border-green-500 bg-white px-3 py-1.5 text-xs font-semibold text-green-500 hover:bg-green-500 hover:text-white transition-all duration-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setSelectedWithdrawal({ ...withdrawal, action: "reject" })}
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

      {/* Withdraw Approve Modal */}
      <WithdrawApproveModal
        isOpen={!!selectedWithdrawal}
        withdrawal={selectedWithdrawal}
        loading={actionLoading}
        onClose={() => setSelectedWithdrawal(null)}
        onConfirm={handleAction}
      />
    </div>
  );
}