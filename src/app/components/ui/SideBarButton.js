import Image from "next/image"

export default function SidebarButton({ className, children, setPage, icon }) {
    return (
        <button 
            onClick={setPage}
className={`flex gap-x-3 items-center cursor-pointer w-full text-left h-full px-4 py-3 
             hover:font-bold hover:scale-105 transition-all duration-150 ${className || ''}`}
        >
            <Image src={icon} alt="Sidebar Icon" width={15} height={15}></Image> {children}
        </button>
    );
}