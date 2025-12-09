import React, { useEffect, useRef } from "react";

interface AddressAutocompleteProps {
    onAddressSelect: (place: google.maps.places.PlaceResult) => void;
    placeholder?: string;
    defaultValue?: string;
    className?: string;
}

export function AddressAutocomplete({ onAddressSelect, placeholder, defaultValue, className }: AddressAutocompleteProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        if (!inputRef.current || !window.google) return;

        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: "br" }, // Restrict to Brazil
            fields: ["address_components", "geometry", "formatted_address"],
            types: ["address"],
        });

        autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current?.getPlace();
            if (place) {
                onAddressSelect(place);
            }
        });

        return () => {
            if (autocompleteRef.current) {
                google.maps.event.clearInstanceListeners(autocompleteRef.current);
            }
        };
    }, [onAddressSelect]);

    return (
        <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            defaultValue={defaultValue}
            className={className}
        />
    );
}
