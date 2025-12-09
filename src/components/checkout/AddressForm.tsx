"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";

import { useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const STORE_ORIGIN = { lat: -8.033464, lng: -34.909015 }; // Recife, PE
const DELIVERY_RATE_PER_KM = 2.0;
// Define libraries array outside component to prevent re-renders
const LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

import { UserAddress } from "@/types/database";

// ... other imports

interface AddressFormProps {
    currentAddress: UserAddress;
    onAddressChange: (address: UserAddress) => void;
    saveAsDefault?: boolean;
    onSaveAsDefaultChange?: (value: boolean) => void;
}

export function AddressForm({ currentAddress, onAddressChange, saveAsDefault, onSaveAsDefaultChange }: AddressFormProps) {
    const { user } = useUser();
    const { setShippingCost } = useCart();
    const [isOpen, setIsOpen] = useState(true);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES
    });

    // Initialize isEditing based on whether we have a valid address in props
    const [isEditing, setIsEditing] = useState(!currentAddress.cep);

    // We use the props as the source of truth for the form data
    const formData = currentAddress;

    const setFormData = (newData: UserAddress | ((prev: UserAddress) => UserAddress)) => {
        if (typeof newData === 'function') {
            onAddressChange(newData(formData));
        } else {
            onAddressChange(newData);
        }
    };

    const calculateShipping = (destination: google.maps.LatLng | google.maps.LatLngLiteral) => {
        if (!window.google) return;

        const origin = new window.google.maps.LatLng(STORE_ORIGIN.lat, STORE_ORIGIN.lng);
        const distanceInMeters = window.google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
        const distanceInKm = distanceInMeters / 1000;
        const cost = Math.max(5, Math.ceil(distanceInKm * DELIVERY_RATE_PER_KM)); // Min R$ 5,00
        setShippingCost(cost);
    };

    const geocodeAddress = (address: string) => {
        if (!window.google || !window.google.maps) return;
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === "OK" && results && results[0]) {
                const location = results[0].geometry.location;
                calculateShipping(location);
            } else {
                console.error("Geocode was not successful for the following reason: " + status);
            }
        });
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        const formattedCep = value.replace(/^(\d{5})(\d{3})/, "$1-$2");

        setFormData(prev => ({
            ...prev,
            cep: formattedCep
        }));

        if (value.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        // complement: data.complemento, // Optional: decides if we want to overwrite
                    }));

                    // Trigger shipping calculation
                    const fullAddress = `${data.logradouro}, ${data.bairro}, Recife - PE`; // Assuming mostly local context or we could add city from data
                    geocodeAddress(fullAddress);
                }
            } catch (error) {
                console.error("Error fetching CEP:", error);
            }
        }
    };




    // Simplified useEffect - we rely on props now
    // If the parent updates the address (e.g. from user login), it will reflect here.

    // Effect to trigger shipping calculation when address is loaded (e.g. from user profile)
    useEffect(() => {
        if (isLoaded && currentAddress.cep && currentAddress.street && currentAddress.neighborhood) {
            // Construct the address similar to handleCepChange to ensure consistency
            const fullAddress = `${currentAddress.street}, ${currentAddress.neighborhood}, Recife - PE`;
            geocodeAddress(fullAddress);
        }
        // We only want to run this when the dependencies actually change to a valid state
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, currentAddress.cep, currentAddress.street, currentAddress.neighborhood]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    if (!isLoaded) return <div className="animate-pulse bg-gray-200 h-96 rounded-2xl"></div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="text-xl font-body font-semibold text-gray-600">Endereço de Entrega</h2>
                <div className="flex items-center gap-3">
                    {!isEditing && user.address && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                                if (!isOpen) setIsOpen(true);
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
            </div >

            <div className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>

                {isEditing ? (
                    <div className="p-4 md:p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">



                        <div className="md:col-span-2">
                            <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                            <input
                                type="text"
                                id="cep"
                                value={formData.cep}
                                onChange={handleCepChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
                                placeholder="Seu bairro"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                            />
                        </div>

                        {/* Save as default checkbox - Only for logged in users */}
                        {user.id && onSaveAsDefaultChange && (
                            <div className="md:col-span-2 flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="saveAsDefault"
                                    checked={saveAsDefault}
                                    onChange={(e) => onSaveAsDefaultChange(e.target.checked)}
                                    className="w-5 h-5 text-brand-purple border-gray-300 rounded focus:ring-brand-purple"
                                />
                                <label htmlFor="saveAsDefault" className="text-sm text-gray-700 cursor-pointer select-none">
                                    Salvar este endereço como padrão para próximas compras
                                </label>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-4 md:p-6 pt-0 text-gray-700 space-y-2">
                        <p className="font-medium text-lg">{formData.street}, {formData.number}</p>
                        {formData.complement && <p className="text-gray-500">{formData.complement}</p>}
                        <p className="text-gray-500">{formData.neighborhood}</p>
                        <p className="text-gray-500">{formData.cep}</p>
                        <div className="pt-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-brand-purple font-semibold hover:underline"
                            >
                                Editar Endereço
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
