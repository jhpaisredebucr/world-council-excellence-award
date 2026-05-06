"use client";

import { useState, useEffect } from "react";

export default function ProfileModal({ isOpen, onClose, userId }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && userId) {
            fetchUserData();
        }
    }, [isOpen, userId]);

const fetchUserData = async () => {
        setLoading(true);
        try {
            // Fetch the specific user's data by passing userId
            const res = await fetch(`/api/users?userId=${userId}`);
            const data = await res.json();
            
            if (data.success) {
                // Set user data from API response
                setUserData({
                    ...data.userInfo,
                    first_name: data.profile?.first_name,
                    middle_name: data.profile?.middle_name,
                    last_name: data.profile?.last_name,
                    profile: data.profile,
                    contacts: data.contacts,
                    address: data.address,
                    userInfo: data.userInfo
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !userId) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6 mx-2 shadow-2xl" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold">User Details</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-dashed"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Personal Information */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Personal Information</h4>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Full Name:</span>
                                    <span className="font-medium">
                                        {userData?.first_name} {userData?.middle_name} {userData?.last_name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date of Birth:</span>
                                    <span>{userData?.profile?.dob || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date Joined:</span>
                                    <span>{userData?.created_at ? new Date(userData.created_at).toLocaleString() : "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Account Information</h4>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Username:</span>
                                    <span>{userData?.username}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Referral Code:</span>
                                    <span className="font-mono text-xs">{userData?.userInfo?.referral_code || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Referred By:</span>
                                    <span>{userData?.referred_by || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={
                                        userData?.status === "approved" ? "text-green-600 font-semibold" :
                                        userData?.status === "pending" ? "text-orange-500 font-semibold" :
                                        userData?.status === "banned" ? "text-red-600 font-semibold" : "text-gray-800"
                                    }>{userData?.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Role:</span>
                                    <span>{userData?.userInfo?.role || "member"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Package:</span>
                                    <span>{userData?.package || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Information</h4>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Email:</span>
                                    <span>{userData?.contacts?.email || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Contact No:</span>
                                    <span>{userData?.contacts?.contact_no || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping Address</h4>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-600">Street:</span>
                                    <p className="font-medium">{userData?.address?.street_address || "N/A"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Barangay:</span>
                                    <span>{userData?.address?.barangay || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">City:</span>
                                    <span>{userData?.address?.city || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Postal Code:</span>
                                    <span>{userData?.address?.postal_code || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Full Address Copy */}
                        <div className="pt-2">
                            <button
                                onClick={() => {
                                    const fullAddress = `${userData?.address?.street_address || ''}, ${userData?.address?.barangay || ''}, ${userData?.address?.city || ''} ${userData?.address?.postal_code || ''}`;
                                    navigator.clipboard.writeText(fullAddress);
                                    alert("Address copied to clipboard!");
                                }}
                                className="w-full rounded-lg bg-primary px-4 py-2 text-white font-semibold hover:opacity-90 transition"
                            >
                                Copy Full Address
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
