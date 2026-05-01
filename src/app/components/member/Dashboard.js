//CLIENT COMPONENT

"use client"

import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Card from "../card/Card"
import FormPdf from "./FormPdf";
import { useState } from "react";
import QRCodeModal from "../modal/QRCodeModal";

export default function DashboardMember({dashboardData, userData}) {
    const router = useRouter();
    const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
    const referralLink = `${API_HOST}/home/signup?ref=${userData?.userInfo?.referral_code}`;

    const [copied, setCopied] = useState(false);
    const [isQROpen, setIsQROpen] = useState(false);

    const handleCopy = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(referralLink);
            } else {
                // Fallback for mobile browsers and non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = referralLink;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                textArea.style.top = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback copy failed', err);
                    throw err;
                }
                document.body.removeChild(textArea);
            }
            setCopied(true);
            
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    return (
        <div className="grid w-full grid-cols-1 gap-4 auto-rows-auto sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[130px]">
<Card 
            title="Available Balance" 
            src="/icons/wallet.svg" 
            bold="font-bold"
            color="bg-blue-200" 
            value={`₱${dashboardData?.balance}`} 
            valueSize="text-lg sm:text-4xl" 
            info=" " 
            rowSpan="lg:row-span-2" 
            colSpan="sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                    <Button 
                        bgColor="bg-transparent" 
                        textColor="text-(--primary)" 
                        border="border-1 border-(--primary)" 
                        onClick={() => router.push('/u/withdraw') }
                        className="hover:bg-(--primary) hover:text-white transition-all duration-300 focus:ring-2 focus:ring-(--primary) focus:ring-offset-2"
                    >
                        Withdraw
                    </Button>
                    <Button 
                        bgColor="bg-transparent" 
                        textColor="text-(--primary)" 
                        border="border-1 border-(--primary)" 
                        onClick={() => router.push('/u/deposit')}
                        className="hover:bg-(--primary) hover:text-white transition-all duration-300 focus:ring-2 focus:ring-(--primary) focus:ring-offset-2"
                    >
                        Deposit
                    </Button>
                </div>
                
            </Card>

<Card title="PC Balance"
            src="/icons/money.svg" 
            color="bg-orange-200" 
            value={`${dashboardData?.pc_credit} CREDITS`} 
            valueSize="text-lg sm:text-xl"
            info="" 
            bold="font-semibold"
            colSpan="sm:col-span-2"/>
            
            <Card title="PPV Balance"
            src="/icons/money.svg" 
            color="bg-orange-200" 
            value={`${dashboardData?.ppv_credit} CREDITS`} 
            valueSize="text-lg sm:text-xl"
            info="" 
            bold="font-semibold"
            colSpan="sm:col-span-2"/>

            <Card title="Total Spent"
            src="/icons/money-thin.svg" 
            color="bg-purple-200" 
            value={`₱${dashboardData?.totalSpent}`} 
            valueSize="text-lg sm:text-xl"
            info="" 
            bold="font-semibold"
            colSpan="sm:col-span-1"/>

            <Card title="Total Referred" 
            src="/icons/referrals.svg" 
            color="bg-red-300" 
            bold="font-semibold"
            value={dashboardData?.totalReferredMembers} 
            valueSize="text-lg sm:text-xl"
            info="" 
            colSpan="sm:col-span-1"/>

            <Card title="Active Members" 
            src="/icons/dashboard.svg" 
            color="bg-green-200" 
            bold="font-semibold"
            value={dashboardData?.activeMembers} 
            valueSize="text-lg sm:text-xl"
            info="" 
            colSpan="sm:col-span-1"/>

            <Card title="Pending Members"
            src="/icons/announcement.svg" 
            color="bg-yellow-200" 
            bold="font-semibold"
            value={dashboardData?.pendingCount}
            valueSize="text-lg sm:text-xl"
            info="" 
            colSpan="sm:col-span-1"/>
            
            <Card 
            title="Referral Link"
            value="" 
            valueSize="text-base sm:text-lg" 
            bold="" 
            info=" " 
            colSpan="sm:col-span-2 lg:col-span-4">
                <div className="flex flex-col gap-3 border-2 border-dotted border-gray-200 p-3 rounded-xl md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <p className="break-words font-bold text-sm sm:text-base truncate block w-full">
                            {referralLink}
                        </p>
                    </div>
                    
                    <button
                        onClick={handleCopy}
                        className={`flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm bg-[#5C4138] text-white rounded-lg hover:opacity-90 transition ${copied ? 'opacity-70' : ''}`}
                    >
                        {copied ? "Copied" : "Copy Link"}
                    </button>

                    <button
                        onClick={() => setIsQROpen(true)}
                        className="flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm bg-[#5C4138] text-white rounded-lg hover:opacity-90 transition"
                    >
                        QR Code
                    </button>
                </div>
            </Card>
            
            <QRCodeModal
                isOpen={isQROpen}
                onClose={() => setIsQROpen(false)}
                value={referralLink}
            />
        </div>
    )
}
