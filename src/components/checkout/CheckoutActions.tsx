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
    guestName?: string;
}

export function CheckoutActions({ address, saveAsDefault, guestName }: CheckoutActionsProps) {
    const { cart, shippingCost, clearCart } = useCart();
    const { user } = useAuth();
    const { updateAddress, refreshProfile } = useUser();
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

        // Validate Guest Name
        if (!user && !guestName?.trim()) {
            alert("Por favor, informe seu nome para identificação do pedido.");
            return;
        }

        setLoading(true);

        try {
            console.log("Starting order placement...");
            let dbUserId: string | null = null;
            let customerName = guestName || "Cliente";
            let fidelityData = null;
            let hasFreeCookie = false;

            if (user?.email) {
                console.log("User is logged in", user.id);
                dbUserId = user.id;

                // 0. Pre-fetch fidelity status to check for free cookie
                try {
                    const { data: fData } = await supabase
                        .from("fidelity")
                        .select("*")
                        .eq("user_id", user.id)
                        .single();
                    fidelityData = fData;
                    if (fidelityData?.free_cookie_earned) {
                        hasFreeCookie = true;
                    }
                } catch (e) {
                    console.warn("Error checking fidelity status:", e);
                }

                // Try to get name from customer_users, fallback to email
                console.log("Fetching customer_users data...");
                const { data: userData, error: userError } = await supabase
                    .from("customer_users")
                    .select("name")
                    .eq("id", user.id)
                    .single();

                if (userError) console.warn("Error fetching user data (safe to ignore if new):", userError);

                if (userData) {
                    customerName = userData.name || "Cliente";
                } else {
                    customerName = user.email;
                }
                console.log("Customer name resolved:", customerName);

                // ENSURE FLAGGED FIX: Check/Create user in customer_users table to satisfy FK constraint orders_user_id_fkey
                // This is critical because orders.user_id references customer_users(id), not just auth.users
                // ENSURE FLAGGED FIX: Check/Create user in customer_users table to satisfy FK constraint orders_user_id_fkey
                console.log("Ensuring user exists in customer_users...");

                // 1. Check if user exists
                const { data: existingUser, error: fetchError } = await supabase
                    .from("customer_users")
                    .select("id")
                    .eq("id", user.id)
                    .maybeSingle(); // Use maybeSingle to not throw on null

                if (fetchError) {
                    console.error("Error checking customer_users:", fetchError);
                    // Don't throw here, try to insert anyway as fallback
                }

                if (!existingUser) {
                    console.log("User record missing in customer_users. Attempting INSERT...");
                    const { error: insertError } = await supabase
                        .from("customer_users")
                        .insert({
                            id: user.id,
                            email: user.email,
                            name: customerName,
                        });

                    if (insertError) {
                        console.error("CRITICAL: Failed to create customer_users record:", JSON.stringify(insertError, null, 2));
                        // If this fails, the order FK will definitely fail. Throw here to see this specific error.
                        throw new Error(`Falha ao criar perfil do usuário: ${insertError.message}`);
                    }
                    console.log("User record created successfully.");
                } else {
                    console.log("User record already exists.");
                }
            }

            // Append cookie info to name if applicable
            if (hasFreeCookie) {
                customerName += " (COOKIE GRÁTIS)";
            }

            // Sync address to user profile if logged in AND opted in
            if (user?.email && saveAsDefault) {
                console.log("Saving address to profile...");
                // Add specific timeout for address update to prevent hanging
                const addressUpdatePromise = updateAddress(address);
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Address update timeout")), 5000));

                try {
                    await Promise.race([addressUpdatePromise, timeoutPromise]);
                    console.log("Address saved.");
                } catch (e) {
                    console.error("Address save failed or timed out (continuing order):", e);
                    // Do not block order placement for this
                }
            }

            // 1. Create Order
            console.log("Creating order object...");
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

            if (orderError) {
                console.error("Order creation failed:", JSON.stringify(orderError, null, 2));
                throw orderError;
            }
            console.log("Order created:", orderData.id);

            // 2. Create Order Items
            console.log("Creating order items...");
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
            console.log("Order items created.");

            // 3. Update Fidelity Points
            if (dbUserId) {
                console.log("Updating fidelity points...");
                try {
                    // We already fetched fidelityData above, but let's re-use it or re-fetch if needed.
                    // Actually we have fidelityData state from step 0.

                    if (fidelityData) {
                        if (hasFreeCookie) {
                            // CONSUME COOKIE logic
                            // Reset points to 1 (for this purchase), consume cookie flag
                            await supabase
                                .from("fidelity")
                                .update({
                                    points: 1,
                                    free_cookie_earned: false,
                                    updated_at: new Date().toISOString()
                                })
                                .eq("id", fidelityData.id);
                        } else {
                            // EARN POINTS logic
                            const newPoints = fidelityData.points + 1;
                            if (newPoints >= 5) {
                                // Hit target!
                                await supabase
                                    .from("fidelity")
                                    .update({
                                        points: 0, // Reset logic
                                        free_cookie_earned: true,
                                        updated_at: new Date().toISOString()
                                    })
                                    .eq("id", fidelityData.id);
                            } else {
                                // Just increment
                                await supabase
                                    .from("fidelity")
                                    .update({
                                        points: newPoints,
                                        updated_at: new Date().toISOString()
                                    })
                                    .eq("id", fidelityData.id);
                            }
                        }
                    } else {
                        // First time creation
                        await supabase
                            .from("fidelity")
                            .upsert({
                                user_id: dbUserId,
                                points: 1,
                                free_cookie_earned: false,
                                updated_at: new Date().toISOString()
                            }, { onConflict: 'user_id' });
                    }
                    console.log("Fidelity updated.");

                    if (refreshProfile) await refreshProfile();

                } catch (fidelityErr) {
                    console.error("Error updating fidelity (non-blocking):", fidelityErr);
                }
            }

            // 4. Success
            console.log("Order placement successful! Clearing cart and redirecting...");
            clearCart();
            router.push("/pedidos"); // Redirect to orders page

        } catch (error: any) {
            console.error("Error placing order (raw):", error);
            console.error("Error placing order (JSON):", JSON.stringify(error, null, 2));
            alert(`Erro ao realizar o pedido: ${error?.message || JSON.stringify(error) || "Erro desconhecido"}`);
        } finally {
            console.log("Finished order placement flow.");
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <p className="text-sm text-gray-500 text-center mb-4">
                O pagamento será combinado no momento da entrega via PIX ou Cartão.
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
