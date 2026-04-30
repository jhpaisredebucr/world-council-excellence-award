import Image from "next/image";

export default function Card({ className, textColor, title, color, value, valueSize, bold, info, colSpan="col-span-1", rowSpan="row-span-1", src, children}) {
    return (
        <div className={`bg-white rounded-2xl shadow-[0_0_4px_rgba(0,0,0,0.10)] p-3 sm:p-5 flex flex-col justify-between ${colSpan} ${rowSpan}`}>
            <div className="flex gap-x-2 items-center">
                {src && <div className={`${color} rounded-xl p-2 sm:p-3`}><Image src={src} alt="icon" width={16} height={16} className="sm:w-5 sm:h-5"></Image></div>}
                <p className="text-gray-400 text-xs sm:text-sm">{title}</p>

            </div>
            <p className={`${valueSize} ${textColor} font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl`}>{value}</p>
            {info && <p className="text-green-500 text-xs sm:text-sm mt-1 sm:mt-2">{info}</p>}
            {children}
        </div>
    )
}