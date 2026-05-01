import { CldImage } from "next-cloudinary";

export default function ProductDetailModal({ 
  isOpen, 
  onClose, 
  item, 
  type = "product" 
}) {
  if (!isOpen || !item) return null;

  const isPackage = type === "package";
  const itemName = isPackage ? item.package_name : item.product_name;
  const itemPrice = item.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {isPackage ? "Package Details" : "Product Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          <div className="mb-6">
            <div className="overflow-hidden rounded-lg w-full h-64 sm:h-96">
              <CldImage 
                src={`/${item.img_url}`} 
                alt={`${itemName} Picture`} 
                effect="brightness:100"
                width={800} 
                height={600} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{itemName}</h3>
              <p className="text-2xl text-[#465a7b] font-bold mt-2">₱{itemPrice}.00</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Description</h4>
              <p className="text-gray-600 leading-relaxed">
                {item.description || "No description available."}
              </p>
            </div>

            {/* Additional details could be added here */}
            {item.details && (
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Additional Details</h4>
                <p className="text-gray-600 leading-relaxed">{item.details}</p>
              </div>
            )}

            {item.features && Array.isArray(item.features) && (
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Features</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {item.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
