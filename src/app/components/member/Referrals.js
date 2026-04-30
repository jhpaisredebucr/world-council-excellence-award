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

            <div className="grid grid-cols-4 shadow-sm p-5 mt-5 rounded-lg bg-white font-semibold">
                <div>Username</div>
                <div>Full Name</div>
                <div>Date Joined</div>
                <div>Status</div>
            </div>

            {referrals.map((user, index) => (
                <div
                    key={index}
                    onClick={() => seeReferredMember(user)}
                    className={`grid grid-cols-4 shadow-sm p-5 rounded-lg bg-white mt-2 
                    ${role === "member" ? "cursor-pointer hover:bg-gray-50" : ""}`}
                >
                    <div>{user.username}</div>
                    <div>{user.first_name} {user.last_name}</div>
                    <div>{format(new Date(user.created_at), "MMM dd, yyyy HH:mm")}</div>

                    <span
                        className={
                            user.status === "approved"
                            ? "text-green-600"
                            : user.status === "pending"
                            ? "text-orange-500"
                            : user.status === "declined"
                            ? "text-red-600"
                            : ""
                        }
                    >
                        {user.status}
                    </span>
                </div>
            ))}

        </div>
    );
}