"use client"

import Card from "../card/Card";
import { format } from "date-fns";
import MemberCard from "./MemberCard";
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

    function PopUpMemberCard(selectedUser) {
        setUser(selectedUser);
        setIsActive(!isActive);
    }

    return (
        <div>
            {isActive && <MemberCard user={user} onClose={PopUpMemberCard}/>}

            <div className="grid grid-cols-2 gap-5 mb-4">
                <Card title="Total Members" value={dashboardData?.totalMembers} info=""/>
                <Card title="Pending" value={dashboardData?.totalRequest} info=""/>
            </div>

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

            <div className="hidden md:grid grid-cols-4 shadow-sm p-5 mt-5 rounded-lg bg-white font-semibold">
                <div>Username</div>
                <div>Full Name</div>
                <div>Date Joined</div>
                <div>Status</div>
            </div>

            {referrals.map((user, index) => (
                <div
                    key={index}
                    onClick={() => PopUpMemberCard(user)}
                    className="grid grid-cols-1 md:grid-cols-4 border-(--primary)
                    shadow-sm p-5 rounded-lg bg-white mt-2
                    hover:shadow-md hover:border cursor-pointer gap-2 md:gap-0"
                >
                    <div className="md:block">
                        <span className="md:hidden font-semibold text-gray-500">Username: </span>
                        {user.username}
                    </div>
                    <div className="md:block">
                        <span className="md:hidden font-semibold text-gray-500">Full Name: </span>
                        {user.first_name} {user.last_name}
                    </div>
                    <div className="md:block">
                        <span className="md:hidden font-semibold text-gray-500">Date Joined: </span>
                        {format(new Date(user.created_at), "MMM dd, yyyy HH:mm")}
                    </div>
                    <div className="flex items-center justify-between md:block">
                        <div className="flex items-center gap-2">
                            <span className="md:hidden font-semibold text-gray-500">Status: </span>
                            <span
                                className={
                                    user.status === "approved"
                                    ? "text-green-600"
                                    : user.status === "pending"
                                    ? "text-orange-500"
                                    : user.status === "declined"
                                    ? "text-red-600"
                                    : ""
                                }
                            >
                                {user.status}
                            </span>
                        </div>
                        {user.status === "pending" &&
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                Approve(user.id, user.package, user.referred_by);
                            }}
                            className="mt-2 md:mt-0 p-1 rounded-sm hover:bg-(--primary)/80 bg-(--primary) cursor-pointer text-white text-sm"
                        >
                            Approve
                        </button>}
                    </div>
                </div>
            ))}
        </div>
    );
}