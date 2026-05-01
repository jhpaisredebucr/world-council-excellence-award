import Card from "../card/Card"

export default function DashboardAdmin({dashboardData}) {
    const topReferrerName = dashboardData?.topReferrer?.[0] 
        ? `${dashboardData.topReferrer[0].first_name} ${dashboardData.topReferrer[0].last_name}`
        : "No referrers yet";

    return (
        <div className="grid grid-cols-4 auto-rows-[130px] gap-5 w-full">
            <Card title="Total Members" value={dashboardData?.totalMembers ?? 0} info=" "/>
            <Card title="Pending Requests" value={dashboardData?.totalRequest ?? 0} info=" "/>
            <Card title="Top Referrers" value={topReferrerName} info=" " colSpan={2} rowSpan={2}/>
            <Card title="Revenue" value={`₱${dashboardData?.revenue?.admin_revenue ?? 0}`} info=" "/>
            <Card title="Total Pending Orders" value={dashboardData?.totalPendingOrders ?? 0} info=" " rowSpan={2}/>
            <Card title="Approved Members" value={dashboardData?.approvedMembers?.length ?? 0} info=" " rowSpan={2}/>
            <Card title="Banned Members" value={dashboardData?.bannedMembers?.length ?? 0} info=""/>
            <Card title="System Alerts" value="No alerts" info=" "/>
            <Card title="Server Status" value="All Green" info=" "/>
        </div>
    )
}