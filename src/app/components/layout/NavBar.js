"use client"
import Image from "next/image";
import { useState } from "react";
import { NavBarButton } from "../ui/Button";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const navItems = [
        { label: "Home", href: "/home" },
        { label: "Login", href: "/home/signin" },
        { label: "Register", href: "/home/signup" },
        { label: "Memberships", href: "/home/memberships" },
        { label: "About", href: "/home/about" },
        { label: "Contacts", href: "/home/contacts" },
    ];

    

    return (
        <>
            <nav className="flex w-full h-16 items-center justify-between px-4 sm:px-6 md:px-8 fixed top-0 left-0 right-0 bg-white z-50">
                {/* Logo and Brand */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <Image 
                        src="/images/logos/wcea.png" 
                        alt="logo" 
                        width={35} 
                        height={35}
                        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
                    />
                    <h1 className="text-sm sm:text-base md:text-lg font-semibold whitespace-nowrap">
                        World Council Excellence Award
                    </h1>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1 lg:gap-2">
                    {navItems.map((item) => (
                        <NavBarButton key={item.label} href={item.href}>
                            {item.label}
                        </NavBarButton>
                    ))}
                </div>

                {/* Mobile Hamborhgaaaa Button */}
                <button 
                    onClick={() => setOpen(!open)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Toggle menu"
                >
                    {open ? (
                        // (X)
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        // hamborga
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </nav>

            {/* Mobile Side thing */}
            <>
                {/* Backdrop Overlay */}
                <div 
                    className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out ${
                        open ? 'bg-black/50 pointer-events-auto' : 'bg-black/0 pointer-events-none'
                    }`}
                    onClick={() => setOpen(false)}
                />
                
                {/* Side Drawer */}
                <div className={`fixed top-0 right-0 h-full w-70 bg-white shadow-xl z-50 md:hidden transform transition-transform
                    duration-300 ease-in-out ${
                    open ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    {/* Close Button */}
                    <div className="flex justify-end p-4 border-b border-gray-200">
                        <button 
                            onClick={() => setOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Close menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex flex-col p-4 gap-2">
                        {navItems.map((item) => (
                            <NavBarButton 
                                key={item.label} 
                                href={item.href}
                                onClick={() => {
                                    setOpen(false);
                                }}
                                className="w-full justify-start"
                            >
                                {item.label}
                            </NavBarButton>
                        ))}
                    </div>
                </div>
            </>
        </>
    )
}