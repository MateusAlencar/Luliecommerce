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
            <div className={`fixed transition-all duration-700 ease-out z-0
                bottom-0 left-0 w-[100vw] h-[70vh] md:h-[75vh] 
                lg:h-[140vh] lg:w-[60vw] lg:top-1/2 lg:right-0 lg:left-auto lg:-translate-y-1/2 lg:translate-x-[35%]
                bg-brand-purple rounded-t-[50%] lg:rounded-l-[50%] lg:rounded-tr-none lg:rounded-br-none
                scale-x-150 md:scale-x-125 lg:scale-x-100 lg:scale-y-110
                translate-y-20 lg:translate-y-[-50%]
            `}></div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-full w-full max-w-7xl mx-auto pt-4 px-4 md:px-8 lg:px-12">

                {/* Header Placeholder (handled by layout, but space needed) */}
                <div className="h-32 md:h-32 lg:h-32 shrink-0"></div>

                {/* Main Content Grid */}
                <div className="flex-grow flex flex-col lg:grid lg:grid-cols-2 items-center justify-center gap-4 lg:gap-12 pb-4 h-full">

                    {/* Left Column (Desktop): Text Content */}
                    <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left text-white w-full max-w-2xl lg:max-w-none mx-auto lg:pl-8">

                        {/* Title Section */}
                        <div className="flex items-center justify-center lg:justify-start gap-4 mb-2 lg:mb-0 w-full">
                            <h1 className="text-5xl md:text-7xl lg:text-8xl lg:text-brand-purple lg:leading-[0.8] xl:text-9xl font-brand drop-shadow-lg uppercase tracking-wide transition-all duration-300">
                                {currentProduct.name}
                            </h1>
                        </div>

                        <p className="text-lg md:text-xl lg:text-2xl mb-8 lg:mb-4 opacity-90 lg:opacity-100 lg:text-[#719E73] font-medium max-w-2xl lg:max-w-xl">
                            {currentProduct.description || "Massa de baunilha, recheio de ninho e chocolate crocante"}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col md:flex-row gap-4 justify-center lg:justify-start items-center w-full">
                            <button
                                onClick={() => addToCart(currentProduct)}
                                className="w-full md:w-auto px-8 py-4 lg:px-12 lg:py-6 bg-brand-yellow text-brand-purple font-bold text-lg lg:text-2xl rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-105 uppercase tracking-wide whitespace-nowrap text-center"
                            >
                                Adicionar ao Carrinho
                            </button>
                            <Link
                                href="/cardapio"
                                className="w-full md:w-auto px-8 py-4 lg:px-12 lg:py-6 bg-transparent border-2 border-white text-white font-bold text-lg lg:text-2xl rounded-full hover:bg-white/10 transition-all uppercase tracking-wide whitespace-nowrap text-center lg:hidden"
                            >
                                Cardápio completo
                            </Link>
                        </div>

                        {/* Desktop Navigation Arrows (Below Text) */}
                        <div className="hidden lg:flex gap-6 mt-12 w-full justify-start">
                            <button
                                onClick={prevSlide}
                                className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-brand-purple transition-all shadow-lg border border-white/30 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 transform group-hover:-translate-x-1 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-brand-purple transition-all shadow-lg border border-white/30 group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 transform group-hover:translate-x-1 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>

                    </div>

                    {/* Right Column (Desktop): Carousel & Arc */}
                    <div className="order-1 lg:order-2 w-full h-full flex flex-col items-center justify-center relative lg:h-[80vh]">
                        {/* Mobile Navigation Arrows (Top) */}
                        <div className="lg:hidden w-full flex items-center justify-between absolute top-1/2 -translate-y-1/2 px-4 z-20 pointer-events-none">
                            <button
                                onClick={prevSlide}
                                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white pointer-events-auto"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white pointer-events-auto"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>

                        <div className="w-full lg:absolute lg:right-0 lg:w-[140%] h-full flex items-center">
                            <ProductCarousel products={products} currentIndex={activeIndex} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
