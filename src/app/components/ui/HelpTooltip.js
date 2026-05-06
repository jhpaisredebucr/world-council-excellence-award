'use client';

import { useState } from 'react';

export default function HelpTooltip({ title, content }) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onClick={() => setIsVisible(!isVisible)}
                className="ml-1 w-4 h-4 rounded-full bg-(--primary)/50 hover:bg-(--primary)/90 text-white text-xs font-bold flex items-center justify-center transition-colors duration-200"
            >
                ?
            </button>
            
            {isVisible && (
                <div className="absolute z-10 w-64 p-3 bg-(--primary) text-white text-xs rounded-lg shadow-lg left-0 top-full mt-1">
                    <div className="font-bold mb-1 text-sm">{title}</div>
                    <div className="text-white/90">{content}</div>
                    <div className="absolute w-2 h-2 bg-(--primary) transform rotate-45 -top-1 left-2"></div>
                </div>
            )}
        </div>
    );
}
