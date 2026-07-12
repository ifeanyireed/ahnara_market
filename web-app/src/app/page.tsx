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
  IconChevronLeft,
  IconChevronRight,
  IconStar,
  IconUser,
  IconCamera,
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

  const [currentSlide, setCurrentSlide] = useState(0);
  const bannerSlides = [
    {
      title: "Health and Wellness, delivered to you.",
      subtitle: "Get home delivery on verified medicines, maternal care supplies, and diagnostic lab test kits audited by professional medical boards.",
      image: "/market-banner.jpg",
      cta1: "Shop Now",
      cta2: "Explore Deals"
    },
    {
      title: "100% Vetted Sellers & Secure Registry",
      subtitle: "Every prescription, medical supply, and specialist service is audited. Shop with peace of mind under verified digital registry protection.",
      image: "/market-banner.jpg",
      cta1: "View Directory",
      cta2: "Security Specs"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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

  const categories = [
    "All",
    "Maternal Care",
    "Pediatrics",
    "Geriatrics",
    "Diagnostic Scans",
    "Medical Supplies",
    "Prescription Rx",
    "OTC Medicines",
    "Personal Hygiene",
    "Wellness & Vitamins",
    "First Aid & Safety",
    "Fitness & Rehab",
    "Alternative Medicine",
    "Sexual Wellness",
    "Skincare & Derma",
    "Diabetes Care",
    "Nutrition & Diet"
  ];

  const visualCategories = [
    { name: "Maternal Care", image: "/care.png" },
    { name: "Pediatrics", image: "/medical.png" },
    { name: "Geriatrics", image: "/specialist.png" },
    { name: "Diagnostic Scans", image: "/planning.png" },
    { name: "Medical Supplies", image: "/delivery.png" },
    { name: "Prescription Rx", image: "/medical.png" },
    { name: "OTC Medicines", image: "/wellness.png" },
    { name: "Personal Hygiene", image: "/sanitation.png" },
    { name: "Wellness & Vitamins", image: "/wellness.png" },
    { name: "First Aid & Safety", image: "/transport.png" },
    { name: "Fitness & Rehab", image: "/wardrobe.png" },
    { name: "Alternative Medicine", image: "/agro.png" },
    { name: "Sexual Wellness", image: "/style.png" },
    { name: "Skincare & Derma", image: "/wellness.png" },
    { name: "Diabetes Care", image: "/medical.png" },
    { name: "Nutrition & Diet", image: "/culinary.png" }
  ];
  
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
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-xs font-semibold outline-none focus:border-[#8BB436]/50 focus:ring-2 focus:ring-[#8BB436]/10 shadow-xs transition-all"
          />
          <button 
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 transition-all bg-transparent border-none cursor-pointer p-0 flex items-center"
            onClick={() => alert("Visual search is coming soon to Ahnara Market!")}
            title="Search by image"
          >
            <IconCamera className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/login")}
            className="bg-[#1E293B] text-white hover:bg-slate-800 transition-all font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border-none"
          >
            <IconUser className="w-4 h-4" />
            Sign in
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

      {/* Subheader category line (Jumia Style) */}
      <div className="w-full border-b border-slate-200/30 bg-white/40 backdrop-blur-md">
        <div className="max-w-[97vw] mx-auto px-4 py-3.5 flex items-center gap-2 overflow-x-auto scrollbar-hide text-[11px] font-bold text-slate-600">
          <span className="text-slate-900 font-extrabold flex items-center gap-1.5 pr-4 border-r border-slate-200 select-none whitespace-nowrap">
            <IconAdjustmentsHorizontal className="w-4 h-4 text-slate-500" />
            Quick Categories
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  const el = document.getElementById("healthcare-directory");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`px-3 py-1.5 rounded-lg transition-all border-none cursor-pointer text-xs font-bold whitespace-nowrap ${
                  activeCategory === cat 
                    ? "bg-[#1E293B] text-white shadow-xs" 
                    : "hover:bg-slate-100/80 hover:text-slate-900 bg-transparent text-slate-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Hero Carousel Banner (Inspired by Jumia style, tailored to Ahnara theme) */}
      <div className="max-w-[97vw] w-full mx-auto px-4 pt-8">
        <div className="relative overflow-hidden w-full bg-gradient-to-r from-slate-900 via-[#1A2536] to-slate-950 text-white rounded-3xl min-h-[360px] md:min-h-[400px] flex items-center justify-between shadow-xl border border-slate-800/85 group/banner">
          
          {/* Slide Content */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-between w-full h-full relative min-h-[360px] md:min-h-[400px]">
            
            {/* Left side text and buttons */}
            <div className="flex-1 flex flex-col justify-center p-8 lg:p-12 text-left z-10 max-w-xl">
              <span className="text-[10px] font-black uppercase text-[#D4F475] tracking-widest mb-3 bg-[#D4F475]/10 px-3 py-1 rounded-full w-fit">
                Ahnara Storefront
              </span>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.15] text-display">
                {bannerSlides[currentSlide].title}
              </h1>
              
              <p className="text-xs md:text-sm text-slate-350 font-medium mb-8 leading-relaxed max-w-md">
                {bannerSlides[currentSlide].subtitle}
              </p>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const el = document.getElementById("healthcare-directory");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-[#D4F475] text-slate-900 hover:bg-[#c2e25f] transition-all font-black px-6 py-3 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border-none shadow-md"
                >
                  {bannerSlides[currentSlide].cta1}
                </button>
                <button
                  onClick={() => {
                    setActiveCategory("Maternal Care");
                    const el = document.getElementById("healthcare-directory");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-transparent hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl text-xs border border-white/20 transition-all cursor-pointer"
                >
                  {bannerSlides[currentSlide].cta2}
                </button>
              </div>
            </div>

            {/* Right side Image display */}
            <div className="relative w-full md:w-[45%] h-[200px] md:h-[400px] flex items-center justify-center overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10 hidden md:block" />
              <img
                src={bannerSlides[currentSlide].image}
                alt="Banner Graphic"
                className="w-full h-full object-cover md:object-right select-none"
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 text-white flex items-center justify-center cursor-pointer transition-all z-20 opacity-0 group-hover/banner:opacity-100 shadow-md"
            aria-label="Previous Slide"
          >
            <IconChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % bannerSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 text-white flex items-center justify-center cursor-pointer transition-all z-20 opacity-0 group-hover/banner:opacity-100 shadow-md"
            aria-label="Next Slide"
          >
            <IconChevronRight className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-8 lg:left-12 flex gap-1.5 z-20">
            {bannerSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 border-none cursor-pointer p-0 ${
                  currentSlide === idx ? "w-5 h-1.5 rounded-full bg-[#D4F475]" : "w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Visual Category Cards (Jumia style) */}
      <div className="max-w-[97vw] w-full mx-auto px-4 pt-8">
        <div className="bg-white rounded-3xl border border-slate-200/50 p-6 flex flex-row items-center gap-4 overflow-x-auto scrollbar-hide w-full shadow-xs justify-start">
          
          {visualCategories.map((vcat, index) => (
            <React.Fragment key={vcat.name}>
              {index > 0 && (
                <div className="w-[1px] h-16 bg-slate-200/70 flex-shrink-0 self-center mx-1" />
              )}
              <button
                onClick={() => {
                  setActiveCategory(vcat.name);
                  const el = document.getElementById("healthcare-directory");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent min-w-[80px]"
              >
                <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-2xs group-hover:shadow-md group-hover:border-[#8BB436]/30 transition-all duration-300">
                  <img src={vcat.image} alt={vcat.name} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[10px] font-black text-slate-700 group-hover:text-[#8BB436] transition-colors text-center leading-tight whitespace-nowrap">
                  {vcat.name}
                </span>
              </button>
            </React.Fragment>
          ))}

          {/* Faint dividing line before View All */}
          <div className="w-[1px] h-16 bg-slate-200/70 flex-shrink-0 self-center mx-1" />

          {/* View All Categories Button */}
          <button
            onClick={() => {
              setActiveCategory("All");
              const el = document.getElementById("healthcare-directory");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center gap-2 group cursor-pointer border-none bg-transparent min-w-[80px]"
          >
            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-2xs group-hover:shadow-md group-hover:border-[#8BB436]/30 transition-all duration-300">
              <IconGridPattern className="w-6 h-6 text-slate-400 group-hover:text-[#8BB436] transition-colors" />
            </div>
            <span className="text-[10px] font-black text-slate-700 group-hover:text-[#8BB436] transition-colors text-center leading-tight whitespace-nowrap">
              View All
            </span>
          </button>

        </div>
      </div>

      {/* 4 Feature Banner Cards (Inspired by Jumia, using Ahnara design system) */}
      <div className="max-w-[97vw] w-full mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Ahnara Prime Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-all group">
            <div className="flex-1 text-left flex flex-col justify-between h-full min-h-[96px]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Premium
                </span>
                <h3 className="font-extrabold text-sm text-[#1E293B] group-hover:text-[#8BB436] transition-colors leading-tight">
                  Ahnara Prime
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                  Enjoy fast free delivery, exclusive deals, and priorities.
                </p>
              </div>
              <button 
                onClick={() => alert("Ahnara Prime membership activation coming soon!")}
                className="text-[9px] font-black uppercase text-[#8BB436] hover:text-[#1E293B] transition-colors tracking-wider border-none bg-transparent cursor-pointer p-0 text-left mt-3 flex items-center gap-0.5"
              >
                Try Prime <IconChevronRight className="w-3 h-3" />
              </button>
            </div>
            <img src="/delivery.png" alt="Ahnara Prime" className="w-28 h-28 flex-shrink-0 object-contain group-hover:scale-105 transition-transform duration-300" />
          </div>

          {/* Super Market Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-all group">
            <div className="flex-1 text-left flex flex-col justify-between h-full min-h-[96px]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Essentials
                </span>
                <h3 className="font-extrabold text-sm text-[#1E293B] group-hover:text-emerald-600 transition-colors leading-tight">
                  Super Market
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                  Groceries, vitamins, and supplies from verified vendors.
                </p>
              </div>
              <button 
                onClick={() => {
                  setActiveCategory("Medical Supplies");
                  const el = document.getElementById("healthcare-directory");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-[9px] font-black uppercase text-[#8BB436] hover:text-[#1E293B] transition-colors tracking-wider border-none bg-transparent cursor-pointer p-0 text-left mt-3 flex items-center gap-0.5"
              >
                Shop Now <IconChevronRight className="w-3 h-3" />
              </button>
            </div>
            <img src="/wardrobe.png" alt="Super Market" className="w-28 h-28 flex-shrink-0 object-contain group-hover:scale-105 transition-transform duration-300" />
          </div>

          {/* Pay on Delivery Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-all group">
            <div className="flex-1 text-left flex flex-col justify-between h-full min-h-[96px]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Flexible
                </span>
                <h3 className="font-extrabold text-sm text-[#1E293B] group-hover:text-sky-600 transition-colors leading-tight">
                  Pay on Delivery
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                  Pay cash or transfer instantly when your package arrives.
                </p>
              </div>
              <button 
                onClick={() => alert("Cash or bank transfer on delivery is supported in all locations.")}
                className="text-[9px] font-black uppercase text-[#8BB436] hover:text-[#1E293B] transition-colors tracking-wider border-none bg-transparent cursor-pointer p-0 text-left mt-3 flex items-center gap-0.5"
              >
                Learn More <IconChevronRight className="w-3 h-3" />
              </button>
            </div>
            <img src="/transport.png" alt="Pay on Delivery" className="w-28 h-28 flex-shrink-0 object-contain group-hover:scale-105 transition-transform duration-300" />
          </div>

          {/* Deals of the Day Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/50 shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-all group">
            <div className="flex-1 text-left flex flex-col justify-between h-full min-h-[96px]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Hot Deals
                </span>
                <h3 className="font-extrabold text-sm text-[#1E293B] group-hover:text-rose-600 transition-colors leading-tight">
                  Deals of the Day
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                  Save up to 40% on select diagnostic kits and vitamins today.
                </p>
              </div>
              <button 
                onClick={() => {
                  setSearchQuery("discount");
                  const el = document.getElementById("healthcare-directory");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-[9px] font-black uppercase text-[#8BB436] hover:text-[#1E293B] transition-colors tracking-wider border-none bg-transparent cursor-pointer p-0 text-left mt-3 flex items-center gap-0.5"
              >
                Shop Deals <IconChevronRight className="w-3 h-3" />
              </button>
            </div>
            <img src="/specialist.png" alt="Deals of the Day" className="w-28 h-28 flex-shrink-0 object-contain group-hover:scale-105 transition-transform duration-300" />
          </div>

        </div>
      </div>

      {/* Main Directory Workspace */}
      <div className="flex-1 max-w-[97vw] w-full mx-auto px-4 py-8">

        {/* Dynamic products masonry grid */}
        <main id="healthcare-directory" className="flex-1 flex flex-col gap-6 text-left">
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
