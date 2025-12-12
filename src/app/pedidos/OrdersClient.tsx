'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderSkeleton } from '@/components/orders/OrderSkeleton';
import Link from 'next/link';
import useSWR from 'swr';
// Removed incorrect import: import { Order } from '@/types/database';

interface OrderItem {
    id: number;
    product: {
        name: string;
        image_front_url: string | null;
    } | null;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    created_at: string;
    status: string | null;
    total: number;
    order_items: OrderItem[];
}

// Fetcher function for SWR
const fetchOrders = async (userId: string) => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            id,
            created_at,
            status,
            total,
            order_items (
                id,
                quantity,
                price,
                product:products (
                    name,
                    image_front_url
                )
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) throw error;
    // Cast the data to match our Order interface structure since Supabase types might be strict/different
    return data as any as Order[];
};

export default function OrdersClient() {
    const { user, isLoading: isUserLoading } = useUser();

    const { data: orders, isLoading: isOrdersLoading, error } = useSWR(
        isUserLoading ? null : (user.id ? ['orders', user.id] : null),
        ([_, id]) => fetchOrders(id),
        {
            revalidateOnFocus: true,
            dedupingInterval: 60000,
        }
    );

    // If we are done loading user, and there is no user ID, then we are guest
    const isGuest = !isUserLoading && !user.id;

    // Loading if user context is loading OR if SWR is fetching (initial fetch)
    const loading = isUserLoading || (!!user.id && isOrdersLoading);

    // Show error state if fetch failed
    if (error) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-16 px-4 md:px-8 font-body">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-red-500">Erro ao carregar pedidos: {error.message}</p>
                </div>
            </div>
        );
    }

    // Safe access to orders array
    const ordersList = orders || [];

    const currentOrders = ordersList.filter(
        (order) =>
            !order.status ||
            ['Pendente', 'Preparando', 'Em entrega', 'Em Entrega', 'Em andamento', 'Em Andamento'].includes(order.status)
    );
    const pastOrders = ordersList.filter(
        (order) =>
            ['Entregue', 'Concluido', 'Cancelado'].includes(order.status as string)
    );

    return (
        <div className="min-h-screen bg-background pt-24 pb-16 px-4 md:px-8 font-body">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-poppins font-bold text-[#8D61C6] mb-6">Meus Pedidos</h1>

                {isGuest ? (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                        <h2 className="text-2xl font-poppins font-semibold text-[#8D61C6] mb-4">Entre para ver seus pedidos</h2>
                        <p className="text-gray-600 mb-8">Faça login para acompanhar o status dos seus pedidos.</p>
                        <Link
                            href="/signin?redirect=/pedidos"
                            className="px-8 py-3 bg-brand-purple text-white rounded-full font-bold hover:bg-brand-purple-dark transition-colors"
                        >
                            Fazer Login
                        </Link>
                    </div>
                ) : loading ? (
                    <div className="space-y-8">
                        {/* Section Title Skeleton */}
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                        <div className="grid gap-4">
                            <OrderSkeleton />
                            <OrderSkeleton />
                        </div>
                    </div>
                ) : ordersList.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Nenhum pedido encontrado</h2>
                        <p className="text-gray-500 mb-6">Você ainda não fez nenhum pedido conosco.</p>
                        <Link
                            href="/"
                            className="px-6 py-2 bg-brand-purple text-white rounded-full font-bold hover:bg-brand-purple-dark transition-colors inline-block"
                        >
                            Ver Cardápio
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {currentOrders.length > 0 && (
                            <section>
                                <h2 className="text-xl font-poppins font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Em Andamento
                                </h2>
                                <div className="grid gap-4">
                                    {currentOrders.map((order) => (
                                        <OrderCard
                                            key={order.id}
                                            id={order.id}
                                            date={order.created_at}
                                            status={order.status}
                                            total={order.total}
                                            items={order.order_items}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {pastOrders.length > 0 && (
                            <section>
                                <h2 className="text-xl font-poppins font-semibold text-gray-800 mb-4">Concluídos</h2>
                                <div className="grid gap-4">
                                    {pastOrders.map((order) => (
                                        <OrderCard
                                            key={order.id}
                                            id={order.id}
                                            date={order.created_at}
                                            status={order.status}
                                            total={order.total}
                                            items={order.order_items}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
