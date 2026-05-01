'use client';

import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import ProductDetailModal from "@/app/components/modal/ProductDetailModal";

export default function ShopCard({ item, cartQuantity, AddToCart }) {
  // cartQuantity comes from the parent cart — it's the source of truth
  const itemName = item.product_name || item.package_name;
  const itemPrice = Number(item.price) || 0;
  const itemType = item.package_name ? "package" : "product";

  const [quantity, setQuantity] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Cart data shape matches what /api/products/buy expects
  const cartItem = {
    id: item.id,
    product_id: item.id,
    product_name: itemName,
    price: itemPrice,
  };

  return (
    <>
      <div
        className="
          p-4 rounded-xl bg-white border-0 border-(--primary)
          flex flex-col gap-4 shadow-[0_0_4px_rgba(0,0,0,0.10)]
          transition duration-300 hover:-translate-y-2 hover:border hover:shadow-lg
          cursor-pointer
        "
        onClick={() => setShowModal(true)}
      >
        {/* Image */}
        <div className="overflow-hidden rounded-lg w-full h-40">
          <CldImage
            src={`/${item.img_url}`}
            alt={itemName}
            effect="brightness:100"
            width={400}
            height={160}
            className="w-full h-full object-cover transition duration-300 ease-in-out hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 flex-1">
          <p className="font-bold">{itemName}</p>
          <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
          <p className="text-2xl text-[#465a7b] font-bold">
            ₱{itemPrice.toLocaleString()}
          </p>
        </div>

        {/* Quantity Controls */}
        {!cartQuantity ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              AddToCart(cartItem);
              setQuantity(1);
            }}
            className="cursor-pointer w-full px-5 py-2 rounded-xl border border-(--primary)"
          >
            Buy
          </button>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <Image
              src="/icons/minus-circle-filled.svg"
              alt="remove"
              width={32}
              height={32}
              onClick={(e) => {
                e.stopPropagation();
                AddToCart(cartItem, "del");
                setQuantity((q) => Math.max(0, q - 1));
              }}
              className="cursor-pointer"
            />
            <p className="text-lg font-bold min-w-5 text-center">{cartQuantity}</p>
            <Image
              src="/icons/plus-circle-filled.svg"
              alt="add"
              width={32}
              height={32}
              onClick={(e) => {
                e.stopPropagation();
                AddToCart(cartItem);
                setQuantity((q) => q + 1);
              }}
              className="cursor-pointer"
            />
          </div>
        )}
      </div>

      <ProductDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        item={item}
        type={itemType}
      />
    </>
  );
}