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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
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
            x: "0%",
            y: 0,
            scale: 1.0,
            zIndex: 20,
            rotate: 0,
            opacity: 1,
            filter: "blur(0px)"
        },
        left: {
            x: isMobile ? "-60%" : "-80%",
            y: isMobile ? 80 : 180,
            scale: 0.6,
            zIndex: 10,
            rotate: -25,
            opacity: 1,
            filter: "blur(0px)"
        },
        right: {
            x: isMobile ? "60%" : "80%",
            y: isMobile ? 80 : 180,
            scale: 0.6,
            zIndex: 10,
            rotate: 25,
            opacity: 1,
            filter: "blur(0px)"
        },
        hiddenLeft: {
            x: isMobile ? "-100%" : "-150%",
            y: 400,
            scale: 0.4,
            zIndex: 0,
            rotate: -45,
            opacity: 0,
            filter: "blur(5px)"
        },
        hiddenRight: {
            x: isMobile ? "100%" : "150%",
            y: 400,
            scale: 0.4,
            zIndex: 0,
            rotate: 45,
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
            <div className="relative w-full h-[280px] md:h-[380px] flex items-center justify-center overflow-visible perspective-1000">
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
                            <Link href={`/produto/${product.id}`} className="relative w-56 h-56 md:w-[300px] md:h-[300px] cursor-pointer" style={{ pointerEvents: offset === 0 ? 'auto' : 'none' }}>
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
