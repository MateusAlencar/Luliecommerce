"use client";

import React from "react";
import { useUser } from "@/context/UserContext";

export function FidelityProgress() {
    const { user, hasFreeCookie } = useUser();
    const purchasesRemaining = Math.max(0, 5 - user.purchaseCount);
    const progress = Math.min((user.purchaseCount / 5) * 100, 100);

    return (
        <div className="bg-gradient-to-br from-[#8d61c6] to-[#7a52b3] rounded-2xl shadow-sm p-6 text-white overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-white">
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Programa de Fidelidade</h2>
                        <p className="text-white/80 text-sm">Ganhe um cookie grátis!</p>
                    </div>
                </div>

                {hasFreeCookie ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-5xl mb-2">🎉</div>
                        <p className="text-xl font-bold mb-2">Parabéns!</p>
                        <p className="text-white/90">Você ganhou um cookie grátis na sua próxima compra!</p>
                    </div>
                ) : (
                    <>
                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium">{user.purchaseCount} de 5 compras</span>
                                <span className="text-white/80">{purchasesRemaining} {purchasesRemaining === 1 ? 'compra faltando' : 'compras faltando'}</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Cookie Icons */}
                        <div className="flex justify-center gap-2 mt-6">
                            {[...Array(5)].map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${index < user.purchaseCount
                                            ? "bg-white text-brand-purple scale-110"
                                            : "bg-white/20 text-white/40"
                                        }`}
                                >
                                    🍪
                                </div>
                            ))}
                        </div>

                        <p className="text-center text-white/90 text-sm mt-4">
                            {purchasesRemaining === 1
                                ? "Falta apenas mais 1 compra para ganhar seu cookie grátis!"
                                : `Faça mais ${purchasesRemaining} compras para ganhar um cookie grátis!`}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
