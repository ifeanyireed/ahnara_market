"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { marketplaceProducts } from "../../../productsData";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import {
  IconArrowLeft,
  IconShoppingCart,
  IconShieldCheck,
  IconStar
} from "@tabler/icons-react";

export default function ProductDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const product = marketplaceProducts.find(p => p.id === resolvedParams.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#E8EFF4] flex flex-col items-center justify-center p-8 text-slate-800">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <Link href="/market" className="text-sky-600 font-bold mt-4">Return to Storefront</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    const saved = localStorage.getItem("ahnara_market_cart");
    let cartList = [];
    if (saved) {
      try {
        cartList = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const existing = cartList.find((item: any) => item.product.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cartList.push({ product, qty: 1 });
    }
    localStorage.setItem("ahnara_market_cart", JSON.stringify(cartList));
    alert(`${product.name} added to cart.`);
  };

  return (
    <div className="min-h-screen bg-[#E8EFF4] text-[#0D090C] font-sans flex flex-col text-left">
      
      {/* NAVBAR */}
      <header className="px-8 py-5 border-b border-slate-200/50 bg-white/40 backdrop-blur-md flex items-center justify-between">
        <Link href="/market" className="flex items-center gap-1 text-xs font-black text-slate-700 hover:text-slate-955 transition-all">
          <IconArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
        <span className="font-extrabold text-sm tracking-tight text-slate-900 uppercase">Product details</span>
        <Link href="/market/cart">
          <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all shadow-xs">
            <IconShoppingCart className="w-5 h-5" />
          </button>
        </Link>
      </header>

      {/* PRODUCT SHEET */}
      <main className="max-w-3xl w-full mx-auto px-6 py-10 flex flex-col gap-6">
        
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            
            {/* Image Box */}
            <div className="w-32 h-32 rounded-2xl bg-[#E8EFF4] flex items-center justify-center text-5xl border border-slate-200 select-none">
              {product.image}
            </div>

            <div className="flex-1">
              <span className="text-[9px] font-black uppercase text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                {product.category}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">{product.name}</h2>
              <span className="text-[10px] text-slate-450 font-bold block mt-1 uppercase tracking-wider">
                Sold &amp; Dispatched by: <strong className="text-slate-800">{product.vendor}</strong>
              </span>

              <div className="flex items-center gap-1 mt-3 text-amber-500 font-bold text-xs">
                <IconStar className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-semibold ml-1">({product.reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Product Overview</h3>
            <p className="text-xs text-slate-750 font-semibold leading-relaxed mt-2">{product.description}</p>
          </div>

          {/* Reviews */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Verified Clinical feedback</h3>
            <div className="flex flex-col gap-2.5 mt-3">
              {product.reviews.map((rev, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                  <IconShieldCheck className="w-5 h-5 text-[#8BB436] flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">{rev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="border-t border-slate-150 pt-6 flex items-center justify-between mt-4">
            <span className="text-2xl font-black text-slate-950">₦{product.price.toLocaleString()}</span>
            <AhnaraButton
              onClick={handleAddToCart}
              className="bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs px-8 py-3 rounded-xl border-none shadow-xs"
            >
              Add to Shopping Cart
            </AhnaraButton>
          </div>

        </div>

      </main>

    </div>
  );
}
