'use client';

import { useState } from "react";
import ReferralsMember from "@/app/components/member/Referrals";
import MemberReferredMembers from "@/app/components/ui/MemberReferredMembers";
import Card from "@/app/components/card/Card";
import { useRouter } from "next/navigation";
import Title from "@/app/components/ui/Title";
import QRCodeModal from "@/app/components/modal/QRCodeModal";

export default function ReferralsContainer({
  userData,
  dashboardData
}) {
  const [selectedDashboardData, setSelectedDashboardData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
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
      <div className="bg-white p-3 sm:p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 justify-between items-start sm:items-center border-2 border-gray-200 border-dotted rounded-xl">

          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-400">Your Referral Code</p>
            <p className="font-bold text-sm sm:text-base">
              {userData?.userInfo?.referral_code}
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsQROpen(true)}
              className="flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm bg-[#5C4138] text-white rounded-lg hover:opacity-90 transition"
            >
              QR Code
            </button>
            <button
              onClick={() => router.push("/u/referrals/genealogy")}
              className="flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm bg-(--primary) text-white rounded-lg"
            >
              Member Tree
            </button>
          </div>

        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 my-4 sm:my-5">
        <Card
          title="Total Referred"
          value={dashboardData?.totalReferredMembers}
          valueSize="text-lg sm:text-2xl" 
          info=""
        />
        <Card
          title="Pending"
          value={dashboardData?.pendingCount}
          valueSize="text-lg sm:text-2xl" 
          info=""
        />
      </div>

      {/* REFERRALS HEADER */}
      <div className="my-4 sm:my-6 p-3 sm:p-4 rounded-xl shadow bg-white flex flex-col gap-4">

        <Title
          title="Referrals"
          icon="/icons/referrals.svg"
        />

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <button
            onClick={() => setSearchTerm('')}
            className="w-full sm:w-auto px-4 py-2.5 bg-gray-500 text-white rounded-xl hover:bg-gray-600 text-sm font-medium"
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
          userId={userData?.userInfo?.id}
        />
      )}

      {/* QR CODE MODAL */}
      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        value={referralLink}
      />
    </>
  );
}
