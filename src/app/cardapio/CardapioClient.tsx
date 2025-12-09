"use client";

import { useMemo } from "react";
import { ProductWithCategory, Category } from "@/types/database";
import { MenuProductCard } from "@/components/features/MenuProductCard";
import { Search } from "lucide-react";

interface CardapioClientProps {
    products: ProductWithCategory[];
    categories: Category[];
}

export default function CardapioClient({ products, categories }: CardapioClientProps) {
    // Group products by category
    const productsByCategory = useMemo(() => {
        const grouped: Record<number, ProductWithCategory[]> = {};

        products.forEach(product => {
            if (product.category_id) {
                if (!grouped[product.category_id]) {
                    grouped[product.category_id] = [];
                }
                grouped[product.category_id].push(product);
            }
        });

        return grouped;
    }, [products]);

    return (
        <div className="min-h-screen bg-[#fffcf4] pb-24 pt-[152px] md:pt-[184px]">
            {/* Content */}
            <div className="max-w-md mx-auto px-4 flex flex-col gap-8">
                {categories.map((category) => {
                    const categoryProducts = productsByCategory[category.id] || [];

                    if (categoryProducts.length === 0) return null;

                    return (
                        <div key={category.id} className="flex flex-col gap-4">
                            {/* Category Title */}
                            <div className="flex items-center justify-start px-1">
                                <h2 className={`font-body font-semibold text-left ${category.name === 'Cookies clássicos' || category.name === 'Cookies Clássicos'
                                        ? 'text-2xl text-[#8D61C6]'
                                        : 'text-xl text-[#4e4d4d]'
                                    }`}>
                                    {category.name === 'Cookies clássicos' || category.name === 'Cookies Clássicos' ? 'Cardápio' : category.name}
                                </h2>
                            </div>

                            {/* Products List */}
                            <div className="flex flex-col gap-3">
                                {categoryProducts.map((product) => (
                                    <MenuProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-[#9e9e9e] font-body">Nenhum produto disponível no momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
