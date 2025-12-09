"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductWithCategory } from "@/types/database";
import { Plus } from "lucide-react";

interface MenuProductCardProps {
    product: ProductWithCategory;
}

export function MenuProductCard({ product }: MenuProductCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    return (
        <div className="bg-white border border-[#efe3ff] rounded-[20px] p-3 md:p-4 flex gap-4 md:gap-6 items-center shadow-[0px_12px_26px_0px_rgba(0,0,0,0.05)] w-full">
            {/* Image Container */}
            <div className="relative w-[100px] h-[100px] shrink-0">
                <div className="w-full h-full border border-[#efe3ff] rounded-[8px] shadow-[0px_6px_7px_0px_rgba(0,0,0,0.1)] overflow-hidden bg-white flex items-center justify-center">
                    <Image
                        src={product.image_front_url || product.image_top_url || '/images/cookie-placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-cover rounded-[8px]"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center py-1">
                <div className="flex flex-col gap-1">
                    <div className="flex justify-start items-center gap-2">
                        {/* Title */}
                        <h3 className="font-body font-semibold text-lg text-[#4e4d4d] leading-snug">
                            {product.name}
                        </h3>

                        {/* Price */}
                        <span className="font-body font-medium text-base text-[#8D61C6] whitespace-nowrap">
                            {formatPrice(product.price)}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="font-body text-xs text-[#9e9e9e] line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>

                    {/* View Product Button */}
                    <div className="flex justify-start mt-2">
                        <Link
                            href={`/produto/${product.id}`}
                            className="bg-[#8D61C6] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm hover:bg-brand-purple transition-colors"
                        >
                            Ver produto
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
