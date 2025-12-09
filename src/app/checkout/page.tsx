import React from "react";
import CheckoutClient from "./CheckoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Finalizar Compra | Luli Cookies Artesanais",
    description: "Finalize seu pedido de cookies deliciosos.",
};

export default function CheckoutPage() {
    return <CheckoutClient />;
}
