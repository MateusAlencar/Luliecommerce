"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartClient() {
    const { cart, updateQuantity, removeFromCart } = useCart();

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-[#fffcf4] pt-32 pb-16 px-4 md:px-8 font-body">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-brand text-brand-purple mb-8 text-center">Seu Carrinho</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-600 mb-8">Seu carrinho está vazio.</p>
                        <Link
                            href="/"
                            className="px-8 py-3 bg-brand-purple text-white rounded-full font-bold hover:bg-brand-purple transition-colors"
                        >
                            Voltar para a loja
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#efe3ff]">
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col md:flex-row items-center gap-6 border-b border-[#efe3ff] pb-6 last:border-0 last:pb-0"
                                    >
                                        {/* Image */}
                                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-[#f8f8f8] flex-shrink-0">
                                            <Image
                                                src={item.image_front_url || "/placeholder.png"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 text-center md:text-left">
                                            <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                                            <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                                        </div>

                                        {/* Quantity */}
                                        <div className="flex items-center bg-[#f8f8f8] rounded-full px-3 py-1 border border-gray-100">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-brand-purple transition-colors text-lg"
                                            >
                                                -
                                            </button>
                                            <span className="w-10 text-center font-medium text-gray-700">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-brand-purple transition-colors text-lg"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="text-xl font-bold text-brand-purple min-w-[100px] text-center md:text-right">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Remover item"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-[#fcfcfc] p-6 md:p-8 border-t border-[#efe3ff]">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <Link
                                    href="/"
                                    className="text-gray-500 hover:text-brand-purple transition-colors font-medium flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                    Continuar comprando
                                </Link>

                                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                                    <div className="text-right">
                                        <span className="text-gray-500 block text-sm">Total do pedido</span>
                                        <span className="text-3xl font-bold text-[#8D61C6]">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                                        </span>
                                    </div>
                                    <Link href="/checkout" className="w-full md:w-auto px-8 py-4 bg-brand-yellow text-brand-purple font-bold text-lg rounded-full shadow-lg hover:bg-[#ffeeba] transition-all transform hover:scale-[1.02] active:scale-[0.98] text-center block">
                                        Finalizar Compra
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
