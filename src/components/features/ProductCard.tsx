"use client";

import Image from "next/image";
import { ProductWithCategory } from "@/types/database";

interface ProductCardProps {
    product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            {/* Image Container */}
            <div className="relative w-full aspect-square bg-gradient-to-br from-brand-purple/5 to-brand-purple/10 overflow-hidden">
                <Image
                    src={product.image_front_url || product.image_top_url || '/images/cookie-placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-contain p-6 group-hover:scale-110 transition-transform duration-300"
                />
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Category Badge */}
                {product.category && (
                    <span className="inline-block px-3 py-1 bg-brand-purple/10 text-brand-purple text-xs font-semibold rounded-full mb-3">
                        {product.category.name}
                    </span>
                )}

                {/* Product Name */}
                <h3 className="font-brand text-2xl md:text-3xl text-foreground mb-2 uppercase">
                    {product.name}
                </h3>

                {/* Description */}
                <p className="text-foreground/70 text-sm md:text-base mb-4 line-clamp-2 min-h-[2.5rem]">
                    {product.description || "Delicioso cookie artesanal"}
                </p>

                {/* Price and Button */}
                <div className="flex items-center justify-between gap-4">
                    <span className="font-brand text-3xl text-brand-purple">
                        {formatPrice(product.price)}
                    </span>
                    <button className="px-6 py-3 bg-brand-purple text-white font-bold rounded-full hover:bg-brand-purple transition-all transform hover:scale-105 shadow-md whitespace-nowrap text-sm md:text-base">
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
}
