"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import {
  IconArrowLeft,
  IconShoppingCart,
  IconPlus,
  IconMinus,
  IconX,
  IconChevronRight,
  IconBuildingStore
} from "@tabler/icons-react";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState("Lekki Central Pharmacy");

  const pharmaciesList = [
    { name: "Lekki Central Pharmacy", distance: "0.8 km", rating: "4.9", extraCost: 0 },
    { name: "Victoria Island Drugs", distance: "2.5 km", rating: "4.7", extraCost: 400 },
    { name: "Central Pharmacy Depot", distance: "3.2 km", rating: "4.8", extraCost: 200 }
  ];

  useEffect(() => {
    const saved = localStorage.getItem("ahnara_market_cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveCart = (newCart: any[]) => {
    setCart(newCart);
    localStorage.setItem("ahnara_market_cart", JSON.stringify(newCart));
  };

  const handleUpdateQty = (productId: string, amount: number) => {
    const updated = cart.map(item => {
      if (item.product.id === productId) {
        return { ...item, qty: Math.max(1, item.qty + amount) };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemove = (productId: string) => {
    const updated = cart.filter(item => item.product.id !== productId);
    saveCart(updated);
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  };

  const getPharmacySurcharge = () => {
    const selected = pharmaciesList.find(p => p.name === selectedPharmacy);
    return selected ? selected.extraCost : 0;
  };

  return (
    <div className="min-h-screen bg-[#E8EFF4] text-[#0D090C] font-sans flex flex-col text-left">
      
      {/* NAVBAR */}
      <header className="px-8 py-5 border-b border-slate-200/50 bg-white/40 backdrop-blur-md flex items-center justify-between">
        <Link href="/market" className="flex items-center gap-1 text-xs font-black text-slate-700 hover:text-slate-955 transition-all">
          <IconArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
        <span className="font-extrabold text-sm tracking-tight text-slate-900 uppercase">Shopping Cart</span>
        <div className="w-16" />
      </header>

      {/* CART CONTENT */}
      <main className="max-w-4xl w-full mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Items List */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs">
            <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <IconShoppingCart className="w-5 h-5 text-slate-500" />
              Your Order Items
            </h3>

            {cart.length === 0 ? (
              <div className="py-16 text-center text-slate-400 font-bold text-sm">
                Your cart is empty. Check out the Storefront to add items!
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map(item => (
                  <div key={item.product.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl border border-slate-200 select-none">
                      {item.product.image}
                    </div>

                    <div className="text-left flex-1">
                      <h4 className="text-xs font-black text-slate-900 line-clamp-1">{item.product.name}</h4>
                      <span className="text-[10px] text-slate-450 font-bold block mt-0.5 uppercase tracking-wider">
                        Vendor: {item.product.vendor}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQty(item.product.id, -1)}
                          className="w-7 h-7 bg-white border border-slate-250 rounded-lg flex items-center justify-center cursor-pointer text-slate-650 hover:bg-slate-50"
                        >
                          <IconMinus className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-black text-slate-800 w-4 text-center">{item.qty}</span>
                        <button
                          onClick={() => handleUpdateQty(item.product.id, 1)}
                          className="w-7 h-7 bg-white border border-slate-250 rounded-lg flex items-center justify-center cursor-pointer text-slate-650 hover:bg-slate-50"
                        >
                          <IconPlus className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-slate-900 w-16 text-right">
                        ₦{(item.product.price * item.qty).toLocaleString()}
                      </span>

                      <button
                        onClick={() => handleRemove(item.product.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border-none bg-transparent cursor-pointer ml-1"
                      >
                        <IconX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pharmacy Comparison Matrix (MK.02) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col gap-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-400">Choose Fulfillment Partner Pharmacy</h3>
            <div className="flex flex-col gap-2">
              {pharmaciesList.map(ph => (
                <div
                  key={ph.name}
                  onClick={() => setSelectedPharmacy(ph.name)}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedPharmacy === ph.name ? "border-[#8BB436] bg-[#E8F3CE]/25" : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black text-slate-900">{ph.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold mt-1">Distance: {ph.distance} • Rating: ★ {ph.rating}</span>
                  </div>
                  <span className="text-xs font-black text-slate-800">
                    {ph.extraCost === 0 ? "Standard Pricing" : `+ ₦${ph.extraCost.toLocaleString()} surcharge`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary side board */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs h-fit flex flex-col gap-5">
          <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">Order Summary</h3>

          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>Items Total</span>
              <span>₦{getSubtotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>Partner Surcharge</span>
              <span>₦{getPharmacySurcharge().toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-150 pt-3 flex justify-between items-center mt-2">
              <span className="text-xs font-black text-slate-950">Total Bill</span>
              <span className="text-base font-black text-slate-950">₦{(getSubtotal() + getPharmacySurcharge()).toLocaleString()}</span>
            </div>
          </div>

          <Link href="/market/checkout">
            <AhnaraButton
              disabled={cart.length === 0}
              className="bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl w-full border-none shadow-xs flex items-center justify-center gap-1.5"
            >
              Proceed to Checkout
              <IconChevronRight className="w-4 h-4" />
            </AhnaraButton>
          </Link>
        </div>

      </main>

    </div>
  );
}
