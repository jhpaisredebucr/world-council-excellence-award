"use client";

import { CldImage } from "next-cloudinary";

export default function ProofOfDepositModal({
  isOpen,
  onClose,
  deposit,
  loading = false
}) {
  if (!isOpen || !deposit) return null;

  const hasProof = deposit.proof;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Proof of Deposit
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {deposit.first_name} {deposit.last_name} (#{deposit.id})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {hasProof ? (
            <div className="space-y-4">
              {/* Deposit Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Deposit Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      deposit.status === "pending"
                        ? "bg-orange-100 text-orange-800"
                        : deposit.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : deposit.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {deposit.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <span className="ml-2 font-medium">₱{Number(deposit.amount || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="ml-2 font-medium capitalize">{deposit.payment_method?.replace(/_/g, " ") || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Reference #:</span>
                    <span className="ml-2 font-mono text-xs">{deposit.reference_number || 'N/A'}</span>
                  </div>
                  {deposit.fee > 0 && (
                    <div>
                      <span className="text-gray-500">Processing Fee:</span>
                      <span className="ml-2 text-red-600">-₱{Number(deposit.fee).toLocaleString()}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <span className="ml-2 font-medium">
                      {deposit.created_at ? new Date(deposit.created_at).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Proof Image */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Payment Proof</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-center">
                    <img
                      src={hasProof}
                      alt="Deposit proof"
                      className="rounded-lg shadow-md max-w-full h-auto max-h-[500px] object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Proof of Payment</h3>
              <p className="text-gray-600">This deposit doesn't have a proof image.</p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}