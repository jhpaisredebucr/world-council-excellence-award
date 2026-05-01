//SERVER COMPONENT

'use client';

import { useEffect, useState } from "react";
import ReferralTree from "@/app/components/member/ReferralTree";
import { useRouter } from "next/navigation";

export default function Page() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rootTree, setRootTree] = useState(null);
  const [headerExpanded, setHeaderExpanded] = useState(true);
  const router = useRouter();

  const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await fetchJson("/api/users");
        if (!userRes.success) throw new Error("Failed to load user");

        setUserData(userRes);

        const dashRes = await fetchJson(
          `/api/portal/member?referralCode=${userRes.userInfo.referral_code}&userId=${userRes.userInfo.id}&limit=10&offset=0`
        );

        const rootData = {
          first_name: userRes.profile?.first_name,
          last_name: userRes.profile?.last_name,
          status: userRes.profile?.status ?? 'approved',
          earnings_from_user: '0.00',
          total_count: 0,
          package: userRes.userInfo.package || 'N/A',
          profile_image: userRes.profile?.img_url || ''
        };
        
        const root = {
          id: userRes.userInfo.referral_code,
          name: `${(userRes.profile?.first_name ?? 'N/A')} ${(userRes.profile?.last_name ?? '')} (You)`,
          data: { fullData: rootData },
          children: []
        }; 

const directChildren = (dashRes.dashboardData?.referredMembers || []).map(member => ({
          id: member.referral_code,
          name: `${(member.first_name ?? 'N/A')} ${member.last_name ?? ''} [${member.status ?? 'pending'}]`,
          data: { fullData: { ...member, profile_image: member.img_url || '' } },
          children: [],
          hasChildren: (member.total_count || 0) > 0,
          childCount: member.total_count || 0
        }));

        setRootTree({ ...root, children: directChildren });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-64px-28px)] flex items-center justify-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-primary border-dashed rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-64px-56px)] bg-gray-100 relative overflow-hidden">

      {/* TREE AREA */}
      <div className="w-full h-[calc(100vh-64px-56px)] overflow-hidden">

        {rootTree ? (
          <>
<ReferralTree
              data={rootTree}
              fetchChildren={async (refCode) => {
                const res = await fetchJson(`/api/portal/member?referralCode=${refCode}&userId=${userData.userInfo.id}`
                );
                // Return both members and total count
                return { 
                  members: res.data || [], 
                  totalCount: res.total || 0 
                };
              }}
              maxDepth={3}
            />
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No referrals yet
          </div>
        )}

      </div>

{/* FLOATING HEADER */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-col md:flex-row md:justify-between md:items-center gap-3 pointer-events-none">

        <div className="bg-white/90 backdrop-blur-md rounded-lg shadow border pointer-events-auto overflow-hidden">
          {/* Header - always visible, clickable to collapse/expand */}
          <button
            onClick={() => setHeaderExpanded(!headerExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h1 className="text-lg font-bold">Genealogy Tree</h1>
            {/* Collapse indicator - visible on mobile */}
            <span className="md:hidden text-gray-400 text-sm">
              {headerExpanded ? '▼' : '▶'}
            </span>
          </button>

          {/* Collapsible content */}
          <div className={`${headerExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} md:max-h-none md:opacity-100 transition-all duration-200 overflow-hidden`}>
            <div className="px-4 pb-3">
              <p className="text-sm text-gray-600">
                Referral Code: {" "}
                <span className="font-mono bg-secondary/20 px-2 py-1 rounded text-primary">
                  {userData?.userInfo?.referral_code}
                </span>
              </p>

              {userData?.referredBy && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold">↑ Referred by:</span>{" "}
                    <span className="font-mono bg-secondary/10 px-1.5 py-0.5 rounded text-xs mr-1">
                      {userData.referredBy.referral_code}
                    </span>
                    {userData.referredBy.username}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push("/u/referrals")}
          className="bg-(--primary)  text-white px-4 py-2 rounded-lg z-10 shadow hover:opacity-90 pointer-events-auto"
        >
          View Member Table
        </button>

      </div>

    </div>
  );
}
