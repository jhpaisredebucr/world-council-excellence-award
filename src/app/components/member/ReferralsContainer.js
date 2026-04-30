'use client';

import { useState } from "react";
import ReferralsMember from "@/app/components/member/Referrals";
import MemberReferredMembers from "@/app/components/ui/MemberReferredMembers";
import Card from "@/app/components/card/Card";
import { useRouter } from "next/navigation";
import Title from "@/app/components/ui/Title";
import QRCode from "react-qr-code";

export default function ReferralsContainer({
  userData,
  dashboardData
}) {
  const [selectedDashboardData, setSelectedDashboardData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
  const referralLink = `${API_HOST}/home/signup?ref=${userData?.userInfo?.referral_code}`;

  const router = useRouter();

  const referrals =
    dashboardData?.referredMembers?.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <>
{/* HEADER */}
      <div className="bg-white p-2 rounded-xl">
        <div className="flex gap-4 p-2 justify-between items-center border-2 border-gray-200 border-dotted rounded-xl">

          <div className="flex gap-4 items-center">
            <QRCode value={referralLink} size={64} />
            <div className="flex gap-2">
              <p>Your Referral Code:</p>
              <p className="font-bold">
                {userData?.userInfo?.referral_code}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/u/referrals/genealogy")}
            className="p-2 bg-(--primary) text-white rounded-lg"
          >
            Open Member Tree
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 gap-5 my-5">
        <Card
          title="Total Referred"
          value={dashboardData?.totalReferredMembers}
          info=""
        />
        <Card
          title="Pending"
          value={dashboardData?.pendingCount}
          info=""
        />
      </div>

      {/* REFERRALS HEADER */}
      <div className="my-6 p-3 rounded-lg shadow bg-white flex justify-between items-center">

        <Title
          title="Referrals"
          icon="/icons/referrals.svg"
        />

        <div className="flex gap-5">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </div>

      {/* REFERRALS LIST */}
      <ReferralsMember
        userData={userData}
        referrals={referrals}
        setSelectedDashboardData={setSelectedDashboardData}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />

      {/* MODAL */}
      {isOpen && (
        <MemberReferredMembers
          dashboardData={selectedDashboardData}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
        />
      )}
    </>
  );
}