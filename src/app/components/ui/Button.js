"use client";

import { useRouter, usePathname } from "next/navigation";

/* ─────────────────────────────
   NORMAL BUTTON
───────────────────────────── */
function Button({ children, onClick, icon, bgColor="bg-(--primary)", textColor="text-white", border, width="w-full", className="" }) {
    return (
        <button
            onClick={onClick}
            className={`
                ${width} cursor-pointer 
                p-2 ${bgColor} ${border}
                rounded-2xl ${textColor} 
                font-bold flex gap-4 justify-center
                items-center
                active:scale-95
                transition
                ${className}
            `}
        >
            {icon && (
                <img className="w-5 h-5" src={icon} alt="icon" />
            )}
            {children}
        </button>
    );
}


/* ─────────────────────────────
   NAVBAR BUTTON (ACTIVE UNDERLINE)
───────────────────────────── */
function NavBarButton({ children, href, onClick, className = "", isNavbar }) {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = pathname === href;

    return (
        <button
            onClick={() => {
                if (href) router.push(href);
                if (onClick) onClick();
            }}
            className={`
                relative
                flex-1
                mx-1 p-2 h-10
                cursor-pointer
                transition duration-300
                active:scale-95

                ${isActive
                    ? "text-white font-semibold"
                    : isNavbar
                        ? "text-white/80 hover:text-white"
                        : "text-gray-700 hover:text-(--primary)"
                }

                ${isNavbar ? `
                    after:content-['']
                    after:absolute
                    after:left-2
                    after:-bottom-1
                    after:h-[2px]
                    after:w-[calc(100%-16px)]
                    after:bg-white
                    after:origin-left
                    after:transition-transform
                    after:duration-300

                    ${isActive
                        ? "after:scale-x-100"
                        : "after:scale-x-0 hover:after:scale-x-100"
                    }
                ` : `
                    after:content-['']
                    after:absolute
                    after:left-0
                    after:-bottom-1
                    after:h-[2px]
                    after:w-full
                    after:bg-(--primary)
                    after:origin-left
                    after:transition-transform
                    after:duration-300

                    ${isActive
                        ? "after:scale-x-100"
                        : "after:scale-x-0 hover:after:scale-x-100"
                    }
                `}
                ${className}
            `}
        >
            {children}
        </button>
    );
}

export default Button;
export { NavBarButton };