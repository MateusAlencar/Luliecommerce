"use client";

import { Category } from "@/types/database";

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: number | null;
    onSelectCategory: (categoryId: number | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
    return (
        <div className="w-full overflow-x-auto scrollbar-hide mb-8">
            <div className="flex gap-3 min-w-min px-4 md:px-0 md:justify-center">
                {/* All Products Button */}
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all transform hover:scale-105 ${selectedCategory === null
                            ? 'bg-brand-purple text-white shadow-lg'
                            : 'bg-white text-foreground border-2 border-brand-purple/20 hover:border-brand-purple/40'
                        }`}
                >
                    Todos
                </button>

                {/* Category Buttons */}
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all transform hover:scale-105 ${selectedCategory === category.id
                                ? 'bg-brand-purple text-white shadow-lg'
                                : 'bg-white text-foreground border-2 border-brand-purple/20 hover:border-brand-purple/40'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
