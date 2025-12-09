"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { ProductWithCategory } from "@/types/database";
import { useCart } from "@/context/CartContext";

interface HomeClientProps {
    products: ProductWithCategory[];
}

export default function HomeClient({ products }: HomeClientProps) {
    const { addToCart } = useCart();
    const [activeIndex, setActiveIndex] = useState(0);

    // Calculate the valid index for the products array (handles negative numbers)
    const normalizedIndex = ((activeIndex % products.length) + products.length) % products.length;
    const currentProduct = products[normalizedIndex];

    const nextSlide = () => {
        setActiveIndex((prev) => prev + 1);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => prev - 1);
    };
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null); // Reset touch end
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            prevSlide();
        }
    };

    return (
        <div
            className="min-h-screen bg-background relative overflow-hidden flex flex-col font-body"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Background Curve */}
            <div className="fixed bottom-0 left-0 w-[100vw] h-[70vh] bg-brand-purple rounded-t-[50%] scale-x-150 translate-y-20 z-0"></div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-full w-full max-w-7xl mx-auto pt-4 px-4 md:px-8">

                {/* Header Placeholder (handled by layout, but space needed) */}
                <div className="h-20"></div>

                {/* Main Content Grid */}
                <div className="flex-grow flex flex-col md:grid md:grid-cols-12 items-center justify-center gap-4 pb-4">

                    {/* Left Side: Navigation (Desktop) / Hidden (Mobile) */}
                    <div className="hidden md:flex md:col-span-1 justify-center">
                        {/* Left Arrow will be in Carousel component but positioned absolutely, 
                            or we can move navigation controls out here if we want them separate from the carousel.
                            For now, keeping them in the carousel component as per plan, but this grid col is for spacing. */}
                    </div>

                    {/* Center: Carousel & Product Info */}
                    <div className="col-span-12 md:col-span-10 flex flex-col items-center w-full">

                        {/* Carousel Section */}
                        <div className="w-full mt-16 md:mt-28">
                            <ProductCarousel products={products} currentIndex={activeIndex} />
                        </div>

                        {/* Product Details */}
                        {/* Product Details */}
                        <div className="text-center text-white w-fit mx-auto flex flex-col items-center">
                            {/* Title with Navigation Arrows */}
                            <div className="w-full flex items-center justify-between gap-4 md:gap-8 mb-4">
                                <button
                                    onClick={prevSlide}
                                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-brand-purple transition-all shadow-lg border border-white/30 group flex-shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>

                                <h1 className="text-5xl md:text-7xl font-brand drop-shadow-lg uppercase tracking-wide min-w-[200px] mx-4">
                                    {currentProduct.name}
                                </h1>

                                <button
                                    onClick={nextSlide}
                                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-brand-purple transition-all shadow-lg border border-white/30 group flex-shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 transform group-hover:translate-x-1 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-lg md:text-xl mb-8 opacity-90 font-medium max-w-2xl">
                                {currentProduct.description || "Massa de baunilha, recheio de ninho e chocolate crocante"}
                            </p>

                            {/* Actions */}
                            <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
                                <button
                                    onClick={() => addToCart(currentProduct)}
                                    className="w-full md:w-auto px-8 py-4 bg-brand-yellow text-brand-purple font-bold text-lg rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-105 uppercase tracking-wide whitespace-nowrap text-center"
                                >
                                    Adicionar ao Carrinho
                                </button>
                                <Link
                                    href="/cardapio"
                                    className="w-full md:w-auto px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all uppercase tracking-wide whitespace-nowrap text-center"
                                >
                                    Cardápio completo
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Navigation (Desktop) / Hidden (Mobile) */}
                    <div className="hidden md:flex md:col-span-1 justify-center">
                        {/* Right Arrow spacing */}
                    </div>
                </div>
            </div>
        </div>
    );
}
