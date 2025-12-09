"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
    const { cart, isCartOpen, toggleCart, updateQuantity, removeFromCart } = useCart();

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // if (!isCartOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex justify-end ${isCartOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black/25 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? "opacity-100" : "opacity-0"}`}
                onClick={toggleCart}
            ></div>

            {/* Drawer Panel */}
            <div className={`relative w-full max-w-md bg-[#fffcf4] h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
                {/* Header */}
                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-[#8D61C633]">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 text-brand-purple">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-base font-normal text-[#4e4d4d] leading-6 font-poppins">Meu Carrinho</h2>
                            <p className="text-xs text-brand-purple leading-[18px] font-inter">
                                {cart.length} {cart.length === 1 ? 'item' : 'itens'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggleCart}
                        className="p-2 hover:bg-[#efe3ff] rounded-full transition-colors text-[#4e4d4d]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <p className="text-lg font-poppins font-semibold">Seu carrinho está vazio</p>
                            <p className="text-sm mt-2">Adicione alguns cookies deliciosos!</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-[#efe3ff] rounded-2xl p-4 flex gap-4 shadow-sm relative overflow-hidden"
                            >
                                {/* Image */}
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#f8f8f8] flex-shrink-0">
                                    <Image
                                        src={item.image_front_url || "/placeholder.png"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-lg leading-tight">{item.name}</h3>
                                        <p className="text-brand-purple font-bold mt-1">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center gap-4 bg-[#EFE3FF] rounded-full px-4 py-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-6 h-6 flex items-center justify-center text-[#2B1B0C] hover:text-brand-purple font-bold"
                                            >
                                                -
                                            </button>
                                            <span className="text-lg font-bold text-[#2B1B0C] w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-6 h-6 flex items-center justify-center text-[#2B1B0C] hover:text-brand-purple font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="p-6 border-t border-[#8D61C633]">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-600 font-medium">Total</span>
                            <span className="text-2xl font-bold text-[#8D61C6]">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                            </span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={toggleCart}
                            className="w-full py-4 bg-[#8D61C6] text-white font-bold text-lg rounded-full shadow-lg hover:bg-brand-purple transition-all transform hover:scale-[1.02] active:scale-[0.98] text-center block"
                        >
                            Finalizar Compra
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
