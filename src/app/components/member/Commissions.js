//CLIENT COMPONENT

'use client';

import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function Commissions({commissions}) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

    if (loading) {
    return (
        <div className="w-full flex">
        <div className="w-full ml-56 px-20 py-7 bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <div className="text-xl text-gray-700">Loading...</div>
            </div>
        </div>
        </div>
    );
    }

    return (
        <div>
            <div className="grid grid-cols-4 gap-4 shadow-sm p-6 mt-6 rounded-xl bg-white font-semibold text-sm text-gray-500">
                <div>Date</div>
                <div>Name</div>
                <div>Commission</div>
                <div>Status</div>
            </div>

            {commissions.map((commission, index) => (
                <div
                    key={index}
                    className="grid grid-cols-4 gap-4 shadow-sm p-6 rounded-xl bg-white mt-3"
                >
                    <div className="text-sm">{format(new Date(commission.created_at), "MMM dd, yyyy HH:mm")}</div>
                    <div className="text-sm">{commission.referred_first_name} {commission.referred_last_name}</div>
                    <div className="text-sm font-semibold">{commission.reward_amount} CREDITS</div>
                    <span
                      className={
                        commission.status === "approved"
                          ? "text-green-600 font-semibold text-sm"
                          : commission.status === "pending"
                          ? "text-orange-500 font-semibold text-sm"
                          : commission.status === "declined"
                          ? "text-red-600 font-semibold text-sm"
                          : "text-gray-400 text-sm"
                      }
                    >
                      {commission.status.charAt(0).toUpperCase() + commission.status?.slice(1)}
                    </span>
                </div>
            ))}
        </div>
    );
}
