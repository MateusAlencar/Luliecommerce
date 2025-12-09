"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductWithCategory } from "@/types/database";
import { useCart } from "@/context/CartContext";

interface ProductClientProps {
    product: ProductWithCategory;
}

export default function ProductClient({ product }: ProductClientProps) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        alert(`Adicionado ${quantity}x ${product.name} ao carrinho!`);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-[#FFFCF4] font-['Poppins',sans-serif] flex flex-col items-center justify-start pt-32 p-4">
            <div className="w-full max-w-md overflow-hidden relative pb-8">

                {/* Product Image */}
                <div className="px-4 mb-6 mt-8 w-full">
                    <div className="relative w-full aspect-square rounded-[10px] bg-white shadow-[0px_12px_26px_0px_rgba(0,0,0,0.05)] flex items-center justify-center border border-[#EFE3FF]">
                        <div className="relative w-[90%] h-[90%] rounded-[10px] overflow-hidden">
                            <Image
                                src={product.image_front_url || product.image_top_url || '/images/cookie-placeholder.png'}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="px-4 text-left">
                    <div className="flex items-center justify-start gap-4 mb-2">
                        <h1 className="text-3xl font-bold text-[#2B1B0C]">
                            {product.name}
                        </h1>
                        <span className="text-xl font-bold text-[#8D61C6]">
                            {formatPrice(product.price)}
                        </span>
                    </div>

                    <p className="text-[#2B1B0C]/60 text-sm mb-6 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="flex justify-start mb-8">
                        <div className="flex items-center gap-4 bg-[#EFE3FF] rounded-full px-4 py-2">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-6 h-6 flex items-center justify-center text-[#2B1B0C] hover:text-brand-purple font-bold"
                            >
                                -
                            </button>
                            <span className="text-lg font-bold text-[#2B1B0C] w-4 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center text-[#2B1B0C] hover:text-brand-purple font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>




                    <div className="h-24"></div> {/* Spacer for fixed button */}

                    <div className="fixed bottom-6 left-0 w-full px-4 z-50">
                        <button
                            onClick={handleAddToCart}
                            className="w-full py-4 bg-[#8D61C6] text-white rounded-[47px] flex items-center justify-center gap-2 hover:bg-brand-purple transition-colors shadow-[0px_12px_26px_0px_rgba(0,0,0,0.05)]"
                        >
                            <span className="font-medium text-lg">Adicionar ao carrinho</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
