"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/ahnara/AuthContext";
import { marketplaceProducts, Product } from "./productsData";
import {
  IconSearch,
  IconShoppingCart,
  IconPlus,
  IconMinus,
  IconX,
  IconShieldCheck,
  IconChevronRight,
  IconStar,
  IconDashboard,
  IconGridPattern,
  IconAdjustmentsHorizontal
} from "@tabler/icons-react";

export default function CreativeStorefrontPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

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

  const saveCart = (newCart: { product: Product; qty: number }[]) => {
    setCart(newCart);
    localStorage.setItem("ahnara_market_cart", JSON.stringify(newCart));
  };

  const handleAddToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    let updated;
    if (existing) {
      updated = cart.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
    } else {
      updated = [...cart, { product, qty: 1 }];
    }
    saveCart(updated);
  };

  const handleUpdateQty = (productId: string, amount: number) => {
    const updated = cart.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.qty + amount);
        return { ...item, qty: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemoveFromCart = (productId: string) => {
    const updated = cart.filter(item => item.product.id !== productId);
    saveCart(updated);
  };

  const handleDashboardRedirect = () => {
    const stored = localStorage.getItem("provider_onboarding_data");
    let role = "BUYER";
    if (stored) {
      try {
        const profile = JSON.parse(stored);
        if (profile.role === "ADMIN" || profile.specialty?.includes("Admin")) {
          role = "ADMIN";
        } else if (profile.role === "VENDOR" || profile.specialty?.includes("Pharmacist")) {
          role = "VENDOR";
        }
      } catch (e) {
        console.error(e);
      }
    } else if (user) {
      if (user.role === "ADMIN") role = "ADMIN";
      else if (user.role === "VENDOR" || user.role === "PHARMACIST") role = "VENDOR";
    }

    if (role === "ADMIN") {
      router.push("/admin");
    } else if (role === "VENDOR") {
      router.push("/vendor");
    } else {
      router.push("/buyer");
    }
  };

  const categories = ["All", "Maternal Care", "Pediatrics", "Geriatrics", "Diagnostic Scans", "Medical Supplies"];
  
  const getFilteredProducts = () => {
    return marketplaceProducts.filter(prod => {
      const matchesCategory = activeCategory === "All" || prod.category === activeCategory;
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  return (
    <div className="min-h-screen bg-[#E8EFF4] text-[#0D090C] font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Sleek Minimalist Header */}
      <header className="px-8 py-5 flex items-center justify-between gap-6 bg-white/40 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4F475] flex items-center justify-center shadow-xs">
            <img src="/logo.png" alt="Ahnara Logo" className="w-7 h-7 object-contain" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900 text-display">Ahnara Market</span>
        </div>

        {/* Floating Search Input */}
        <div className="relative flex-1 max-w-md mx-6">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search verified medicine, diagnostic labs, baby items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#E8EFF4]/60 border border-slate-250/40 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none focus:bg-white focus:border-slate-350 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDashboardRedirect}
            className="bg-[#1E293B] text-white hover:bg-slate-800 transition-all font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border-none"
          >
            <IconDashboard className="w-4 h-4" />
            My Console
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all relative shadow-xs cursor-pointer"
          >
            <IconShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#8BB436] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Split Grid Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sticky Sidebar filters (No generic hero) */}
        <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4 self-start sticky top-24">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs text-left">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1">
              <IconAdjustmentsHorizontal className="w-4.5 h-4.5 text-slate-500" />
              Categories
            </h3>
            
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 scrollbar-hide">
              {categories.map(cat => {
                const isActive = activeCategory === cat;
                const count = cat === "All" 
                  ? marketplaceProducts.length 
                  : marketplaceProducts.filter(p => p.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all border-none cursor-pointer flex items-center justify-between gap-3 w-full whitespace-nowrap ${
                      isActive ? "bg-[#1E293B] text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-transparent"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Quick specs Bento Box */}
          <div className="bg-[#E9F2F5] p-5 rounded-3xl border border-slate-200/40 text-left hidden lg:block">
            <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">Ahnara Security</span>
            <h4 className="font-extrabold text-xs text-slate-800 mt-2">100% Vetted Sellers</h4>
            <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
              Every seller is audited. Pharmaceutical logs and diagnostic booking codes verified by system registries.
            </p>
          </div>
        </aside>

        {/* Dynamic products masonry grid */}
        <main className="flex-1 flex flex-col gap-6 text-left">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight text-display">
              {activeCategory === "All" ? "Healthcare Directory" : activeCategory}
            </h2>
            <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider">
              {getFilteredProducts().length} listings found
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {getFilteredProducts().map(prod => (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="bg-white rounded-2xl border border-slate-200/60 p-4 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
              >
                <div>
                  {/* Aspect Square Image Cover */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3 border border-slate-100">
                    <img src={prod.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={prod.name} />
                    {prod.discount && (
                      <span className="absolute top-2 left-2 bg-[#8BB436] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                        {prod.discount}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{prod.category}</span>
                    <span className="text-[9px] font-bold text-amber-500 flex items-center gap-0.5">
                      <IconStar className="w-3 h-3 fill-current" /> {prod.rating}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs text-slate-850 mt-1 line-clamp-2 min-h-[32px]">{prod.name}</h4>
                  <span className="text-[9px] text-slate-400 font-bold block mt-1 truncate">Sold by: {prod.vendor}</span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900">₦{prod.price.toLocaleString()}</span>
                    {prod.originalPrice && (
                      <span className="text-[9px] text-slate-400 line-through">₦{prod.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(prod);
                    }}
                    className="w-7 h-7 rounded-full bg-[#1E293B] text-white flex items-center justify-center hover:bg-slate-800 transition-all border-none cursor-pointer"
                  >
                    <IconPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* PRODUCT DETAIL SHEET MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full z-10 shadow-2xl relative border border-slate-200"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer"
              >
                <IconX className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                  <img src={selectedProduct.image} className="w-full h-full object-cover" />
                </div>
                <div className="text-left flex-1">
                  <span className="text-[9px] font-black uppercase text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                    {selectedProduct.category}
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-2">{selectedProduct.name}</h2>
                  <p className="text-[10px] text-slate-450 font-bold uppercase mt-1 tracking-wider">
                    Sold by: {selectedProduct.vendor}
                  </p>
                </div>
              </div>

              <div className="text-left mt-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Product Description</h4>
                <p className="text-xs text-slate-650 font-semibold leading-relaxed mt-1">{selectedProduct.description}</p>
              </div>

              <div className="text-left mt-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Clinician Verified Reviews</h4>
                <div className="flex flex-col gap-2 mt-2">
                  {selectedProduct.reviews.map((rev, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                      <IconShieldCheck className="w-4 h-4 text-[#8BB436] flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">{rev}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 border-t border-slate-150 pt-4">
                <span className="text-lg font-black text-slate-950">₦{selectedProduct.price.toLocaleString()}</span>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl border-none shadow-xs cursor-pointer"
                >
                  Add To Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHOPPING CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md h-full z-10 shadow-2xl relative border-l border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="p-6 border-b border-slate-150 flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                    <IconShoppingCart className="w-5 h-5 text-slate-650" />
                    Shopping Cart
                  </h3>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(100vh-250px)]">
                  {cart.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 font-bold text-sm">
                      Your shopping cart is empty.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {cart.map(item => (
                        <div key={item.product.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                            <img src={item.product.image} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="text-left flex-1">
                            <h4 className="text-xs font-black text-slate-900 line-clamp-1">{item.product.name}</h4>
                            <span className="text-[10px] text-slate-450 font-bold block mt-0.5">₦{item.product.price.toLocaleString()} each</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQty(item.product.id, -1)}
                              className="w-6 h-6 bg-white border border-slate-250 rounded-lg flex items-center justify-center cursor-pointer text-slate-650 hover:bg-slate-50"
                            >
                              <IconMinus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-black text-slate-800 w-4 text-center">{item.qty}</span>
                            <button
                              onClick={() => handleUpdateQty(item.product.id, 1)}
                              className="w-6 h-6 bg-white border border-slate-250 rounded-lg flex items-center justify-center cursor-pointer text-slate-650 hover:bg-slate-50"
                            >
                              <IconPlus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg border-none bg-transparent cursor-pointer ml-1"
                          >
                            <IconX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-slate-150 bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Subtotal</span>
                  <span className="text-lg font-black text-slate-950">
                    ₦{cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0).toLocaleString()}
                  </span>
                </div>

                <Link href="/market/checkout">
                  <button
                    className="w-full bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl border-none shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    disabled={cart.length === 0}
                  >
                    Proceed to Checkout
                    <IconChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white/40 backdrop-blur-md py-6 mt-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>Ahnara Marketplace</span>
          <span>Lagos Spine Active</span>
        </div>
      </footer>

    </div>
  );
}
