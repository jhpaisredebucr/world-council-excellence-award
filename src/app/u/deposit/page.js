//SERVER COMPONENT

'use client'

import { useEffect, useState } from "react";

export default function Deposits() {

  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [proof, setProof] = useState(null);
  const [preview, setPreview] = useState(null);
  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);


  const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  // -----------------------
  // FETCH USER
  // -----------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        //GET USER DATA
        const userRes = await fetchJson("/api/users");

        if (!userRes.success) {
          throw new Error("Failed to load user");
        }

        setUserData(userRes);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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

    if (!amount) {
      setError("Enter amount.");
      return;
    }

    if (!proof) {
      setError("Upload proof of payment.");
      return;
    }

    try {

      setLoading(true);


      // -----------------------
      // CLOUDINARY UPLOAD
      // -----------------------
      const uploadData = new FormData();

      uploadData.append("file", proof);

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
      const res = await fetch(
        "/api/portal/member/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({

            user_id: userData.userInfo.id,
            type: "deposit",
            amount: amount,
            proof: cloudinaryData.url,
            payment_method: method,
            transaction_id: transactionId || null,
            reference_number: referenceNo || null

          })
        }
      );


      const data = await res.json();

      if (!res.ok) {

        setError(data.message || "Transaction failed.");

        return;

      }


      setSuccess(true);

      setMethod("");
      setAmount("");
      setTransactionId("");
      setReferenceNo("");
      setProof(null);
      setPreview(null);


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
            onChange={(e)=>setMethod(e.target.value)}
            className="w-full border p-2 mt-1 rounded-lg"
          >
            <option value="">Select method</option>
            <option value="gcash">GCash</option>
            <option value="maya">PayMaya</option>
            <option value="bank">Bank Transfer</option>
          </select>

        </div>


        {PaymentInstructions()}


        {/* AMOUNT */}
        <div className="mt-5">

          <p className="text-sm">Deposit Amount</p>

          <input
            type="number"
            value={amount}
            placeholder="Enter amount"
            onChange={(e)=>setAmount(e.target.value)}
            className="w-full border p-2 mt-1 rounded-lg"
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
            className="mt-1"
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

          <p className="mt-4 text-green-600 text-sm bg-green-50 p-2 rounded">
            Deposit submitted successfully.
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