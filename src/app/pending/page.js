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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Account Pending Approval
          </h1>
          <p className="text-gray-600 mb-6">
            Your account is currently under review. Please wait for an administrator to approve your registration.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>What happens next?</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 text-left space-y-1">
              <li>• An administrator will review your registration</li>
              <li>• You'll receive approval via email</li>
              <li>• This page will automatically refresh</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Auto-refreshing in <span className="font-bold text-blue-600">{countdown}</span> seconds...
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Check status now
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => router.push("/home")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
