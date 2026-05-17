'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function TopBar() {
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await fetch("/api/auth/logged-in");
                const data = await res.json();
                setLoggedIn(data.loggedIn);
            } catch (err) {
                setLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };
        checkLogin();
        // Poll every 3s for login state changes
        const interval = setInterval(checkLogin, 3000);
        return () => clearInterval(interval);
    }, []);

    function GoDashboard() {
        router.push(loggedIn ? "/u/dashboard" : "/home/signin");
    }
    
    if (loading) return null; // or a spinner

    return (
        <div className="h-10 bg-wcea-gradient-dark text-white 
            font-semibold flex items-center text-xs sm:text-sm md:text-base px-4
            "> 
            
            <span className="mr-4">☎ +63 999 676 6767</span>
            <span>✉ placeholder@gmail.com</span>
            <a className="hover:scale-104 hover:text-[#f0d5b8] transition duration-75 ml-auto cursor-pointer" onClick={GoDashboard}>
                {loggedIn ? "Go to Dashboard >" : "Sign In >"}
            </a>
        </div>
    )
}