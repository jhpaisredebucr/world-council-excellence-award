"use client"

import { CldImage } from "next-cloudinary";

export default function OrderCard({orders, products}) {
    const product = products.find(p => p.id === orders?.product_id);

    return (
        <div>
            <div className="grid grid-cols-4 items-center p-5 rounded-lg bg-white shadow-[0_0_4px_rgba(0,0,0,0.10)]">
                <div className="flex col-span-2 items-center">
                    {product?.img_url ? (
                        <CldImage 
                            src={product.img_url} 
                            alt="Product Picture" 
                            width={100} 
                            height={70} 
                            crop="fill"
                            gravity="center"
                            className="rounded-sm mr-5 h-auto w-auto"
                        />
                    ) : (
                        <div className="w-24 h-15 bg-gray-200 rounded-sm mr-5 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                    )}
                    <div>
                        <p className="text-lg font-bold">{product?.product_name || 'Unknown Product'}</p>
                        <p>Qty: {orders.quantity}</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Price</p>
                    <p className="text-(--price-color)">{product?.price}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p className="text-(--foreground)">{orders?.status}</p>
                </div>
            </div>
        </div>
    )
}