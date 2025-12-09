import { getProducts } from "@/lib/products";
import HomeClient from "./HomeClient";

export default async function Home() {
  const products = await getProducts();

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

  return <HomeClient products={products} />;
}
