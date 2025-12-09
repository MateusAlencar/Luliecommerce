"use client";

import React from "react";
import Link from "next/link";
import { AddressForm } from "@/components/checkout/AddressForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CheckoutActions } from "@/components/checkout/CheckoutActions";
import { FidelityBanner } from "@/components/checkout/FidelityBanner";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";

export default function CheckoutClient() {
    const { cart } = useCart();
    const { user } = useUser();
    const [currentAddress, setCurrentAddress] = React.useState(user.address || {
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: ""
    });
    const [saveAsDefault, setSaveAsDefault] = React.useState(false);

    // Update address if user logs in or user address loads
    React.useEffect(() => {
        if (user.address) {
            setCurrentAddress(user.address);
        }
    }, [user.address]);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#fffcf4] pt-32 pb-16 px-4 md:px-8 font-body flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-poppins font-semibold text-[#8D61C6] mb-4">Seu carrinho está vazio</h1>
                <p className="text-gray-600 mb-8">Adicione alguns cookies deliciosos antes de finalizar a compra.</p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-brand-purple text-white rounded-full font-bold hover:bg-brand-purple-dark transition-colors"
                >
                    Voltar para a loja
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fffcf4] pt-32 pb-16 px-4 md:px-8 font-body">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-body font-bold text-[#8D61C6] mb-8 text-left">Finalizar Compra</h1>

                {/* Fidelity Banner - Only for non-logged in users */}
                {!user.id && (
                    <div className="mb-6">
                        <FidelityBanner />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <AddressForm
                            currentAddress={currentAddress}
                            onAddressChange={setCurrentAddress}
                            saveAsDefault={saveAsDefault}
                            onSaveAsDefaultChange={setSaveAsDefault}
                        />
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <OrderSummary />
                        </div>
                    </div>
                </div>

                {/* Checkout Actions at Bottom */}
                <div className="mt-6">
                    <CheckoutActions
                        address={currentAddress}
                        saveAsDefault={saveAsDefault}
                    />
                </div>
            </div>
        </div>
    );
}
