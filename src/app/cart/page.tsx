import { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
    title: "Carrinho | Luli Cookies Artesanais",
    description: "Visualize e gerencie seus itens no carrinho.",
};

export default function CartPage() {
    return <CartClient />;
}
