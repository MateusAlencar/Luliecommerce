"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

export function PastOrders() {
    const { user } = useUser();
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const toggleOrder = (orderId: string) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Entregue":
                return "bg-green-100 text-green-700";
            case "Em andamento":
                return "bg-yellow-100 text-yellow-700";
            case "Cancelado":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    if (user.orders.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-[#efe3ff] p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-body font-semibold text-gray-600">Pedidos Anteriores</h2>
                </div>
                <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-50">📦</div>
                    <p className="text-gray-500">Você ainda não fez nenhum pedido.</p>
                    <p className="text-gray-400 text-sm mt-2">Seus pedidos aparecerão aqui!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#efe3ff] overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-[#efe3ff]">
                <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-body font-semibold text-gray-600">Pedidos Anteriores</h2>
            </div>

            <div className="p-4 space-y-3">
                {user.orders.slice(0, 5).map((order) => (
                    <div
                        key={order.id}
                        className="border border-gray-200 rounded-xl overflow-hidden hover:border-brand-purple/30 transition-colors"
                    >
                        <button
                            onClick={() => toggleOrder(order.id)}
                            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4 flex-1 text-left">
                                <div className="text-2xl">📦</div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">Pedido #{order.id.slice(0, 8)}</p>
                                    <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <p className="text-brand-purple font-bold mt-1">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                                    </p>
                                </div>
                            </div>
                            <div className={`ml-4 transition-transform duration-200 ${expandedOrderId === order.id ? 'rotate-180' : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        </button>

                        {expandedOrderId === order.id && (
                            <div className="border-t border-gray-200 p-4 bg-gray-50">
                                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Itens do Pedido</h3>
                                <div className="space-y-2">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                <Image
                                                    src={item.image_front_url || "/placeholder.png"}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-500">Quantidade: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-bold text-brand-purple">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Endereço de Entrega:</span></p>
                                    <p className="text-sm text-gray-700">
                                        {order.address.street}, {order.address.number}
                                        {order.address.complement && ` - ${order.address.complement}`}
                                        <br />
                                        {order.address.neighborhood} - {order.address.cep}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
