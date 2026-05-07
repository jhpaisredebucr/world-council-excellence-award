//CLIENT COMPONENT

import { format } from "date-fns";

export default function ReferralsMember({ setIsOpen, isOpen,  referrals, role = "member", setSelectedDashboardData, debug="false" }) {

    function seeReferredMember(dashboardData) {
        if (role !== "member") return;
        if (debug === "true") return;
        setIsOpen(!isOpen);
        setSelectedDashboardData(dashboardData);

        console.log("Clicked:", dashboardData);
    };

    return (
        <div>

            {/* Header - Hidden on mobile, shown on desktop */}
            <div className="hidden md:grid md:grid-cols-4 gap-4 p-4 sm:p-5 mt-6 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] font-semibold text-sm text-gray-500">
                <div>Username</div>
                <div>Full Name</div>
                <div>Date Joined</div>
                <div>Status</div>
            </div>

            {referrals.map((user, index) => (
                <div
                    key={index}
                    onClick={() => seeReferredMember(user)}
                    className={`p-4 sm:p-5 rounded-xl bg-white mt-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-200
                    ${role === "member" ? "cursor-pointer hover:bg-gray-50" : ""}`}
                >
                    {/* Mobile Layout - Stacked */}
                    <div className="md:hidden space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs text-gray-400">Username: </span>
                                <span className="text-sm font-medium">{user.username}</span>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    user.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : user.status === "pending"
                                    ? "bg-orange-100 text-orange-800"
                                    : user.status === "declined"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {user.status}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400">Full Name: </span>
                            <span className="text-sm">{user.first_name} {user.last_name}</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400">Date Joined: </span>
                            <span className="text-sm text-gray-600">{format(new Date(user.created_at), "MMM dd, yyyy HH:mm")}</span>
                        </div>
                    </div>

                    {/* Desktop Layout - Grid */}
                    <div className="hidden md:grid md:grid-cols-4 md:gap-4 md:items-center">
                        <div className="text-sm font-medium">{user.username}</div>
                        <div className="text-sm">{user.first_name} {user.last_name}</div>
                        <div className="text-sm text-gray-600">{format(new Date(user.created_at), "MMM dd, yyyy HH:mm")}</div>

                        <div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    user.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : user.status === "pending"
                                    ? "bg-orange-100 text-orange-800"
                                    : user.status === "declined"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {user.status}
                            </span>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    );
}