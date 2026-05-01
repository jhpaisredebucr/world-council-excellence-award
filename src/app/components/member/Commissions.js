// CLIENT COMPONENT
'use client';

import { format } from "date-fns";

export default function Commissions({ commissions = [] }) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 shadow-sm p-6 mt-6 rounded-xl bg-white font-semibold text-sm text-gray-500">
        <div>Date</div>
        <div>Name</div>
        <div>Commission</div>
        <div>Status</div>
      </div>

      {commissions.length === 0 ? (
        <div className="mt-4 text-center text-gray-500 py-8">
          No commissions yet.
        </div>
      ) : (
        commissions.map((commission, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 shadow-sm p-6 rounded-xl bg-white mt-3"
          >
            <div className="text-sm">
              {commission.created_at
                ? format(new Date(commission.created_at), "MMM dd, yyyy HH:mm")
                : "—"}
            </div>
            <div className="text-sm">
              {commission.referred_first_name} {commission.referred_last_name}
            </div>
            <div className="text-sm font-semibold">
              {commission.reward_amount} PC CREDITS
            </div>
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
              {commission.status
                ? commission.status.charAt(0).toUpperCase() + commission.status.slice(1)
                : "—"}
            </span>
          </div>
        ))
      )}
    </div>
  );
}