"use client"

import Card from "../card/Card";
import { format } from "date-fns";
import MemberCard from "./MemberCard";
import ProofOfPaymentModal from "../modal/ProofOfPaymentModal";
import { useState } from "react";

export default function MembersAdmin({ dashboardData, onRefresh }) {
    const [searchTerm, setSearchTerm] = useState('');

    const referrals = [
        ...(dashboardData?.pendingRequest || []),
        ...(dashboardData?.bannedMembers || []),
        ...(dashboardData?.approvedMembers || [])
    ].filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function Approve(userID, packagePrice, referredBy) {
        try {
            // ─── Step 1: Approve user (sets status=approved + finds referrerId) ──
            const resApprove = await fetch("/api/portal/admin/members", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userID })
            });

            const dataApprove = await resApprove.json();
            if (!resApprove.ok) {
                alert(dataApprove.message || "Failed to approve user");
                return;
            }

            // ─── Step 2: Build referral tree (uses referrerId from step 1) ─────────
            if (dataApprove.referrerId) {
                const resReferrals = await fetch("/api/referrals", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        newUserId: userID,
                        referrerId: dataApprove.referrerId
                    })
                });
                const dataReferrals = await resReferrals.json();
                if (!resReferrals.ok) {
                    console.error("Referral tree build failed:", dataReferrals.message);
                }
            }

            // ─── Step 3: Credit commission to uplines ───────────────────────────────
            if (packagePrice) {
                const resCommission = await fetch("/api/referrals/commission", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: userID, amount: packagePrice })
                });
                const dataCommission = await resCommission.json();
                if (!resCommission.ok) {
                    console.error("Commission credit failed:", dataCommission.message);
                }
            }

            // ─── Refresh dashboard ────────────────────────────────────────────────
            if (onRefresh) onRefresh();

        } catch (err) {
            console.error("[Approve] error:", err);
            alert("Something went wrong during approval.");
        }
    }

    const [isActive, setIsActive] = useState(false);
    const [user, setUser] = useState(null);
    const [isProofModalOpen, setIsProofModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    function PopUpMemberCard(selectedUser) {
        setUser(selectedUser);
        setIsActive(!isActive);
    }

    function openProofModal(selectedUser) {
        setSelectedUser(selectedUser);
        setIsProofModalOpen(true);
    }

    function closeProofModal() {
        setIsProofModalOpen(false);
        setSelectedUser(null);
    }

    return (
        <div>
            {isActive && <MemberCard user={user} onClose={PopUpMemberCard}/>}
            {isProofModalOpen && (
                <ProofOfPaymentModal
                    isOpen={isProofModalOpen}
                    onClose={closeProofModal}
                    user={selectedUser}
                />
            )}

            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold">Member Management</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
          >
            Refresh
          </button>
          <select
            value="all"
            onChange={(e) => {
              // This could be enhanced to filter by status if needed
              console.log('Filter by:', e.target.value);
            }}
            className="px-4 py-2 border rounded"
          >
            <option value="all">All Members</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-orange-600">
            {dashboardData?.totalRequest || 0}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {dashboardData?.approvedMembers?.length || 0}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Members</p>
          <p className="text-2xl font-bold text-gray-600">{dashboardData?.totalMembers || 0}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={() => setSearchTerm('')}
          className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
        >
          Clear
        </button>
      </div>

            <div className="hidden md:grid md:grid-cols-4 gap-4 p-4 sm:p-5 mt-5 rounded-xl bg-white shadow-sm font-semibold text-sm text-gray-500">
                <div>Username</div>
                <div>Full Name</div>
                <div>Date Joined</div>
                <div>Status</div>
            </div>

            {referrals.map((user, index) => (
                <div
                    key={index}
                    onClick={() => PopUpMemberCard(user)}
                    className="mt-3 rounded-xl bg-white p-5 shadow-sm md:grid md:grid-cols-4 md:gap-4 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all duration-200"
                >
                    {/* Username */}
                    <div className="text-sm">
                        <span className="text-xs text-gray-400 md:hidden">Username: </span>
                        <div className="font-medium">{user.username}</div>
                    </div>

                    {/* Full Name */}
                    <div className="text-sm font-medium md:mt-0 mt-1">
                        <span className="text-xs text-gray-400 md:hidden">Full Name: </span>
                        <div className="font-medium">{user.first_name} {user.last_name}</div>
                    </div>

                    {/* Date Joined */}
                    <div className="text-sm md:mt-0 mt-1">
                        <span className="text-xs text-gray-400 md:hidden">Date Joined: </span>
                        <div className="text-sm text-gray-600">
                            {format(new Date(user.created_at), "MMM dd, yyyy HH:mm")}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="text-sm md:mt-0 mt-1">
                        <span className="text-xs text-gray-400 md:hidden">Status: </span>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : user.status === "pending"
                                ? "bg-orange-100 text-orange-800"
                                : user.status === "declined"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                        >
                            {user.status}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-2 flex flex-wrap items-center gap-2 md:flex-nowrap md:mt-0">
                        <button
                            onClick={() => PopUpMemberCard(user)}
                            className="rounded-lg border-2 border-blue-500 bg-white px-3 py-1.5 text-xs font-semibold text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200"
                        >
                            Details
                        </button>

                        {user.status === "pending" && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openProofModal(user);
                                    }}
                                    className="rounded-lg border-2 border-purple-500 bg-white px-3 py-1.5 text-xs font-semibold text-purple-500 hover:bg-purple-500 hover:text-white transition-all duration-200"
                                >
                                    View Proof
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        Approve(user.id, user.package, user.referred_by);
                                    }}
                                    className="rounded-lg border-2 border-green-500 bg-white px-3 py-1.5 text-xs font-semibold text-green-500 hover:bg-green-500 hover:text-white transition-all duration-200"
                                >
                                    Approve
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}