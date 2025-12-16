"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface StoreSettingsContextType {
    isOpen: boolean;
    isLoading: boolean;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(true); // Default to open
    const [isLoading, setIsLoading] = useState(true);
    const [settingsId, setSettingsId] = useState<number | null>(null);

    // Initial Fetch
    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from("store_settings")
                .select("*")
                .limit(1)
                .single();

            if (data) {
                setIsOpen(data.is_open);
                setSettingsId(data.id);
            } else if (error && error.code === 'PGRST116') {
                // No row exists, create one
                console.log("No store settings found, creating default...");
                const { data: newData, error: insertError } = await supabase
                    .from("store_settings")
                    .insert({ is_open: true })
                    .select()
                    .single();

                if (newData) {
                    setIsOpen(newData.is_open);
                    setSettingsId(newData.id);
                } else if (insertError) {
                    console.error("Error creating default store settings:", insertError);
                }
            } else {
                console.error("Error fetching store settings:", error);
            }
        } catch (error) {
            console.error("Unexpected error fetching store settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();

        // Realtime Subscription
        const channel = supabase
            .channel('store_settings_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'store_settings'
                },
                (payload) => {
                    console.log("Store settings changed:", payload);
                    if (payload.new && typeof payload.new === 'object' && 'is_open' in payload.new) {
                        // @ts-ignore - Payload typing is loose in supabase-js
                        setIsOpen(payload.new.is_open);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <StoreSettingsContext.Provider value={{ isOpen, isLoading }}>
            {children}
        </StoreSettingsContext.Provider>
    );
}

export function useStoreSettings() {
    const context = useContext(StoreSettingsContext);
    if (context === undefined) {
        throw new Error("useStoreSettings must be used within a StoreSettingsProvider");
    }
    return context;
}
