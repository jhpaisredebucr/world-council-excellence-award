"use client";

export default function WithdrawApproveModal({
  isOpen,
  withdrawal,
  loading = false,
  onClose,
  onConfirm
}) {
  if (!isOpen || !withdrawal) return null;

  const isApprove = withdrawal.action === "approve";

  // Show actual account info
  const maskedAccount = withdrawal.account_info || 'N/A';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl">

        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isApprove ? "Approve" : "Reject"} Withdrawal
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {isApprove ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to <span className="font-semibold text-green-600">approve</span> this withdrawal?
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to <span className="font-semibold text-red-600">reject</span> this withdrawal?
              </p>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                <strong>Note:</strong> Rejecting will refund the full amount back to the user&apos;s balance.
              </div>
            </div>
          )}

          {/* Details */}
          <div className="mt-4 space-y-2 text-sm bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between">
              <span className="font-medium">Customer:</span>
              <span>{withdrawal.first_name} {withdrawal.last_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span className="text-green-600 font-semibold">₱{Number(withdrawal.amount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Method:</span>
              <span className="capitalize">{withdrawal.payment_method?.replace(/_/g, " ") || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Account:</span>
              <span className="font-mono">{maskedAccount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Reference #:</span>
              <span className="font-mono text-xs">{withdrawal.reference_number || "N/A"}</span>
            </div>
            {withdrawal.fee > 0 && (
              <div className="flex justify-between">
                <span className="font-medium">Processing Fee:</span>
                <span className="text-red-600">-₱{Number(withdrawal.fee).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(withdrawal.id, withdrawal.action)}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
              isApprove
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Processing..." : isApprove ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}