import { useState } from "react";

export default function BuyModal({
  setBuying,
  product: cart,
  dashboardData,
  userData,
  onSuccess,
  onClose
}) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("balance");

  function Close() {
    if (onClose) onClose();
    setBuying(false);
  }

  // ----------------------------
  // TOTAL PRICE FROM CART
  // ----------------------------
  const total = (cart || []).reduce((sum, item) => {
    const price = Number(item.price);
    const qty = Number(item.quantity);

    if (isNaN(price) || isNaN(qty)) return sum;

    return sum + price * qty;
  }, 0);

  // ----------------------------
  // BUY CART
  // ----------------------------
async function Buy() {
    setError(null);

    if (!cart || cart.length === 0) {
      setError("Cart is empty.");
      return;
    }

    // Get the available balance based on selected wallet
    const walletBalance = selectedWallet === "balance" 
      ? dashboardData?.balance 
      : selectedWallet === "pc_credit" 
        ? dashboardData?.pc_credit 
        : dashboardData?.ppv_credit;

    if (!walletBalance || walletBalance <= 0) {
      setError("Your selected wallet balance is empty.");
      return;
    }

    if (walletBalance < total) {
      setError(`Not enough ${selectedWallet === "balance" ? "balance" : selectedWallet === "pc_credit" ? "PC credits" : "PPV credits"} to complete this purchase.`);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/products/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userData?.userInfo?.id,
          cart: cart,
          total: total,
          walletType: selectedWallet
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Something went wrong.");
        return;
      }

      setSuccess(true);

      // Optimistically update the balance on the frontend
      const newBalanceData = { ...dashboardData };
      if (selectedWallet === "balance") {
        newBalanceData.balance = (Number(dashboardData.balance) || 0) - total;
      } else if (selectedWallet === "pc_credit") {
        newBalanceData.pc_credit = (Number(dashboardData.pc_credit) || 0) - total;
      } else if (selectedWallet === "ppv_credit") {
        newBalanceData.ppv_credit = (Number(dashboardData.ppv_credit) || 0) - total;
      }

      if (onSuccess) {
        onSuccess(newBalanceData);
      }

    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[450px] mx-4 sm:mx-0 max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-bold text-center">
          Confirm Your Order
        </h2>

        {/* CART ITEMS */}
        <div className="mt-6 space-y-3 max-h-[40vh] sm:max-h-60 overflow-y-auto">
          {cart?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm border-b pb-2"
            >
              <p>
                {item.product_name} × {item.quantity}
              </p>
              <p>₱{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-4 flex justify-between font-bold text-lg">
          <p>Total:</p>
          <p>₱{total}</p>
        </div>

{/* WALLET SELECTION */}
        <div className="mt-5">
          <p className="text-sm font-semibold">Select Payment Method</p>
          <div className="mt-2 space-y-2">
            {/* Balance (Main Wallet) */}
            <label 
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedWallet === "balance" ? "border-(--primary) bg-(--primary)/10" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wallet"
                  value="balance"
                  checked={selectedWallet === "balance"}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-4 h-4 accent-(--primary)"
                />
                <span className="font-medium">Main Wallet</span>
              </div>
              <span className="font-bold">₱{dashboardData?.balance ?? 0}</span>
            </label>

            {/* PC Credits */}
            <label 
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedWallet === "pc_credit" ? "border-(--primary) bg-(--primary)/10" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wallet"
                  value="pc_credit"
                  checked={selectedWallet === "pc_credit"}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-4 h-4 accent-(--primary)"
                />
                <span className="font-medium">PC Credits</span>
              </div>
              <span className="font-bold">{dashboardData?.pc_credit ?? 0}</span>
            </label>

            {/* PPV Credits */}
            <label 
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedWallet === "ppv_credit" ? "border-(--primary) bg-(--primary)/10" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wallet"
                  value="ppv_credit"
                  checked={selectedWallet === "ppv_credit"}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-4 h-4 accent-(--primary)"
                />
                <span className="font-medium">PPV Credits</span>
              </div>
              <span className="font-bold">{dashboardData?.ppv_credit ?? 0}</span>
            </label>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <p className="mt-3 text-sm text-red-500 bg-red-50 p-2 rounded-lg">
            {error}
          </p>
        )}

        {/* SUCCESS */}
        {success && (
          <p className="mt-3 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
            Purchase successful!
          </p>
        )}

        {/* BUTTONS */}
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
          {!success && (
            <button
              onClick={Buy}
              disabled={loading}
              className="px-4 py-2 bg-(--primary) text-white rounded disabled:opacity-50 w-full sm:w-auto"
            >
              {loading ? "Processing..." : "Buy All"}
            </button>
          )}

          <button
            onClick={Close}
            className="px-4 py-2 bg-gray-300 rounded w-full sm:w-auto"
          >
            {success ? "Done" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}