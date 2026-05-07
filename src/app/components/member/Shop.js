'use client';

import { useState } from "react";
import ShopCard from "@/app/components/card/ShopCard";
import BuyModal from "@/app/components/modal/BuyModal";

export default function Shop({ products, packages, dashboardData, userData }) {
  const [activeTab, setActiveTab] = useState('products');
  const [isBuying, setBuying] = useState(false);
  const [productCart, setProductCart] = useState([]);
  const [packageCart, setPackageCart] = useState([]);
  const [localDashboardData, setLocalDashboardData] = useState(dashboardData);

  // Cart and items change based on active tab
  const cart = activeTab === 'products' ? productCart : packageCart;
  const setCart = activeTab === 'products' ? setProductCart : setPackageCart;
  const items = activeTab === 'products' ? products : packages;

  function AddToCart(item, status) {
    // Normalize: packages use package_name, products use product_name
    const cleanItem = {
      id: item.id,
      product_id: item.id,
      product_name: item.product_name || item.package_name,
      price: Number(item.price) || 0,
      quantity: 1,
    };

    setCart((prev) => {
      const existing = prev.find((c) => c.id === cleanItem.id);

      if (status !== "del") {
        if (existing) {
          return prev.map((c) =>
            c.id === cleanItem.id ? { ...c, quantity: c.quantity + 1 } : c
          );
        }
        return [...prev, cleanItem];
      }

      if (existing) {
        return prev
          .map((c) =>
            c.id === cleanItem.id ? { ...c, quantity: c.quantity - 1 } : c
          )
          .filter((c) => c.quantity > 0);
      }

      return prev;
    });
  }

  const total = cart.reduce((sum, item) => {
    const price = Number(item.price);
    const qty = Number(item.quantity);
    if (isNaN(price) || isNaN(qty)) return sum;
    return sum + price * qty;
  }, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'products'
              ? "bg-(--primary) text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'packages'
              ? "bg-(--primary) text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Packages
        </button>
      </div>

      {/* Buy Modal */}
      {isBuying && (
        <BuyModal
          setBuying={setBuying}
          product={cart}
          userData={userData}
          dashboardData={localDashboardData}
          onSuccess={(newBalanceData) => {
            setLocalDashboardData((prev) => ({
              ...prev,
              ...newBalanceData,
            }));
          }}
          onClose={() => {
            setProductCart([]);
            setPackageCart([]);
          }}
        />
      )}

      {/* Cart Banner */}
      <div className="mb-5 p-3 text-(--foreground) border border-(--primary) rounded-2xl flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <span>
          {activeTab === 'products'
            ? "Explore and shop high-quality premium products!"
            : "Explore our membership packages!"}
        </span>

        {cart.length !== 0 && (
          <button
            className="text-white text-base sm:text-lg font-bold bg-(--primary) py-1 px-4 rounded-lg w-full sm:w-auto"
            onClick={() => setBuying(true)}
          >
            Cart ({totalItems}) ₱{total}
          </button>
        )}
      </div>

      {/* Item Grid */}
      {items.length === 0 ? (
        <p className="text-center text-gray-500">
          No {activeTab} available.
        </p>
      ) : (
        <div className="px-1 sm:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {items.map((item) => (
            <ShopCard
              key={item.id}
              item={item}
              cartQuantity={
                cart.find((c) => c.id === item.id)?.quantity || 0
              }
              AddToCart={AddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}