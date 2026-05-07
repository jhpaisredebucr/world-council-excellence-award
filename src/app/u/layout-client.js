'use client';

import { useEffect, useState } from "react";
import TopBar from "@/app/components/layout/DashboardTopBar";
import SideBar from "@/app/components/layout/DashboardSideBar";
import UploadImageModal from "@/app/components/modal/UploadPicture";
import Loading from "../components/ui/Loading";
import ErrorText from "../components/ui/ErrorText";




export default function DashboardLayout({ children }) {
  const [user, setUser] = useState({
    userInfo: null,
    profile: null,
    contacts: null,
    address: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // fetch user only (shared)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/users", { credentials: "include" });
        const data = await res.json();

        if (data.success) {
          setUser({
            userInfo: data.userInfo,
            profile: data.profile,
            contacts: data.contacts,
            address: data.address
          });
        } else {
          setError("Failed to load user");
        }
      } catch {
        setError("Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);


  // LOADING UI
  if (loading) {
    return (
      <Loading></Loading>
    );
  }

  if (error) return <ErrorText label={error} fullScreen />;

  return (
<div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <UploadImageModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={(url) => console.log(url)}
      />

      <TopBar
        userData={user}
        isMobileMenuOpen={isMobileMenuOpen}
        onMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)}
      />

<div className="flex flex-1 overflow-hidden">
        <SideBar
          role={user.userInfo.role}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        <main
          className={`flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 ${
            user.userInfo?.role === "admin" ? "py-3 sm:py-4 md:py-5" : "py-4 sm:py-5 md:py-6"
          }`}
        >
          <div className="mx-auto w-full max-w-7xl xl:max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}