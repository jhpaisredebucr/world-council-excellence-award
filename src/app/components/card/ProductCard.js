import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import ProductDetailModal from "../modal/ProductDetailModal";

export default function ProductCard({ products, userData, setBuying, setSelectedProduct, AddToCart }) {
    const data = {
        id: products.id,
        user_id: userData.userInfo.id,
        product_id: products.id,
        product_name: products.product_name,
        price: products.price
    }

    const isBuyingButtonClassName = "cursor-pointer w-full px-3 py-2 rounded-full bg-(--primary) text-white text-2xl font-bold"

    const [quantity, setQuantity] = useState(0);
    const [showModal, setShowModal] = useState(false);


    return (
        <>
            <div className="
                p-4 rounded-xl bg-white border-0 border-(--primary)
                flex flex-col gap-4 shadow-[0_0_4px_rgba(0,0,0,0.10)]
                transition duration-300 hover:-translate-y-2 hover:border hover:shadow-lg cursor-pointer
            " onClick={() => setShowModal(true)}>
            {/* Image — full width */}
            <div className="overflow-hidden rounded-lg w-full h-40">
                <CldImage 
                    src={`/${products.img_url}`} 
                    alt="Product Picture" 
                    effect="brightness:100"
                    width={400} 
                    height={160} 
                    className="w-full h-full object-cover transition duration-300 ease-in-out hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 flex-1">
                <p className="font-bold">{products?.product_name}</p>
                <p className="text-sm text-gray-400">{products?.description}</p>
                <p className="text-2xl text-[#465a7b] font-bold">₱{products?.price}.00</p>
            </div>

            {quantity === 0 && <button 
                onClick={(e) => {
                    e.stopPropagation();
                    AddToCart(data);
                    setQuantity(quantity + 1)
                }} 
                className="cursor-pointer w-full px-5 py-2 rounded-xl border border-(--primary)"
            >
                Buy
            </button>}

            {quantity > 0 && 
            <div className="flex items-center justify-between gap-2">
                <Image src="/icons/minus-circle-filled.svg" alt="icon" width={32} height={32}
                    onClick={(e) => {
                        e.stopPropagation();
                        AddToCart(data, "del");
                        setQuantity(quantity - 1)
                    }} 
                />
            
                <p className="text-lg font-bold min-w-5 text-center">{quantity}</p>

                <Image src="/icons/plus-circle-filled.svg" alt="icon" width={32} height={32}
                    onClick={(e) => {
                        e.stopPropagation();
                        AddToCart(data);
                        setQuantity(quantity + 1)
                    }} 
                />
            </div>}
            </div>
            
            <ProductDetailModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                item={products}
                type="product"
            />
        </>
    )
}