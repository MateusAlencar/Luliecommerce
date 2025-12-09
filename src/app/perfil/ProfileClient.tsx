"use client";

import React, { useEffect } from "react";
import { SavedAddress } from "@/components/profile/SavedAddress";
import { FidelityProgress } from "@/components/profile/FidelityProgress";
import { PastOrders } from "@/components/profile/PastOrders";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfileClient() {
    const { user: profileUser } = useUser();
    const { user: authUser, loading, signOut } = useAuth();
    const router = useRouter();

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (!loading && !authUser) {
            router.push("/signin");
        }
    }, [authUser, loading, router]);

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-[#fffcf4] pt-32 pb-16 px-4 md:px-8 font-body flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
                    <p className="mt-4 text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!authUser) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#fffcf4] pt-32 pb-16 px-4 md:px-8 font-body">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-body font-semibold text-brand-purple mb-2">Meu Perfil</h1>
                        <p className="text-gray-600">Olá, {profileUser.name}! Gerencie suas informações e acompanhe seus pedidos.</p>
                    </div>

                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - 2/3 width */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Saved Address */}
                        <SavedAddress />

                        {/* Past Orders */}
                        <PastOrders />
                    </div>

                    {/* Right Column - 1/3 width */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <FidelityProgress />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={async () => {
                            await signOut();
                            await router.push('/')
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#ff6b6b] hover:bg-[#fff5f5] transition-colors font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                        </svg>
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
}
