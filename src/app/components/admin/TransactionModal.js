"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

export default function TransactionModal({ isOpen, onClose, transaction, userData, onViewFullProfile }) {
    const [userMap, setUserMap] = useState({});
    const [loading, setLoading] = useState(false);

    // Build user lookup map
    useEffect(() => {
        if (userData?.users && Array.isArray(userData.users)) {
            const map = {};
            userData.users.forEach(u => {
                map[u.id] = u;
            });
            setUserMap(map);
        }
    }, [userData]);

    function getTypeLabel(type) {
        switch (type) {
            case "deposit":    return "Deposit";
            case "withdrawal": return "Withdrawal";
            case "commission": return "Commission";
            case "order":      return "Order Purchase";
            case "refund":     return "Refund";
            case "plan":       return "Plan";
            default:           return type ? type.charAt(0).toUpperCase() + type.slice(1) : "N/A";
        }
    }

    function statusClass(status) {
        switch (status) {
            case "approved":  return "bg-green-100 text-green-800";
            case "pending":   return "bg-orange-100 text-orange-800";
            case "rejected":  return "bg-red-100 text-red-800";
            default:          return "bg-gray-100 text-gray-800";
        }
    }

    if (!isOpen || !transaction) return null;

    const txnUser = userMap[transaction.user_id];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 mx-2 shadow-2xl" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">Transaction Details</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                        ✕
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-dashed"></div>
                    </div>
                ) : (
                    <div className="space-y-5">

                        {/* Transaction Info Section */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Transaction Information</h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Transaction ID:</span>
                                    <span className="font-mono font-medium">
                                        {transaction.transaction_id || `TXN-${transaction.id}`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Type:</span>
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                                        {getTypeLabel(transaction.type)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Amount:</span>
                                    <span className="font-bold text-lg text-gray-600">
                                        ₱{Number(transaction.amount).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span>{transaction.payment_method || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Reference No:</span>
                                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                                        {transaction.reference_number || "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(transaction.status)}`}>
                                        {transaction.status || "unknown"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span>{format(new Date(transaction.created_at), "MMM dd, yyyy HH:mm")}</span>
                                </div>
                            </div>
                        </div>

                        {/* User Info Section */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">User Information</h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                                {txnUser ? (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-medium">
                                                {txnUser.first_name} {txnUser.last_name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Username:</span>
                                            <span>{txnUser.username}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span>{txnUser.email || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Role:</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${txnUser.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
                                                {txnUser.role || "member"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span className={
                                                txnUser.status === "approved" ? "text-green-600 font-semibold" :
                                                txnUser.status === "pending" ? "text-orange-500 font-semibold" :
                                                txnUser.status === "banned" ? "text-red-600 font-semibold" : "text-gray-800"
                                            }>
                                                {txnUser.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Package:</span>
                                            <span>{txnUser.package || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date Joined:</span>
                                            <span>{txnUser.created_at ? format(new Date(txnUser.created_at), "MMM dd, yyyy") : "N/A"}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">User ID:</span>
                                        <span>{transaction.user_id || "N/A"}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 rounded-lg bg-gray-200 py-2.5 font-semibold text-gray-700 hover:bg-gray-300 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    if (txnUser && onViewFullProfile) {
                                        onViewFullProfile(txnUser.id);
                                    }
                                }}
                                className="flex-1 rounded-lg bg-primary py-2.5 font-semibold text-white hover:opacity-90 transition"
                            >
                                View Full Profile
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}