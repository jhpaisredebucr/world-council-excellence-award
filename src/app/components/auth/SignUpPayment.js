"use client";

import { useState } from "react";
import UploadImageModal from "../modal/UploadPicture";
import { useRouter } from "next/navigation";

export default function SignUpPayment({
    formData,
    setFormData,
    nextStep,
    prevStep
}) {

    const router = useRouter();

    const [error, setError] = useState(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    // -------------------------
    // DEBUG LOGGER
    // -------------------------
    function logState(label, data) {
        console.log(`[${label}]`, data);
    }


    // -------------------------
    // SET PAYMENT METHOD
    // -------------------------
    function setPayment(method) {

        const map = {
            1: "BANK",
            2: "GCASH",
            3: "PAYMAYA"
        };

        const selected = map[method];

        setFormData(prev => {

            const updated = {
                ...prev,
                paymentMethod: selected
            };

            logState("PAYMENT_METHOD_SET", updated.paymentMethod);
            logState("FULL_FORM_DATA", updated);

            return updated;
        });

        setError(null);
    }


    // -------------------------
    // PLAN PRICE
    // -------------------------
    const planPrice = {
        1: 300,
        2: 900,
        3: 1500
    }[formData.planId];


    // -------------------------
    // HANDLE FILE UPLOAD
    // -------------------------
    function handleUpload(file) {

        console.log("[FILE_RECEIVED]", file);

        setFormData(prev => {

            const updated = {
                ...prev,
                paymentProof: file
            };

            logState("UPLOAD_SET", updated.paymentProof);
            logState("FULL_FORM_DATA", updated);

            return updated;
        });

    }


    // -------------------------
    // SUBMIT SIGNUP
    // -------------------------
    async function HandleSignUp() {

        console.log("[SUBMIT_CLICKED]");
        logState("CURRENT_FORM_DATA", formData);

        setError(null);


        // VALIDATION
        if (!formData.paymentMethod) {
            console.warn("[ERROR] Missing payment method");
            setError("Please select a payment method.");
            return;
        }

        if (!formData.paymentProof) {
            console.warn("[ERROR] Missing payment proof");
            setError("Please upload proof of payment.");
            return;
        }


        try {

            setLoading(true);

            // SIGNUP REQUEST

            logState("SIGNUP_PAYLOAD", formData);

            const signupRes = await fetch(
                "/api/auth/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const signupData = await signupRes.json();

            logState("SIGNUP_RESPONSE", signupData);

            if (!signupRes.ok) {
                setError(signupData.message || "Signup failed.");
                return;
            }

            // CLOUDINARY UPLOAD
            console.log("[CLOUDINARY_UPLOAD] Starting...");

            const uploadData = new FormData();
            uploadData.append("file", formData.paymentProof);
            uploadData.append("folder", `users/${signupData.user.id}/payment-proofs`);

            const cloudinaryRes = await fetch(
                "/api/cloudinary/upload",
                {
                    method: "POST",
                    body: uploadData
                }
            );

            if (!cloudinaryRes.ok) {
                const errorText = await cloudinaryRes.text();
                console.error("[CLOUDINARY_HTTP_ERROR]", errorText);
                setError("Image upload failed.");
                setLoading(false);
                return;
            }

            const cloudinaryData = await cloudinaryRes.json();

            logState("CLOUDINARY_RESPONSE", cloudinaryData);

            const imageUrl = cloudinaryData?.url;

            if (!imageUrl) {
                console.error("[ERROR] Missing secure_url from Cloudinary");
                setError("Image upload failed.");
                setLoading(false);
                return;
            }

            const updatedFormData = {
                ...formData,
                paymentUrl: imageUrl
            };


            // TRANSACTION
            console.log("[TRANSACTION_CREATE] Starting...");

            const transactionPayload = {
                user_id: signupData.user.id,
                type: "plan",
                amount: formData.packagePrice,
                proof: imageUrl,
                payment_method: formData.paymentMethod
            };

            logState("TRANSACTION_PAYLOAD", transactionPayload);

            
            const transactionRes = await fetch(
                "/api/portal/member/transactions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(transactionPayload)
                }
            );

            const transactionData = await transactionRes.json();

            logState("TRANSACTION_RESPONSE", transactionData);

            if (!transactionRes.ok) {
                setError(
                    transactionData.message ||
                    "Transaction creation failed."
                );
                return;
            }


            console.log("[SUCCESS] Flow completed");
            nextStep();

        } catch (err) {

            console.error("[NETWORK_ERROR]", err);
            setError("Network error. Please try again.");

        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="w-full flex justify-center">

            <UploadImageModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUpload={handleUpload}
            />


            <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8"> 


                {/* HEADER - Mobile Optimized */}
                <div className="mb-6 sm:mb-8 text-center md:text-left flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">

                    <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                            Payment Details
                        </h2>

                        <p className="text-gray-500 mt-1 text-sm sm:text-base">
                            Complete your membership payment.
                        </p>
                    </div>

                </div>


                {/* AMOUNT */}
                <div className="mb-6">

                    <p className="text-lg text-gray-700">
                        Amount:
                        <span className="ml-2 font-bold text-(--primary)">
                            ₱{planPrice}
                        </span>
                    </p>

                </div>


                {/* ERROR */}
                {error && (
                    <p className="text-sm text-red-500 mb-6">
                        {error}
                    </p>
                )}


                {/* PAYMENT METHODS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <PaymentCard
                        label="Bank Transfer"
                        selected={formData.paymentMethod === "BANK"}
                        onClick={() => setPayment(1)}
                    />

                    <PaymentCard
                        label="GCash"
                        selected={formData.paymentMethod === "GCASH"}
                        onClick={() => setPayment(2)}
                    />

                    <PaymentCard
                        label="PayMaya"
                        selected={formData.paymentMethod === "PAYMAYA"}
                        onClick={() => setPayment(3)}
                    />

                </div>


                {/* PAYMENT DETAILS */}
                {formData.paymentMethod === "GCASH" && (
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            GCash Payment Details
                        </h3>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-700">Account Name</p>
                                    <p className="text-sm text-gray-500">WCEA Network</p>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText('WCEA Network')}
                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                                >
                                    Copy
                                </button>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-700">GCash Number</p>
                                    <p className="text-sm text-gray-500">0912-345-6789</p>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText('0912-345-6789')}
                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                                >
                                    Copy
                                </button>
                            </div>
                            
                            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-sm font-medium text-yellow-800 mb-1">
                                    Transaction Fees
                                </p>
                                <p className="text-xs text-yellow-600">
                                    Additional transaction fees may apply depending on your payment provider.
                                </p>
                            </div>
                            
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-700">
                                    <strong>Important:</strong> Please take a screenshot of your successful GCash transaction and upload it as proof of payment.
                                </p>
                            </div>
                        </div>
                    </div>
                )}


                {/* BANK TRANSFER DETAILS */}
                {formData.paymentMethod === "BANK" && (
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Bank Transfer Details
                        </h3>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-700">Bank Name</p>
                                    <p className="text-sm text-gray-500">Banco de Oro (BDO)</p>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText('Banco de Oro (BDO)')}
                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                                >
                                    Copy
                                </button>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-700">Account Name</p>
                                    <p className="text-sm text-gray-500">WCEA Network Corporation</p>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText('WCEA Network Corporation')}
                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                                >
                                    Copy
                                </button>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-700">Account Number</p>
                                    <p className="text-sm text-gray-500">1234-5678-9012</p>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText('1234-5678-9012')}
                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                                >
                                    Copy
                                </button>
                            </div>
                            
                            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-sm font-medium text-yellow-800 mb-1">
                                    Transaction Fees
                                </p>
                                <p className="text-xs text-yellow-600">
                                    Additional transaction fees may apply depending on your bank.
                                </p>
                            </div>
                            
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-700">
                                    <strong>Important:</strong> Please take a screenshot of your successful bank transfer and upload it as proof of payment.
                                </p>
                            </div>
                        </div>
                    </div>
                )}


                {/* PAYMAYA DETAILS */}
                {formData.paymentMethod === "PAYMAYA" && (
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            PayMaya Payment Details
                        </h3>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-700">Account Name</p>
                                    <p className="text-sm text-gray-500">WCEA Network</p>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText('WCEA Network')}
                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                                >
                                    Copy
                                </button>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-700">PayMaya Number</p>
                                    <p className="text-sm text-gray-500">0998-765-4321</p>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText('0998-765-4321')}
                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                                >
                                    Copy
                                </button>
                            </div>
                            
                            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-sm font-medium text-yellow-800 mb-1">
                                    Transaction Fees
                                </p>
                                <p className="text-xs text-yellow-600">
                                    Additional transaction fees may apply depending on your payment provider.
                                </p>
                            </div>
                            
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-700">
                                    <strong>Important:</strong> Please take a screenshot of your successful PayMaya transaction and upload it as proof of payment.
                                </p>
                            </div>
                        </div>
                    </div>
                )}


                {/* UPLOAD */}
                <div className="mt-8">

                    <p className="text-sm text-gray-600 mb-2">
                        Proof of Payment
                    </p>

                    <button
                        onClick={() => setIsUploadOpen(true)}
                    className="px-5 py-2 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 transition min-h-[44px]" 
                    >
                        Upload Screenshot
                    </button>

                    {formData.paymentProof && (
                        <p className="text-xs text-green-600 mt-2">
                            File uploaded
                        </p>
                    )}

                </div>


                {/* BUTTONS */}
                <div className="flex gap-4 mt-10">

                    <button
                        onClick={prevStep}
                    className="flex-1 min-h-11 h-12 sm:h-14 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm sm:text-base" 
                    >
                        Back
                    </button>

                    <button
                        onClick={HandleSignUp}
                        disabled={loading}
                    className="flex-1 min-h-11 h-12 sm:h-14 rounded-lg bg-(--primary) text-white font-semibold hover:opacity-90 active:scale-[0.98] transition shadow-md disabled:opacity-50 text-sm sm:text-base" 
                    >
                        {loading ? "Processing..." : "Submit Registration"}
                    </button>

                </div>

            </div>

        </div>

    );

}


/* PAYMENT CARD */
function PaymentCard({ label, selected, onClick }) {

    return (

        <button
            onClick={onClick}
            className={`
                flex items-center justify-center
                rounded-xl border p-6 font-semibold transition
                hover:-translate-y-1 hover:shadow-md
                ${selected
                    ? "border-(--primary) ring-2 ring-(--primary)"
                    : "border-gray-200 hover:border-gray-300"
                }
            `}
        >
            {label}
        </button>

    );

}