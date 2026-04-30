"use client"

import Card from "../card/Card";
import { format } from "date-fns";
import MemberCard from "./MemberCard";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MembersAdmin({ dashboardData, onRefresh }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const referrals = [
        ...(dashboardData?.pendingRequest || []),
        ...(dashboardData?.bannedMembers || []),
        ...(dashboardData?.approvedMembers || [])
    ].filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()));

    console.log(referrals);

    async function Approve(userID, packagePrice, referred_by) {
        // let initialAmount = 0;
        // if (plan === "1") initialAmount = 300;
        // else if (plan === "2") initialAmount = 900;
        // else if (plan === "3") initialAmount = 1500;

        // const amount = initialAmount * 0.20;

        console.log(referred_by, userID);

        // //GET MEMBERS
        const resApprove  = await fetch("/api/portal/admin/members", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userId: userID})
        });

        const dataApprove  = await resApprove.json();
        console.log(dataApprove);


        // // //TRANSACTIONS
        const resTransaction  = await fetch("/api/portal/admin/transactions", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ userId: userID, plan: "plan" })
        });

        const dataTransaction  = await resTransaction.json();
        console.log(dataTransaction);

        //REFERRAL REWARDS (OUTDATED)
        // const resReferral  = await fetch("/api/portal/admin/transactions/referral-reward", {
        //     method: "POST",
        //     headers: {"Content-Type": "application/json"},
        //     body: JSON.stringify({ referral_code: referred_by, referred_id: userID, reward_amount: amount })
        // });

        // const dataReferral  = await resReferral.json();
        // console.log(dataReferral);

        // console.log({referral_code: referred_by, referred_id: userID, reward_amount: amount});

        // Build referral tree using /api/referrals
        const resReferrals = await fetch("/api/referrals", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ 
                newUserId: userID, 
                referrerId: dataApprove.referrerId 
            })
        });
        const dataReferrals = await resReferrals.json();
        console.log(dataReferrals);

        //REFERRAL REWARDS
        const resCommission = await fetch("/api/referrals/commission", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ userId: userID, amount: packagePrice })
        });

        const dataCommission = await resCommission.json();
        console.log(dataCommission);

        console.log({userId: userID, initialAmount: packagePrice});

        if (onRefresh) {
          onRefresh();
        }

    }

    const [isActive, setIsActive] = useState(false);
    const [user, setUser] = useState(null);

    function PopUpMemberCard( user ){
        setUser(user);
        setIsActive(!isActive);
        console.log(user);

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
                    hover:shadow-md hover:border cursor-pointer gap-2 md:gap-0
                    "
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
                        {format(new Date(user.created_at), "MMM dd, yyyy")}
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