"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ProductWithCategory } from "@/types/database";

interface ProductCarouselProps {
    products: ProductWithCategory[];
    currentIndex?: number; // Now accepts unbounded index
}

export function ProductCarousel({ products, currentIndex = 0 }: ProductCarouselProps) {
    const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

    useEffect(() => {
        const checkScreen = () => {
            if (window.innerWidth < 768) {
                setScreenSize('mobile');
            } else if (window.innerWidth < 1024) {
                setScreenSize('tablet');
            } else {
                setScreenSize('desktop');
            }
        };

        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const getProduct = (index: number) => {
        const normalizedIndex = ((index % products.length) + products.length) % products.length;
        return products[normalizedIndex];
    };

    const getVariant = (offset: number) => {
        if (offset === 0) return "center";
        if (offset === -1) return "left";
        if (offset === 1) return "right";
        if (offset < -1) return "hiddenLeft";
        if (offset > 1) return "hiddenRight";
        return "hidden";
    };

    const variants = {
        center: {
            x: screenSize === 'desktop' ? "10%" : "0%",
            y: screenSize === 'desktop' ? -100 : 0,

            scale: 1.0,
            zIndex: 20,
            rotate: 0,
            opacity: 1,
            filter: "blur(0px)"
        },
        left: { // Previously "Previous" (Top-Left or Top in Arc)
            x: screenSize === 'mobile' ? "-60%" : screenSize === 'tablet' ? "-55%" : "20%",
            y: screenSize === 'mobile' ? 80 : screenSize === 'tablet' ? 120 : -550,

            scale: screenSize === 'desktop' ? 0.6 : 0.6,

            zIndex: 10,
            rotate: screenSize === 'desktop' ? -15 : -25,
            opacity: 1,
            filter: "blur(0px)"
        },
        right: { // Previously "Next" (Top-Right or Bottom in Arc)
            x: screenSize === 'mobile' ? "60%" : screenSize === 'tablet' ? "55%" : "20%",
            y: screenSize === 'mobile' ? 80 : screenSize === 'tablet' ? 120 : 350,

            scale: screenSize === 'desktop' ? 0.6 : 0.6,

            zIndex: 10,
            rotate: screenSize === 'desktop' ? 15 : 25,
            opacity: 1,
            filter: "blur(0px)"
        },
        hiddenLeft: {
            // For desktop, this goes further UP and away
            x: screenSize === 'mobile' ? "-100%" : screenSize === 'desktop' ? "40%" : "-150%",

            y: screenSize === 'desktop' ? -900 : 400,


            scale: 0.4,
            zIndex: 0,
            rotate: screenSize === 'desktop' ? -30 : -45,
            opacity: 0,
            filter: "blur(5px)"
        },
        hiddenRight: {
            // For desktop, this goes further DOWN and away
            x: screenSize === 'mobile' ? "100%" : screenSize === 'desktop' ? "40%" : "150%",
            y: screenSize === 'desktop' ? 700 : 400,


            scale: 0.4,
            zIndex: 0,
            rotate: screenSize === 'desktop' ? 30 : 45,
            opacity: 0,
            filter: "blur(5px)"
        }
    };

    // Render a range of items around the current index
    // Range +/- 2 ensures smooth entry/exit
    const range = [-2, -1, 0, 1, 2];
    const visibleIndices = range.map(offset => currentIndex + offset);

    return (
        <div className="relative w-full flex flex-col items-center">
            {/* Carousel Area */}
            <div className={`relative w-full flex items-center justify-center overflow-visible perspective-1000
                h-[280px] md:h-[350px] lg:h-[800px] 
            `}>
                {visibleIndices.map((index) => {
                    const product = getProduct(index);
                    const offset = index - currentIndex;
                    const variant = getVariant(offset);

                    return (
                        <motion.div
                            key={index} // Use absolute index as key to maintain identity across moves
                            variants={variants}
                            initial={false} // Disable initial animation to prevent flash on mount if possible, or handle carefully
                            animate={variant}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                                mass: 1
                            }}
                            className="absolute top-0 flex items-center justify-center w-full h-full"
                        >
                            <Link href={`/produto/${product.id}`} className="relative w-56 h-56 md:w-[280px] md:h-[280px] lg:w-[380px] lg:h-[380px] cursor-pointer" style={{ pointerEvents: offset === 0 ? 'auto' : 'none' }}>

                                <Image
                                    src={product.image_top_url || "/images/cookie-placeholder.png"}
                                    alt={product.name}
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    priority={offset === 0}
                                />
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
