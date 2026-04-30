'use client';

import { useRef } from 'react';
import QRCode from "react-qr-code";

export default function QRCodeModal({ isOpen, onClose, value }) {
    const qrCodeRef = useRef(null);

    const handleDownloadQR = () => {
        const svg = qrCodeRef.current.querySelector('svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = 'WCEA-referral-link.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* TITLE */}
                <p className="text-lg font-bold text-center">
                    Scan QR Code
                </p>

                {/* QR CODE */}
                <div className="bg-white p-4 border-2 border-gray-200 rounded-lg flex items-center justify-center" ref={qrCodeRef}>
                    <QRCode value={value} size={200} />
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3">
                    <button
                        onClick={handleDownloadQR}
                        className="flex-1 px-4 py-2 rounded-lg bg-(--primary) text-white hover:bg-(--primary-hover) transition"
                    >
                        Download QR Code
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
