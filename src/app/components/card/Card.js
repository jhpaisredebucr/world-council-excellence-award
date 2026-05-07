import Image from "next/image";
import HelpTooltip from "../ui/HelpTooltip";

export default function Card({ className, textColor, title, color, value, valueSize, bold, info, colSpan="col-span-1", rowSpan="row-span-1", src, children, helpTitle, helpContent}) {
    return (
        <div className={`bg-white rounded-2xl shadow-sm  transition-shadow duration-200 p-4 sm:p-5 lg:p-6 flex flex-col justify-between ${colSpan} ${rowSpan} border border-gray-100`}>
            <div className="flex gap-x-2 sm:gap-x-3 items-center">
                {src && <div className={`${color} rounded-xl p-2 sm:p-3 bg-linear-to-br from-opacity-80 to-opacity-100`}><Image src={src} alt="icon" width={16} height={16} className="sm:w-5 sm:h-5 w-4 h-4"></Image></div>}
                <p className="text-gray-500 text-xs sm:text-sm font-medium">{title}</p>
                {helpTitle && helpContent && <HelpTooltip title={helpTitle} content={helpContent} />}
            </div>
            <p className={`${valueSize || "text-xl sm:text-2xl md:text-3xl lg:text-4xl"} ${textColor} font-bold truncate mt-2 sm:mt-3`}>{value}</p>
            {info && <p className="text-green-600 text-xs sm:text-sm mt-1 sm:mt-2 font-medium">{info}</p>}
            {children}
        </div>
    )
}
