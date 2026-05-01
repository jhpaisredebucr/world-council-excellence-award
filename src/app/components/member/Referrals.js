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

            <div className="grid grid-cols-4 gap-4 shadow-sm p-6 mt-6 rounded-xl bg-white font-semibold text-sm text-gray-500">
                <div>Username</div>
                <div>Full Name</div>
                <div>Date Joined</div>
                <div>Status</div>
            </div>

            {referrals.map((user, index) => (
                <div
                    key={index}
                    onClick={() => seeReferredMember(user)}
                    className={`grid grid-cols-4 gap-4 shadow-sm p-6 rounded-xl bg-white mt-3
                    ${role === "member" ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""}`}
                >
                    <div className="text-sm font-medium">{user.username}</div>
                    <div className="text-sm">{user.first_name} {user.last_name}</div>
                    <div className="text-sm text-gray-400">{format(new Date(user.created_at), "MMM dd, yyyy HH:mm")}</div>

                    <span
                        className={
                            user.status === "approved"
                            ? "text-green-600 font-semibold text-sm"
                            : user.status === "pending"
                            ? "text-orange-500 font-semibold text-sm"
                            : user.status === "declined"
                            ? "text-red-600 font-semibold text-sm"
                            : "text-gray-400 text-sm"
                        }
                    >
                        {user.status}
                    </span>
                </div>
            ))}

        </div>
    );
}