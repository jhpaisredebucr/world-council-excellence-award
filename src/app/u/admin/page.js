"use client";

import { useEffect, useState } from "react";
import DashboardAdmin from "@/app/components/admin/Dashboard";

export default function AdminPage() {

  const [dashboardData, setDashboardData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch("/api/portal/admin/analytics").then(res => res.json()),
      fetch("/api/users").then(res => res.json())
    ])
    .then(([analyticsData, usersData]) => {
      setDashboardData(analyticsData.dashboardData);
      setUserData(usersData.success ? usersData : null);
    })
    .catch(err => {
      console.error("Failed to fetch admin data:", err);
      setError("Failed to load dashboard data");
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <DashboardAdmin
      dashboardData={dashboardData}
      userData={userData}
    />
  );
}