"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { UserAddress } from "@/types/database";

import { useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

export function SavedAddress() {
    const { user, updateAddress } = useUser();
    const [isOpen, setIsOpen] = useState(true);
    const [isEditing, setIsEditing] = useState(!user.address);
    const [formData, setFormData] = useState<UserAddress>(
        user.address || {
            cep: "",
            street: "",
            number: "",
            complement: "",
            neighborhood: "",
        }
    );

    const [loading, setLoading] = useState(false);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES
    });

    const handleSave = async () => {
        try {
            setLoading(true);
            await updateAddress(formData);
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving address:", error);
            alert("Erro ao salvar endereço. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof UserAddress, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCepChange = async (value: string) => {
        const numericValue = value.replace(/\D/g, "");
        const formattedCep = numericValue.replace(/^(\d{5})(\d{3})/, "$1-$2");

        handleChange("cep", formattedCep);

        if (numericValue.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${numericValue}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        // complement: data.complemento, 
                    }));
                }
            } catch (error) {
                console.error("Error fetching CEP:", error);
            }
        }
    };

    if (!isLoaded) return <div className="animate-pulse bg-gray-200 h-24 rounded-2xl"></div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#efe3ff] overflow-hidden">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        setIsOpen(!isOpen);
                    }
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-body font-semibold text-gray-600">Endereço Salvo</h2>
                </div>
                <div className="flex items-center gap-3">
                    {user.address && !isEditing && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                            className="text-brand-purple hover:text-brand-purple/80 font-medium text-sm transition-colors"
                        >
                            Editar
                        </button>
                    )}
                    <div className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="p-4 md:p-6 pt-0">
                    {!user.address && !isEditing ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">Você ainda não salvou um endereço.</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-3 bg-brand-purple text-white rounded-full font-bold hover:bg-brand-purple/90 transition-colors"
                            >
                                Adicionar Endereço
                            </button>
                        </div>
                    ) : isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="md:col-span-2">
                                <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                                <input
                                    type="text"
                                    id="cep"
                                    value={formData.cep}
                                    onChange={(e) => handleCepChange(e.target.value)}
                                    maxLength={9}
                                    placeholder="00000-000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Rua / Avenida</label>
                                <input
                                    type="text"
                                    id="street"
                                    value={formData.street}
                                    onChange={(e) => handleChange("street", e.target.value)}
                                    placeholder="Nome da rua"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                <input
                                    type="text"
                                    id="number"
                                    value={formData.number}
                                    onChange={(e) => handleChange("number", e.target.value)}
                                    placeholder="123"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-1">Complemento (opcional)</label>
                                <input
                                    type="text"
                                    id="complement"
                                    value={formData.complement}
                                    onChange={(e) => handleChange("complement", e.target.value)}
                                    placeholder="Apto, Bloco, etc."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                                <input
                                    type="text"
                                    id="neighborhood"
                                    value={formData.neighborhood}
                                    onChange={(e) => handleChange("neighborhood", e.target.value)}
                                    placeholder="Seu bairro"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                                />
                            </div>

                            <div className="md:col-span-2 flex gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-brand-purple text-white rounded-full font-bold hover:bg-brand-purple/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Salvando..." : "Salvar Endereço"}
                                </button>
                                {user.address && (
                                    <button
                                        onClick={() => {
                                            setFormData(user.address!);
                                            setIsEditing(false);
                                        }}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-700 space-y-2">
                            <p className="font-medium">{user.address!.street}, {user.address!.number}</p>
                            {user.address!.complement && <p className="text-gray-500">{user.address!.complement}</p>}
                            <p className="text-gray-500">{user.address!.neighborhood}</p>
                            <p className="text-gray-500">{user.address!.cep}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
