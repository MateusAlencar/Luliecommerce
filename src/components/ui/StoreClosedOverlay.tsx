"use client";

import React, { useEffect, useState } from "react";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { usePathname } from "next/navigation";

export function StoreClosedOverlay() {
    const { isOpen, isLoading } = useStoreSettings();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Helper to determine if we should bypass the overlay (e.g. for Admin)
    const isAdmin = pathname?.startsWith("/admin");

    if (!isMounted || isLoading) return null;
    if (isOpen || isAdmin) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2 font-display">
                    Loja Fechada
                </h2>

                <p className="text-gray-600 mb-6 leading-relaxed">
                    No momento não estamos aceitando novos pedidos. Por favor, volte mais tarde! 🍪
                </p>

                <div className="text-sm text-gray-400">
                    Luli Cookies Artesanais
                </div>
            </div>
        </div>
    );
}
