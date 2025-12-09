"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export function OrderSummary() {
    const { cart, shippingCost } = useCart();

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = shippingCost;
    const total = subtotal + shipping;

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#efe3ff]">
            <h2 className="text-xl font-bold text-[#8D61C6] mb-6">Resumo do Pedido</h2>

            <div className="flex flex-col gap-4 mb-6">
                {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#f8f8f8] flex-shrink-0 border border-[#efe3ff]">
                            <Image
                                src={item.image_front_url || "/placeholder.png"}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-0 right-0 bg-brand-purple text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-tl-lg">
                                {item.quantity}
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                        </div>
                        <div className="text-sm font-bold text-brand-purple">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-[#efe3ff] pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Entrega</span>
                    <span>{shipping === 0 ? 'Grátis' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#8D61C6] mt-2 pt-2 border-t border-dashed border-[#efe3ff]">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                </div>
            </div>
        </div>
    );
}
