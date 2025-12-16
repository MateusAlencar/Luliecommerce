'use client';

import { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Initialize Mercado Pago
initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!);

interface CheckoutButtonProps {
    items: {
        title: string;
        quantity: number;
        price: number;
    }[];
}

export function CheckoutButton({ items }: CheckoutButtonProps) {
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        console.log("Starting checkout process...", items);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items }),
            });

            const data = await response.json();

            if (data.preferenceId) {
                setPreferenceId(data.preferenceId);
            } else {
                console.error("No preferenceId returned:", data);
                alert("Erro ao iniciar pagamento. Verifique o console.");
            }
        } catch (error) {
            console.error('Error creating preference:', error);
            alert("Erro de conexão ao iniciar pagamento.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {preferenceId ? (
                <Wallet initialization={{ preferenceId }} />
            ) : (
                <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="bg-[#009EE3] hover:bg-[#007EB5] text-white font-bold py-3 px-4 rounded-full disabled:opacity-50 transition-colors w-full flex items-center justify-center gap-2 shadow-sm"
                >
                    {isLoading ? 'Carregando...' : 'Pagar com Mercado Pago'}
                </button>
            )}
        </div>
    );
}
