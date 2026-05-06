'use client';

import { useEffect, useState } from "react";
import { format } from "date-fns";
import DepositApproveModal from "./DepositApproveModal";
import ProofOfDepositModal from "./ProofOfDepositModal";

export default function Page() {
  const [deposits, setDeposits] = useState([])
  const [loading, setLoading] = useState(true);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [proofModal, setProofModal] = useState({ isOpen: false, deposit: null });

  const fetchDeposits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/portal/admin/deposits?status=${filterStatus}`);
      const data = await res.json();
      console.log("[Admin Deposits] Response:", data);
      if (data.success) {
        setDeposits(data.deposits || []);
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

  const handleAction = async (depositId, action) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/portal/admin/deposits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositId, action }),
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        await fetchDeposits();
      } else {
        alert(data.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
      setSelectedDeposit(null);
    }
  };

  useEffect(() => {
    fetchDeposits();
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
        <h2 className="text-xl font-bold">Deposit Approvals</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchDeposits}
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
            <option value="all">All Deposits</option>
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
          <p className="text-2xl font-bold text-gray-600">{deposits.length}</p>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid md:grid-cols-7 gap-4 p-4 bg-white font-semibold rounded-xl shadow-sm text-sm text-gray-500">
        <div>Date</div>
        <div>Reference #</div>
        <div>Customer</div>
        <div>Method</div>
        <div>Amount</div>
        <div>Net</div>
        <div>Status</div>
      </div>

      {/* Deposit Rows */}
      {deposits.length === 0 ? (
        <div className="p-10 text-center text-gray-400 mt-3 rounded-xl bg-white shadow-sm">
          No deposits found
        </div>
      ) : (
        deposits.map((deposit, i) => {
          const canAct = deposit.status === "pending" || deposit.status === "awaiting_payment";

          return (
            <div
              key={deposit.id || i}
              className="mt-3 rounded-xl bg-white p-5 shadow-sm md:grid md:grid-cols-7 md:gap-4"
            >
              <div className="text-sm">
                <span className="text-xs text-gray-400 md:hidden">Date: </span>
                {deposit.created_at
                  ? format(new Date(deposit.created_at), "MMM dd, yyyy HH:mm")
                  : "N/A"}
              </div>

              <div className="text-sm font-mono md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Ref #: </span>
                <span className="bg-gray-50 px-2 py-0.5 rounded text-xs break-all">
                  {deposit.reference_number || "N/A"}
                </span>
              </div>

              <div className="text-sm md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Customer: </span>
                <div className="font-medium">{deposit.first_name} {deposit.last_name}</div>
                <div className="text-xs text-gray-400">{deposit.email}</div>
              </div>

              <div className="text-sm capitalize md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Method: </span>
                {deposit.payment_method?.replace(/_/g, " ") || "N/A"}
              </div>

              <div className="text-sm font-medium md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Amount: </span>
                ₱{Number(deposit.amount || 0).toLocaleString()}
              </div>

              <div className="text-sm font-medium text-green-600 md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Net: </span>
                ₱{Number(deposit.amount || 0).toLocaleString()}
              </div>

              <div className="text-sm md:mt-0 mt-1">
                <span className="text-xs text-gray-400 md:hidden">Status: </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    deposit.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : deposit.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : deposit.status === "awaiting_payment"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {deposit.status || "pending"}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 md:flex-nowrap md:mt-0 col-span-full md:col-span-1">
                {canAct && (
                  <>
                    <button
                      onClick={() => setSelectedDeposit({ ...deposit, action: "approve" })}
                      className="rounded-lg border-2 border-green-500 bg-white px-3 py-1.5 text-xs font-semibold text-green-500 hover:bg-green-500 hover:text-white transition-all duration-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setSelectedDeposit({ ...deposit, action: "reject" })}
                      className="rounded-lg border-2 border-red-500 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                    >
                      Reject
                    </button>
                  </>
                )}
                {deposit.proof && (
                  <button
                    onClick={() => setProofModal({ isOpen: true, deposit })}
                    className="rounded-lg border-2 border-blue-500 bg-white px-3 py-1.5 text-xs font-semibold text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200"
                  >
                    View Proof
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Deposit Approve Modal */}
      <DepositApproveModal
        isOpen={!!selectedDeposit}
        deposit={selectedDeposit}
        loading={actionLoading}
        onClose={() => setSelectedDeposit(null)}
        onConfirm={handleAction}
      />

      {/* Proof View Modal */}
      <ProofOfDepositModal
        isOpen={proofModal.isOpen}
        deposit={proofModal.deposit}
        onClose={() => setProofModal({ isOpen: false, deposit: null })}
      />
    </div>
  );
}