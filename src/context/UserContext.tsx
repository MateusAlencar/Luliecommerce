"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile, UserAddress, Order } from "@/types/database";
import { supabase } from "@/lib/supabase";

interface UserContextType {
    user: UserProfile;
    updateAddress: (address: UserAddress) => void;
    incrementPurchaseCount: () => void;
    addOrder: (order: Order) => void;
    hasFreeCookie: boolean;
    refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
    name: "Usuário",
    email: "usuario@luli.com",
    purchaseCount: 0,
    free_cookie_earned: false,
    orders: [],
};

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

    // Load user data from localStorage on mount and check Supabase auth
    useEffect(() => {
        // 1. Local Storage
        const storedUser = localStorage.getItem("luliUser");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error loading user data:", e);
            }
        }

        // 2. Supabase Auth & Data Sync
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session?.user?.id) {
                    await fetchUserProfile(session.user.id);
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(DEFAULT_USER);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Save user data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("luliUser", JSON.stringify(user));
    }, [user]);

    const updateAddress = async (address: UserAddress) => {
        // 1. Update local state
        setUser((prev) => ({
            ...prev,
            address,
        }));

        // 2. Update Supabase if logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
            try {
                await supabase
                    .from('customer_users')
                    .upsert({
                        id: session.user.id, // Ensure we link to the auth user
                        email: session.user.email!,
                        name: user.name, // Use current name or fallback
                        address: address as any // JSONB handles objects directly usually, but let's pass object
                        // created_at will be handled by default if insert
                    })
                    .select();
            } catch (error) {
                console.error("Error updating address in Supabase:", error);
            }
        }
    };

    const incrementPurchaseCount = () => {
        setUser((prev) => ({
            ...prev,
            purchaseCount: prev.purchaseCount + 1,
        }));
    };

    const addOrder = (order: Order) => {
        setUser((prev) => ({
            ...prev,
            orders: [order, ...prev.orders],
        }));
    };

    const hasFreeCookie = user.free_cookie_earned || user.purchaseCount >= 5;

    const fetchUserProfile = async (userId: string) => {
        try {
            // 1. Fetch customer_users
            const { data: userData } = await supabase
                .from('customer_users')
                .select('*')
                .eq('id', userId)
                .single();

            let parsedAddress: UserAddress | undefined = undefined;
            if (userData) {
                if (userData.address) {
                    try {
                        parsedAddress = typeof userData.address === 'string'
                            ? JSON.parse(userData.address)
                            : userData.address;
                    } catch (e) {
                        console.error("Error parsing address JSON:", e);
                    }
                }
            }



            // 2. Fetch fidelity
            const { data: fidelityData } = await supabase
                .from('fidelity')
                .select('*')
                .eq('user_id', userId)
                .single();

            setUser(prev => ({
                ...prev,
                ...(userData && {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    address: parsedAddress || prev.address,
                }),
                ...(fidelityData && {
                    purchaseCount: fidelityData.points,
                    free_cookie_earned: fidelityData.free_cookie_earned,
                })
            }));

        } catch (error) {
            console.error("Error refreshing profile:", error);
        }
    };

    const refreshProfile = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
            await fetchUserProfile(session.user.id);
        }
    };

    return (
        <UserContext.Provider value={{ user, updateAddress, incrementPurchaseCount, addOrder, hasFreeCookie, refreshProfile }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

