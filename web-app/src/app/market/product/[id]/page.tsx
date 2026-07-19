import { marketplaceProducts } from "../../../productsData";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return marketplaceProducts.map(p => ({
    id: p.id,
  }));
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProductDetailClient params={params} />;
}
