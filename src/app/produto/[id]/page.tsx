import { getProductById, getProducts } from "@/lib/products";
import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Generate static params for all products to improve performance (optional but good practice)
export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product) => ({
        id: product.id.toString(),
    }));
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id: idString } = await params;
    const id = parseInt(idString);
    console.log(`[ProductPage] Requested ID: ${idString}, Parsed: ${id} `);

    if (isNaN(id)) {
        console.log(`[ProductPage] Invalid ID`);
        notFound();
    }

    const product = await getProductById(id);
    console.log(`[ProductPage] Product found: `, product ? product.name : 'null');

    if (!product) {
        notFound();
    }

    return <ProductClient product={product} />;
}
