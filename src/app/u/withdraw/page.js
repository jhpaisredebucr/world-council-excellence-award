//SERVER COMPONENT

'use client'

import { useEffect, useState } from "react";

// Basic withdrawal methods (no PayMongo)
const WITHDRAWAL_METHODS = [
  { id: 'gcash', name: 'GCash', description: 'Instant mobile wallet payment', icon: '📱' },
  { id: 'maya', name: 'PayMaya', description: 'Instant mobile wallet payment', icon: '📱' },
  { id: 'bank', name: 'Bank Transfer', description: 'Direct bank deposit', icon: '🏦' },
];

export default function Withdraw() {

  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [accountInfo, setAccountInfo] = useState(""); // gcash number / bank acct etc
  const [userData, setUserData] = useState(null);
  const [userBalance, setUserBalance] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // -----------------------
  // FETCH USER
  // -----------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);
        const res = await fetch("/api/users");
        const data = await res.json();

        if (!data.success) throw new Error("Failed to load user");

        setUserData(data);
        setUserBalance(Number(data.userInfo?.balance) || 0);

      } catch (err) {
        console.error(err);
        setError("Failed to load user data");
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, []);

  if (initialLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-dashed"></div>
          <div className="text-xl text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  // Only show full page error for serious errors, not validation messages
  const isValidationError = error && (
    error.includes("Select withdrawal method") ||
    error.includes("Enter valid amount") ||
    error.includes("Enter account details") ||
    error.includes("Insufficient balance")
  );

  if (error && !success && !isValidationError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-4 text-center text-xl text-red-500">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-primary px-4 py-2 text-white hover:bg-secondary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // -----------------------
  // VALIDATE + SUBMIT
  // -----------------------
  async function SubmitWithdraw() {

    setError(null);

    if (!userData?.userInfo?.id) {
      setError("User not loaded.");
      return;
    }

    if (!method) {
      setError("Select withdrawal method.");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Enter valid amount.");
      return;
    }

    // Check if user has sufficient balance
    const totalDeduction = parseFloat(amount);
    if (userBalance < totalDeduction) {
      setError(`Insufficient balance. Available: ₱${userBalance.toFixed(2)}, Required: ₱${totalDeduction.toFixed(2)}`);
      return;
    }

    if (!accountInfo) {
      setError("Enter account details.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/portal/member/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userData.userInfo.id,
          type: "withdrawal",
          amount: parseFloat(amount),
          payment_method: method,
          account_info: accountInfo
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Withdrawal failed.");
        return;
      }

      setSuccess(true);
      setMethod("");
      setAmount("");
      setAccountInfo("");

    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------
  // UI
  // -----------------------
  return (
    <div className="mt-4 flex justify-center sm:mt-8">

      <div className="w-full max-w-xl rounded-xl bg-white p-4 shadow-lg sm:p-6">

        <h2 className="text-xl font-bold text-center">
          Withdraw Funds
        </h2>

        {/* METHOD */}
        <div className="mt-5">
          <p className="text-sm">Withdrawal Method</p>

          <select
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
            }}
            className="w-full border p-2 mt-1 rounded-lg"
          >
            <option value="">Select method</option>
            {WITHDRAWAL_METHODS.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.icon} {pm.name} - {pm.description}
              </option>
            ))}
          </select>
        </div>

        {/* ACCOUNT INFO */}
        <div className="mt-5">
          <p className="text-sm">
            {method === "bank"
              ? "Bank Account Details"
              : "Account Number / Mobile Number"}
          </p>

          <input
            type="text"
            value={accountInfo}
            placeholder={
              method === "bank"
                ? "Enter bank account number"
                : "Enter account number"
            }
            onChange={(e) => setAccountInfo(e.target.value)}
            className="w-full border p-2 mt-1 rounded-lg"
          />
        </div>

        {/* USER BALANCE */}
        <div className="mt-5 bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-semibold">Available Balance</p>
          <p className="text-lg font-bold text-green-600">₱{userBalance.toFixed(2)}</p>
        </div>

        {/* AMOUNT */}
        <div className="mt-5">
          <p className="text-sm">Withdrawal Amount</p>

          <input
            type="number"
            value={amount}
            placeholder="Enter amount"
            onChange={(e)=>setAmount(e.target.value)}
            className="w-full border p-2 mt-1 rounded-lg"
            step="0.01"
            min="1"
            max={userBalance}
          />
        </div>

        {/* SUCCESS */}
        {success && (
          <div className="mt-4 text-green-600 text-sm bg-green-50 p-3 rounded">
            <p className="font-semibold mb-2">Withdrawal request submitted successfully!</p>
            <p>Reference: Processing...</p>
            <p>Amount: ₱{parseFloat(amount).toFixed(2)}</p>
            <p className="text-xs mt-2">Your withdrawal will be processed within 1-3 business days.</p>
          </div>
        )}

        {/* INLINE ERROR */}
        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        {/* BUTTON */}
        {!success && (
          <button
            onClick={SubmitWithdraw}
            disabled={loading}
            className="mt-6 w-full bg-primary text-white py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Withdrawal"}
          </button>
        )}

      </div>
    </div>
  );
}