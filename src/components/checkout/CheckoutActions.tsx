"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase";
import { UserAddress } from "@/types/database";

interface CheckoutActionsProps {
    address: UserAddress;
    saveAsDefault: boolean;
}

export function CheckoutActions({ address, saveAsDefault }: CheckoutActionsProps) {
    const { cart, shippingCost, clearCart } = useCart();
    const { user } = useAuth();
    const { updateAddress } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const finalTotal = cartTotal + shippingCost;

    const handlePlaceOrder = async () => {
        // Validate Address
        if (!address.street || !address.number || !address.neighborhood || !address.cep) {
            alert("Por favor, preencha o endereço de entrega completo.");
            return;
        }

        setLoading(true);

        try {
            let dbUserId: string | null = null;
            let customerName = "Cliente";

            if (user?.email) {
                dbUserId = user.id; // UUID directly from AuthContext

                // Try to get name from customer_users, fallback to email
                const { data: userData } = await supabase
                    .from("customer_users")
                    .select("name")
                    .eq("id", user.id)
                    .single();

                if (userData) {
                    customerName = userData.name;
                } else {
                    customerName = user.email;
                }
            }

            // Sync address to user profile if logged in AND opted in
            if (user?.email && saveAsDefault) {
                await updateAddress(address);
            }

            // 1. Create Order
            const { data: orderData, error: orderError } = await supabase
                .from("orders")
                .insert({
                    customer_name: customerName,
                    total: finalTotal,
                    user_id: dbUserId, // Now passing UUID
                    status: "Pendente",
                    address: address as any
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Order Items
            const orderItems = cart.map(item => ({
                order_id: orderData.id,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Update Fidelity Points
            if (dbUserId) {
                // Check current points
                const { data: fidelityData } = await supabase
                    .from("fidelity")
                    .select("*")
                    .eq("user_id", dbUserId)
                    .single();

                if (fidelityData) {
                    await supabase
                        .from("fidelity")
                        .update({
                            points: fidelityData.points + 1,
                            updated_at: new Date().toISOString()
                        })
                        .eq("id", fidelityData.id);
                } else {
                    await supabase
                        .from("fidelity")
                        .insert({
                            user_id: dbUserId,
                            points: 1,
                            free_cookie_earned: false
                        });
                }
            }

            // 4. Success
            clearCart();
            router.push("/pedidos"); // Redirect to orders page

        } catch (error: any) {
            console.error("Error placing order:", error);
            alert(`Erro ao realizar o pedido: ${error?.message || "Erro desconhecido"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <p className="text-sm text-gray-500 text-center mb-4">
                As opções de pagamento serão decididas nas próximas etapas.
            </p>

            <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full py-4 bg-[#8D61C6] text-white font-bold text-xl rounded-full shadow-lg hover:bg-[#8D61C6] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? "Processando..." : "Confirmar Pedido"}
            </button>

            <div className="mt-4 text-center">
                <Link href="/cart" className="text-sm text-gray-500 hover:text-brand-purple underline">
                    Voltar para o carrinho
                </Link>
            </div>
        </div>
    );
}
