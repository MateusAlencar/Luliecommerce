"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProductWithCategory } from "@/types/database";

interface CartItem extends ProductWithCategory {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    isCartOpen: boolean;
    toggleCart: () => void;
    addToCart: (product: ProductWithCategory) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    shippingCost: number;
    setShippingCost: (cost: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const [shippingCost, setShippingCost] = useState(0);

    const toggleCart = () => {
        setIsCartOpen((prev) => !prev);
    };

    const addToCart = (product: ProductWithCategory) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // setIsCartOpen(true); // Open cart when adding item
            return [...prevCart, { ...product, quantity: 1 }];
        });
        console.log("Added to cart:", product.name);
    };

    const removeFromCart = (productId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        setShippingCost(0);
    };

    return (
        <CartContext.Provider value={{ cart, isCartOpen, toggleCart, addToCart, removeFromCart, updateQuantity, clearCart, shippingCost, setShippingCost }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
