//SERVER COMPONENT

'use client'

import { useEffect, useState } from "react";
import { calculateFees, getFeeInfo, getAvailablePaymentMethods } from "@/lib/paymongo";


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
  const [successData, setSuccessData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [feeInfo, setFeeInfo] = useState(null);
  const [calculatedFees, setCalculatedFees] = useState(null);


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

  // -----------------------
  // CALCULATE FEES (UI preview)
  // -----------------------
  useEffect(() => {

    const amountNum = parseFloat(amount);
    if (!method || !amount || isNaN(amountNum) || amountNum <= 0) {
      setCalculatedFees(null);
      setFeeInfo(null);
      return;
    }

    const fees = calculateFees(amountNum, method, 'withdrawal');
    const details = getFeeInfo(method, 'withdrawal');
    setCalculatedFees(fees);
    setFeeInfo(details);
  }, [amount, method]);

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

    // Check if user has sufficient balance (amount + fees must not exceed balance)
    const amountNum = parseFloat(amount);
    const feesNum = calculatedFees ? calculatedFees.fee : 0;
    const totalDeduction = amountNum + feesNum;
    if (userBalance < totalDeduction) {
      setError(`Insufficient balance. Available: ₱${userBalance.toFixed(2)}, Required: ₱${totalDeduction.toFixed(2)} (includes ₱${feesNum.toFixed(2)} fee)`);
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
      setSuccessData({ amount: parseFloat(amount), fee: calculatedFees?.fee || 0 });
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

        {/* FEES PREVIEW */}
        {calculatedFees !== null && (
          <div className="mt-4 bg-blue-50 p-3 rounded-lg">
            <p className="text-sm font-semibold">Fee Breakdown</p>
            <div className="flex justify-between text-sm mt-1">
              <span>Withdrawal Amount:</span>
              <span className="font-medium">₱{parseFloat(amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Fee ({feeInfo?.name || 'Processing Fee'}):</span>
              <span className="font-medium">₱{calculatedFees.fee.toFixed(2)}</span>
            </div>
            {feeInfo?.percentage > 0 && (
              <p className="text-xs text-gray-500 mt-1">{feeInfo.percentage}% of amount</p>
            )}
            <div className="flex justify-between text-sm mt-2 pt-2 border-t border-blue-200">
              <span className="font-semibold">Total Deduction:</span>
              <span className="font-bold text-red-600">₱{calculatedFees.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="font-semibold">You&apos;ll Receive:</span>
              <span className="font-bold text-green-600">₱{parseFloat(amount).toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mt-4 text-green-600 text-sm bg-green-50 p-3 rounded">
            <p className="font-semibold mb-2">Withdrawal request submitted successfully!</p>
            <p>Reference: Processing...</p>
            <p>Amount: ₱{successData?.amount?.toFixed(2)}</p>
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