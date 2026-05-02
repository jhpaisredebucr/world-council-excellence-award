"use client";

import OrdersMember from "../member/MyOrders";
import { useState, useEffect } from "react";
import Transactions from "../member/Transactions";

export default function MemberCard({ user, onClose }) {

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(0);

    const fetchJson = async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    };

const fetchData = async () => {
            try {
                // Pass the selected user's ID to fetch their data instead of the admin's data
                const userRes = await fetchJson(`/api/users?userId=${user?.id}`);
                setUserData(userRes);

                const prodRes = await fetch("/api/products");
                const prodData = await prodRes.json();
                setProducts(prodData.products);

                const orderRes = await fetch("/api/products/orders");
                const orderData = await orderRes.json();
                setOrders(orderData.orders);
                
                const txRes = await fetch("/api/transaction");
                const txData = await txRes.json();
                setTransactions(txData.transactions);

            } catch (err) {
                console.error(err);
            }
        };

useEffect(() => {
        if (user?.id) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    async function BanAccount(statusToAdd) {
        await fetch("/api/users/ban", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user?.id,
                statusToAdd
            })
        });

        onClose();
    }

    const buttonClassBlue =
        "px-4 py-2 bg-(--primary) text-white text-left rounded-lg hover:opacity-90 transition";

    const buttonClassRed =
        "px-4 py-2 bg-(--error-color) text-white text-left rounded-lg hover:opacity-90 transition";

    //modal size
    const modalSize =
        page === 0
            ? "w-80 h-80"
            : "w-3/4 h-3/4"; //size for page 1,2,3

    const userTransactions = transactions?.filter(
        (t) => Number(t.user_id) === Number(user?.id)
    ) || [];

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div
                className={`
                    flex flex-col
                    bg-white
                    p-6
                    gap-5
                    rounded-lg
                    shadow-lg
                    overflow-hidden
                    transition-all
                    duration-300
                    ease-in-out
                    ${modalSize}
                `}
            >

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <p className="font-bold text-lg">
                        {user?.first_name} {user?.last_name}
                    </p>

                    <button
                        onClick={() => {
                            if (page === 0) {
                                onClose();
                            } else {
                                setPage(0);
                            }
                        }}
                        className="text-sm text-gray-500 hover:text-black"
                    >
                        ← Back
                    </button>
                </div>

                <hr />

                {/* PAGE 0 - MENU */}
                <div
                    className={`transition-all duration-300 ${
                        page === 0
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-4 hidden"
                    }`}
                >
                    <div className="flex flex-col gap-2">
                        <button className={buttonClassBlue} onClick={() => setPage(1)}>
                            View Profile
                        </button>

                        <button className={buttonClassBlue} onClick={() => setPage(2)}>
                            View Transactions
                        </button>

                        <button className={buttonClassBlue} onClick={() => setPage(3)}>
                            View Orders
                        </button>

                        {user?.status === "approved" && (
                            <button
                                className={buttonClassRed}
                                onClick={() => BanAccount("banned")}
                            >
                                Ban Account
                            </button>
                        )}

                        {user?.status === "banned" && (
                            <button
                                className={buttonClassBlue}
                                onClick={() => BanAccount("approved")}
                            >
                                Remove Ban
                            </button>
                        )}
                    </div>
                </div>

{/* PAGE 1 - PROFILE */}
                <div
                    className={`transition-all duration-300 overflow-y-auto max-h-[calc(75vh-180px)] ${
                        page === 1
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-4 hidden"
                    }`}
                >
                    <p className="text-2xl font-semibold mb-4">Profile</p>
                    
                    {/* Personal Information */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Personal Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Full Name:</span>
                                <span className="text-gray-800">{user?.first_name} {user?.middle_name} {user?.last_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Date of Birth:</span>
                                <span className="text-gray-800">{userData?.profile?.dob || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Date Joined:</span>
                                <span className="text-gray-800">{user?.created_at ? new Date(user.created_at).toLocaleString() : "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Account Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Username:</span>
                                <span className="text-gray-800">{user?.username}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Referral Code:</span>
                                <span className="text-gray-800 font-mono text-sm">{userData?.userInfo?.referral_code || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Referred By:</span>
                                <span className="text-gray-800">{user?.referred_by || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Status:</span>
                                <span className={`font-semibold ${
                                    user?.status === "approved" ? "text-green-600" :
                                    user?.status === "pending" ? "text-orange-500" :
                                    user?.status === "banned" ? "text-red-600" : "text-gray-800"
                                }`}>{user?.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Role:</span>
                                <span className="text-gray-800">{userData?.userInfo?.role || "member"}</span>
                            </div>
<div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Package:</span>
                                <span className="text-gray-800">{user?.package || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Email:</span>
                                <span className="text-gray-800">{userData?.contacts?.email || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Contact No:</span>
                                <span className="text-gray-800">{userData?.contacts?.contact_no || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="mb-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Address Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Street Address:</span>
                                <span className="text-gray-800 text-right">{userData?.address?.street_address || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Barangay:</span>
                                <span className="text-gray-800">{userData?.address?.barangay || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">City:</span>
                                <span className="text-gray-800">{userData?.address?.city || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600">Postal Code:</span>
                                <span className="text-gray-800">{userData?.address?.postal_code || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>

{/* PAGE 3 - ORDERS (same size as others) */}
                <div
                    className={`transition-all duration-300 overflow-hidden ${
                        page === 3
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-4 hidden"
                    }`}
                >
                    <p className="text-2xl font-semibold">Orders:</p>
                    <div className="overflow-y-auto max-h-[calc(75vh-180px)]">
                        <OrdersMember
                            orders={orders}
                            products={products}
                            userData={user}
                        />
                    </div>
                </div>
                
                {/* TRANSACTION */}
                <div
                    className={`transition-all duration-300 overflow-hidden ${
                        page === 2
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-4 hidden"
                    }`}
                >
                    <p className="text-2xl font-semibold">Transactions:</p>
                    <div className="overflow-y-auto max-h-[calc(75vh-180px)]">
                        <Transactions
                            transactions={userTransactions}
                            onRefresh={fetchData}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}