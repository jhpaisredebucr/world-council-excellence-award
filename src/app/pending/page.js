"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PendingPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.reload(); // Refresh to check status
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-wcea-gradient-soft flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
        {/* Decorative top gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-wcea-gradient" />
        
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-wcea-gradient rounded-full flex items-center justify-center mb-4 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#5C4138] mb-2">
            Account Pending Approval
          </h1>
          <p className="text-gray-600 mb-6">
            Your account is currently under review. Please wait for an administrator to approve your registration.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#f5efe6] border border-[#8D5D28]/20 rounded-lg p-4">
            <p className="text-sm font-semibold text-[#5C4138]">
              <strong>What happens next?</strong>
            </p>
            <ul className="text-sm text-[#5C4138]/80 mt-2 text-left space-y-1">
              <li>• An administrator will review your registration</li>
              <li>• You'll receive approval via email</li>
              <li>• This page will automatically refresh</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Auto-refreshing in <span className="font-bold text-wcea-gradient">{countdown}</span> seconds...
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-[#8D5D28] hover:text-[#5C4138] underline font-medium"
            >
              Check status now
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => router.push("/home")}
              className="text-sm text-gray-500 hover:text-[#5C4138] transition-colors"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}