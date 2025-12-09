
import React from "react";
import OrdersClient from "./OrdersClient";

export const metadata = {
    title: "Meus Pedidos | Luli",
    description: "Acompanhe seus pedidos e veja seu histórico de compras.",
};

export default function PedidosPage() {
    return <OrdersClient />;
}
