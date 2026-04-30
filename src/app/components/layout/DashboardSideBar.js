'use client';

import { useRouter, usePathname } from "next/navigation";
import SidebarButton from "../ui/SideBarButton";

export default function SideBar({
    role = "member",
    isMobileMenuOpen = false,
    onCloseMobileMenu = () => {}
}) {

    const router = useRouter();
    const pathname = usePathname();

    const memberMenu = [
        { id: "announcement", label: "Announcement", path: "/u/announcements", icon: "/icons/announcement.svg" },
        { id: "dashboard", label: "Dashboard", path: "/u/dashboard", icon: "/icons/dashboard.svg" },
        { id: "products", label: "Product Shop", path: "/u/products", icon: "/icons/product-shop.svg" },
        { id: "packages", label: "Package Shop", path: "/u/packages", icon: "/icons/product-shop.svg" },
        { id: "orders", label: "My Orders", path: "/u/orders", icon: "/icons/my-orders.svg" },
        { id: "referrals", label: "Referrals", path: "/u/referrals", icon: "/icons/referrals.svg" },
        { id: "transactions", label: "Transactions", path: "/u/transactions", icon: "/icons/page-flip.svg" },
        { id: "commissions", label: "Commissions", path: "/u/commissions", icon: "/icons/money.svg" },
        { id: "withdraw", label: "Withdraw", path: "/u/withdraw", icon: "/icons/wallet.svg" },
        { id: "deposit", label: "Deposit", path: "/u/deposit", icon: "/icons/building-bank.svg" },
    ];

    const adminMenu = [
        { id: "dashboard", label: "Dashboard", path: "/u/admin/dashboard", icon: "/icons/dashboard.svg" },
        { id: "members", label: "Members", path: "/u/admin/members", icon: "/icons/referrals.svg" },
        { id: "products", label: "Products", path: "/u/admin/products", icon: "/icons/product-shop.svg" },
        { id: "packages", label: "Packages", path: "/u/admin/packages", icon: "/icons/product-shop.svg" },
        { id: "transactions", label: "Transactions", path: "/u/admin/transactions", icon: "/icons/money-thin.svg" },
        { id: "announcement", label: "Announcement", path: "/u/admin/announcements", icon: "/icons/announcement.svg" }
    ];

    const bottomMenu = [
        { id: "about", label: "About", path: "/about", icon: "/icons/more.svg" },
        { id: "settings", label: "Setting", path: "/settings", icon: "/icons/settings.svg" }
    ];

    const menu = role === "admin" ? adminMenu : memberMenu;

    const handleSignOut = async () => {

        try {
            const res = await fetch("/api/auth/signout", {
                method: "POST",
                credentials: "include"
            });

            if (!res.ok) throw new Error("Signout failed");

        } catch (error) {
            console.error("Sign out error:", error);
        }

        window.location.href = "/";
    };

    return (
        <>
        <div className={`fixed inset-0 z-30 h-screen w-full bg-black/30 transition md:hidden ${
            isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}>
            <button
                type="button"
                aria-label="Close navigation menu"
                onClick={onCloseMobileMenu}
                className="h-full w-full"
            />
        </div>

        <div className={`fixed left-0 top-0 z-40 h-screen w-72 max-w-[85vw] bg-white py-5 shadow-xl transition-transform duration-200 md:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
            <div className="flex items-center justify-between px-4 pb-3">
                <p className="text-xs text-gray-400">MENU</p>
                <button
                    type="button"
                    aria-label="Close drawer"
                    onClick={onCloseMobileMenu}
                    className="rounded border border-gray-200 px-2 py-1 text-sm"
                >
                    Close
                </button>
            </div>

            <div>
                {menu.map(item => (
                    <SidebarButton
                        key={item.id}
                        id={item.id}
                        page={pathname}
                        setPage={() => {
                            router.push(item.path);
                            onCloseMobileMenu();
                        }}
                        icon={item.icon}
                        className={`block px-5 py-3 transition ${
                            pathname.startsWith(item.path)
                                ? "border-r-4 border-(--primary) font-semibold"
                                : "text-gray-500"
                        }`}
                    >
                        {item.label}
                    </SidebarButton>
                ))}
            </div>
        </div>

<div className="relative hidden h-full w-56 shrink-0 overflow-y-auto bg-white py-6 no-scrollbar md:block">

            {/* TITLE */}
            {/* <p className="text-3xl font-semibold mb-6 pl-6">
                {role === "admin" ? "Admin" : "Member"}
            </p> */}

            <p className="text-xs text-gray-400 pl-5">
                MENU
            </p>


            {/* MAIN MENU */}
            <div>

                {menu.map(item => (

                    <SidebarButton
                        key={item.id}
                        id={item.id}
                        page={pathname}
                        setPage={() => router.push(item.path)}
                        icon={item.icon}
                        className={`block px-5 py-3 transition ${
                            pathname.startsWith(item.path)
                                ? "border-r-4 border-(--primary) font-semibold"
                                : "text-gray-500"
                        }`}
                    >

                        {item.label}

                    </SidebarButton>

                ))}

            </div>


            <br />


            {/* BOTTOM MENU */}
            <div className="space-y-2">

                {bottomMenu.map(item => (

                    <SidebarButton
                        key={item.id}
                        setPage={
                            item.id === "signout"
                                ? handleSignOut
                                : () => router.push(item.path)
                        }
                        icon={item.icon}
                    >

                        {item.label}

                    </SidebarButton>

                ))}

            </div>

        </div>
        </>

    );
}