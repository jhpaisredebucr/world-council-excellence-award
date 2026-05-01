//SERVER COMPONENT

'use client';

import { useEffect, useState } from "react";
import ReferralTree from "@/app/components/member/ReferralTree";
import { useRouter } from "next/navigation";

export default function Page() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rootTree, setRootTree] = useState(null);
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
            {userData?.referredBy && (
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-lg shadow border max-w-md mx-auto z-20">
                <h3 className="font-bold text-sm mb-1">↑ Referred by:</h3>
                <p className="text-sm">
                  <span className="font-mono bg-secondary/20 px-2 py-1 rounded text-xs mr-2 text-primary">
                    {userData.referredBy.referral_code}
                  </span>
                  {userData.referredBy.username}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No referrals yet
          </div>
        )}

      </div>

      {/* FLOATING HEADER */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-col md:flex-row md:justify-between md:items-center gap-3 pointer-events-none">

        <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-lg shadow border pointer-events-auto">
          <h1 className="text-lg font-bold">Genealogy Tree</h1>

          <p className="text-sm text-gray-600 mt-1">
            Referral Code: {" "}
            <span className="font-mono bg-secondary/20 px-2 py-1 rounded text-primary">
              {userData?.userInfo?.referral_code}
            </span>
          </p>
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
