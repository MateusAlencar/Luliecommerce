import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import CardapioClient from "./CardapioClient";

export default async function CardapioPage() {
    const [products, categories] = await Promise.all([
        getProducts(),
        getCategories(),
    ]);

    // If no products, show a message
    if (!products || products.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center text-foreground">
                    <h1 className="text-4xl font-brand mb-4">Nenhum produto encontrado</h1>
                    <p className="font-body">Adicione produtos ao banco de dados para começar.</p>
                </div>
            </div>
        );
    }

    return <CardapioClient products={products} categories={categories} />;
}
