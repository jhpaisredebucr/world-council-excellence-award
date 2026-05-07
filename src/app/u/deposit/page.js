//SERVER COMPONENT

'use client'

import { useEffect, useState } from "react";
import { calculateFees, getFeeInfo, getAvailablePaymentMethods } from "@/lib/paymongo";

export default function Deposits() {

  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [proof, setProof] = useState(null);
  const [preview, setPreview] = useState(null);
  const [userData, setUserData] = useState(null);
  const [feeInfo, setFeeInfo] = useState(null);
  const [calculatedFees, setCalculatedFees] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);


  const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  // -----------------------
  // CALCULATE FEES
  // -----------------------
  const calculateDepositFees = () => {
    if (!amount || !method) return;
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    
    const fees = calculateFees(amountNum, method, 'deposit');
    const feeDetails = getFeeInfo(method, 'deposit');
    
    setCalculatedFees(fees);
    setFeeInfo(feeDetails);
  };

  useEffect(() => {
    calculateDepositFees();
  }, [amount, method]);

  // -----------------------
  // FETCH USER
  // -----------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);
        //GET USER DATA
        const userRes = await fetchJson("/api/users");

        if (!userRes.success) {
          throw new Error("Failed to load user");
        }

        setUserData(userRes);

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
  // FILE CHANGE
  // -----------------------
  function handleFileChange(e) {

    const file = e.target.files[0];

    if (!file) return;

    setProof(file);
    setPreview(URL.createObjectURL(file));

  }

  // -----------------------
  // INITIAL LOADING
  // -----------------------
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
    error.includes("Select payment method") ||
    error.includes("Enter valid amount") ||
    error.includes("Upload proof") ||
    error.includes("Upload failed")
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
  // PAYMENT INSTRUCTIONS
  // -----------------------
  function PaymentInstructions() {

    if (!method) return null;

    if (method === "gcash") {

      return (
        <div className="bg-gray-50 p-3 rounded mt-3 text-sm">
          Send payment to:<br />
          <strong>GCash: 09123456789</strong><br />
          Name: Juan Dela Cruz
        </div>
      );

    }

    if (method === "maya") {

      return (
        <div className="bg-gray-50 p-3 rounded mt-3 text-sm">
          Send payment to:<br />
          <strong>Maya: 09123456789</strong><br />
          Name: Juan Dela Cruz
        </div>
      );

    }

    if (method === "bank") {

      return (
        <div className="bg-gray-50 p-3 rounded mt-3 text-sm">
          Bank Transfer:<br />
          <strong>BDO</strong><br />
          Account Name: Juan Dela Cruz<br />
          Account Number: 1234567890
        </div>
      );

    }

  }


  // -----------------------
  // SUBMIT DEPOSIT
  // -----------------------
  async function SubmitDeposit() {
    console.log(userData);

    setError(null);

    if (!userData?.userInfo?.id) {
      setError("User not loaded.");
      return;
    }

    if (!method) {
      setError("Select payment method.");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Enter valid amount.");
      return;
    }

    // Require proof for all deposits
    if (!proof) {
      setError("Upload proof of payment.");
      return;
    }

    try {

      setLoading(true);

      // Upload proof
      const uploadData = new FormData();
      uploadData.append("file", proof);
      uploadData.append("folder", `users/${userData.userInfo.id}/deposits`);

      const cloudinaryRes = await fetch(
        "/api/cloudinary/upload",
        {
          method: "POST",
          body: uploadData
        }
      );

      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryData.url) {
        setError("Upload failed.");
        return;
      }


      // -----------------------
      // SAVE TRANSACTION
      // -----------------------
      const transactionData = {
        user_id: userData.userInfo.id,
        type: "deposit",
        amount: parseFloat(amount),
        payment_method: method,
        transaction_id: transactionId || null,
        reference_number: referenceNo || null,
        customer_info: {
          name: `${userData.userInfo.first_name} ${userData.userInfo.last_name}`,
          email: userData.userInfo.email,
          phone: userData.userInfo.phone || ''
        },
        proof: cloudinaryData.url
      };

      const res = await fetch(
        "/api/portal/member/deposits",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(transactionData)
        }
      );


      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Transaction failed.");
        return;
      }

      setSuccess(true);
      setSuccessData({ netAmount: calculatedFees.netAmount, reference_number: transactionId || referenceNo || 'Processing...' });
      setMethod("");
      setAmount("");
      setTransactionId("");
      setReferenceNo("");
      setProof(null);
      setPreview(null);
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

    <div className="mt-4 flex justify-center py-4 sm:mt-8 sm:py-6">

      <div className="w-full max-w-xl rounded-xl bg-white p-4 shadow-lg sm:p-6">

        <h2 className="text-xl font-bold text-center">
          Deposit Funds
        </h2>


        {/* METHOD */}
        <div className="mt-5">

          <p className="text-sm">Payment Method</p>

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full border p-2 mt-1 rounded-lg"
          >
            <option value="">Select method</option>
            {getAvailablePaymentMethods().map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.icon} {pm.name} - {pm.description}
              </option>
            ))}
          </select>

        </div>


        {PaymentInstructions()}


        {/* FEE INFORMATION */}
        {calculatedFees && (
          <div className="mt-5 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Fee Information</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Deposit Amount:</span>
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
          </div>
        )}


        {/* AMOUNT */}
        <div className="mt-5">

          <p className="text-sm">Deposit Amount</p>

          <input
            type="number"
            value={amount}
            placeholder="Enter amount"
            onChange={(e)=>setAmount(e.target.value)}
            className="w-full border p-2 mt-1 rounded-lg"
            step="0.01"
            min="1"
          />

        </div>

        {/* TRANSACTION ID */}
        <div className="mt-5">
          <p className="text-sm">Transaction ID (Optional)</p>

          <input
            type="text"
            value={transactionId}
            placeholder="Enter transaction ID"
            onChange={(e)=>setTransactionId(e.target.value)}
            className="w-full border p-2 mt-1 rounded-lg"
          />
        </div>

        {/* REFERENCE NO */}
        <div className="mt-5">
          <p className="text-sm">Reference No. (Optional)</p>

          <input
            type="text"
            value={referenceNo}
            placeholder="Enter reference number"
            onChange={(e)=>setReferenceNo(e.target.value)}
            className="w-full border p-2 mt-1 rounded-lg"
          />
        </div>


        {/* FILE */}
        <div className="mt-5">

          <p className="text-sm">Upload Proof</p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 file:rounded-lg file:border file:border-gray-300 file:px-2 file:py-2"
          />

        </div>


        {/* PREVIEW */}
        {preview && (

          <div className="mt-4">

            <p className="text-sm mb-2">Preview</p>

            <img
              src={preview}
              className="rounded border"
            />

          </div>

        )}


        {/* ERROR */}
        {error && (

          <p className="mt-4 text-red-500 text-sm bg-red-50 p-2 rounded">
            {error}
          </p>

        )}


        {/* SUCCESS */}
        {success && (

          <div className="mt-4 text-green-600 text-sm bg-green-50 p-3 rounded">
            <p className="font-semibold mb-2">Deposit submitted successfully!</p>
            <p>Reference: {successData?.reference_number}</p>
            <p>Net amount to be credited: ₱{successData?.netAmount?.toFixed(2)}</p>
            <p className="text-xs mt-2">Your deposit will be processed within 24 hours.</p>
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
            onClick={SubmitDeposit}
            disabled={loading}
            className="mt-6 w-full bg-primary text-white py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Deposit"}
          </button>

        )}

      </div>

    </div>

  );

}