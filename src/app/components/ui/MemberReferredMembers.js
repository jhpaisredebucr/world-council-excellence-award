"use client";

import ReferralsMember from "../member/Referrals";
import { useEffect, useState } from "react";

export default function MemberReferredMembers({
    setIsOpen,
    isOpen,
    dashboardData,
    userId
}) {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);

    function back() {
        setIsOpen(false);
    }

    const fetchJson = async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const dashRes = await fetchJson(
                    `/api/portal/member?referralCode=${dashboardData.referral_code}&userId=${userId}`
                );

                setReferrals(dashRes.data || []);
                console.log(dashRes);

            } catch (err) {
                console.error(err);
                setReferrals([]);
            } finally {
                setLoading(false);
            }
        };

        if (dashboardData?.referral_code && userId) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [dashboardData?.referral_code, userId]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => {setIsOpen(!isOpen)}}>

                <div className="w-full max-w-sm p-5 bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <p>Loading...</p>
                </div>

            </div>
        );
    }

    if (referrals.length === 0) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => {setIsOpen(!isOpen)}}>

                <div className="w-full max-w-sm p-5 bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <p>This user doesn&apos;t have any referred members</p>
                </div>

            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">

                    <h2 className="text-lg font-semibold text-gray-800">
                        {dashboardData?.first_name} {dashboardData?.last_name}&apos;s Referred Members
                    </h2>

                    <button
                        onClick={back}
                        className="px-4 py-2 text-sm font-medium rounded-lg 
                        bg-gray-100 hover:bg-gray-200 transition"
                    >
                        Back
                    </button>

                </div>


                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">

                    <ReferralsMember
                        referrals={referrals}
                        debug="true"
                    />

                </div>

            </div>

        </div>
    );
}
