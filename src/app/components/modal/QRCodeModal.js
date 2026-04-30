'use client';

import QRCode from "react-qr-code";

export default function QRCodeModal({ isOpen, onClose, value }) {
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
                <div className="bg-white p-4 border-2 border-gray-200 rounded-lg">
                    <QRCode value={value} size={200} />
                </div>

                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
