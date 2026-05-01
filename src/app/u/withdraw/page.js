//SERVER COMPONENT

'use client'

import { useEffect, useState } from "react";
import { calculateFees, getFeeInfo, getAvailablePaymentMethods } from "@/lib/paymongo";

export default function Withdraw() {

  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [accountInfo, setAccountInfo] = useState(""); // gcash number / bank acct etc
  const [userData, setUserData] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [feeInfo, setFeeInfo] = useState(null);
  const [calculatedFees, setCalculatedFees] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // -----------------------
  // CALCULATE FEES
  // -----------------------
  const calculateWithdrawalFees = () => {
    if (!amount || !method) return;
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    
    const fees = calculateFees(amountNum, method, 'withdrawal');
    const feeDetails = getFeeInfo(method, 'withdrawal');
    
    setCalculatedFees(fees);
    setFeeInfo(feeDetails);
  };

  useEffect(() => {
    calculateWithdrawalFees();
  }, [amount, method]);

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
        setUserBalance(data.userInfo?.balance || 0);

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

  if (error && !success) {
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
    const totalDeduction = calculatedFees?.totalAmount || parseFloat(amount);
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
      setCalculatedFees(null);
      setFeeInfo(null);

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
            {getAvailablePaymentMethods().filter(pm => pm.id !== 'paymongo_checkout').map((pm) => (
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

        {/* FEE INFORMATION */}
        {calculatedFees && (
          <div className="mt-5 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Fee Information</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Withdrawal Amount:</span>
                <span className="font-medium">₱{calculatedFees.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee ({feeInfo?.description}):</span>
                <span className="font-medium text-red-600">-₱{calculatedFees.fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Net Amount:</span>
                <span className="text-green-600">₱{calculatedFees.netAmount.toFixed(2)}</span>
              </div>
            </div>
            {userBalance < calculatedFees.totalAmount && (
              <p className="text-xs text-red-600 mt-2">
                Insufficient balance. Need ₱{(calculatedFees.totalAmount - userBalance).toFixed(2)} more.
              </p>
            )}
          </div>
        )}

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

        {/* ERROR */}
        {error && (
          <p className="mt-4 text-red-500 text-sm bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mt-4 text-green-600 text-sm bg-green-50 p-3 rounded">
            <p className="font-semibold mb-2">Withdrawal request submitted successfully!</p>
            <p>Reference: Processing...</p>
            <p>Net amount to be received: ₱{calculatedFees?.netAmount?.toFixed(2) || '0.00'}</p>
            <p className="text-xs mt-2">Your withdrawal will be processed within 1-3 business days.</p>
          </div>
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