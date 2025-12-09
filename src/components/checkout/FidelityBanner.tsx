"use client";

import React from "react";
import Link from "next/link";

export function FidelityBanner() {
    return (
        <Link
            href="/signin?redirect=/checkout"
            className="block bg-[#8d61c6] border border-[rgba(141,97,198,0.1)] rounded-2xl shadow-sm px-4 py-4 hover:bg-[#7a52b3] transition-colors"
        >
            <div className="flex items-center justify-between gap-4">
                {/* Left side: Icon and text */}
                <div className="flex items-center gap-3 flex-1">
                    {/* Icon container */}
                    <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-[#8d61c6]">
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                    </div>

                    {/* Text */}
                    <p className="text-[#fcf6e4] text-sm font-medium leading-snug">
                        Crie uma conta e entre no nosso programa de fidelidade
                    </p>
                </div>

                {/* Right side: Arrow */}
                <div className="shrink-0">
                    <span className="text-[#fcf6e4] text-base">→</span>
                </div>
            </div>
        </Link>
    );
}
