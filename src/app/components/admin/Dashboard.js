import Card from "../card/Card"

export default function DashboardAdmin({dashboardData}) {
    const topReferrerName = dashboardData?.topReferrer?.[0] 
        ? `${dashboardData.topReferrer[0].first_name} ${dashboardData.topReferrer[0].last_name}`
        : "No referrers yet";

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[minmax(120px,auto)] gap-4 sm:gap-5 w-full">
            <Card title="Total Members" value={dashboardData?.totalMembers ?? 0} valueSize="text-lg sm:text-xl lg:text-2xl" info=" "/>
            <Card title="Pending Requests" value={dashboardData?.totalRequest ?? 0} valueSize="text-lg sm:text-xl lg:text-2xl" info=" "/>
            <Card title="Top Referrers" value={topReferrerName} valueSize="text-base sm:text-lg lg:text-xl" info=" " colSpan="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2" rowSpan="row-span-1 sm:row-span-2 lg:row-span-2"/>
            <Card title="Referrals Revenue" value={`₱${dashboardData?.revenue?.admin_revenue ?? 0}`} valueSize="text-lg sm:text-xl lg:text-2xl" info=" "/>
            <Card title="Products Sold" value={`₱${dashboardData?.productsSold?.total_products_sold ?? 0}`} valueSize="text-lg sm:text-xl lg:text-2xl" info=" "/>
            <Card title="Total Pending Orders" value={dashboardData?.totalPendingOrders ?? 0} valueSize="text-lg sm:text-xl lg:text-2xl" info=" " rowSpan="row-span-1 sm:row-span-2 lg:row-span-2"/>
            <Card title="Approved Members" value={dashboardData?.approvedMembers?.length ?? 0} valueSize="text-lg sm:text-xl lg:text-2xl" info=" " rowSpan="row-span-1 sm:row-span-2 lg:row-span-2"/>
            <Card title="Banned Members" value={dashboardData?.bannedMembers?.length ?? 0} valueSize="text-lg sm:text-xl lg:text-2xl" info=""/>
            <Card title="System Alerts" value="No alerts" valueSize="text-base sm:text-lg lg:text-xl" info=" "/>
            <Card title="Server Status" value="All Green" valueSize="text-base sm:text-lg lg:text-xl" info=" "/>
        </div>
    )
}
