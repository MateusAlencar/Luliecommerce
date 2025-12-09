'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderSkeleton } from '@/components/orders/OrderSkeleton';
import Link from 'next/link';

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

export default function OrdersClient() {
    const { user } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    // Track if we have checked valid user state at least once to avoid flash of "login" screen
    const [isAuthChecking, setIsAuthChecking] = useState(true);

    useEffect(() => {
        // Simple timeout to ensure we don't show skeleton forever if something gets stuck
        // But primarily, we wait for user.id to be populated or confirmed empty.
        // Since UserContext doesn't tell us "I'm done loading", we'll infer it.
        const timer = setTimeout(() => {
            setIsAuthChecking(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        async function fetchOrders() {
            if (!user.id) {
                // If we don't have a user ID yet, we might still be initializing.
                // However, if we've been waiting a bit or if we know we are 'logged out' (hard to tell from this context without an 'isLoading' flag),
                // we assume no user. For now, let's just wait for user.id.
                // If user.id is effectively null/empty, we stop loading after the safety timeout above or immediate check if we trusted the context initial state (which effectively defaults to empty).

                // Note: The UserContext initializes with a DEFAULT_USER (empty/guest).
                // It then asynchronously checks localStorage and Supabase.
                // If after a short delay it's still default, we assume not logged in.
                return;
            }

            try {
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
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching orders:', error);
                } else {
                    setOrders(data as any || []);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
                setIsAuthChecking(false);
            }
        }

        fetchOrders();
    }, [user.id]);

    // If we are definitely not logged in (and not just initializing), show login prompt
    const isGuest = !user.id && !isAuthChecking;

    const currentOrders = orders.filter(
        (order) => order.status === 'Em andamento' || order.status === 'Preparando' || order.status === 'Pendente' || !order.status
    );
    const pastOrders = orders.filter(
        (order) => order.status === 'Entregue' || order.status === 'Cancelado'
    );

    return (
        <div className="min-h-screen bg-[#fffcf4] pt-32 pb-16 px-4 md:px-8 font-body">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-poppins font-bold text-[#8D61C6] mb-8">Meus Pedidos</h1>

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
                ) : orders.length === 0 ? (
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
                                <h2 className="text-xl font-poppins font-semibold text-gray-800 mb-4">Anteriores</h2>
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
