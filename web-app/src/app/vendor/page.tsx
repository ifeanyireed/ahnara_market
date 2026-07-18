"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraInput } from "@/components/ahnara/AhnaraInput";
import {
  IconBox,
  IconCoins,
  IconPackage,
  IconPlus,
  IconTrash,
  IconCheck,
  IconClock
} from "@tabler/icons-react";

export default function VendorDashboardPage() {
  const [activeSubTab, setActiveSubTab] = useState("products");
  
  // Vendor-owned products
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form to add product
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Maternal Care");
  const [expiry, setExpiry] = useState("2027-06");

  // Orders to fulfill
  const [orders, setOrders] = useState([
    { id: "FORD-301", buyer: "Tyra Dhillon", item: "SMA Gold Infant Formula x2", total: 10400, status: "Awaiting Packing", date: "Today" },
    { id: "FORD-302", buyer: "Joseph Adenuga", item: "Pregnacare Plus Tablets x1", total: 2500, status: "Shipped", date: "Yesterday" }
  ]);

  const loadProducts = async () => {
    try {
      const data = await api.get("/marketplace/products");
      if (data && Array.isArray(data)) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          stock: p.inventoryCount,
          category: p.category,
          expiry: "2027-04"
        }));
        setProducts(mapped);
      }
    } catch (err) {
      console.warn("Failed to load products from API, using static fallback", err);
      setProducts([
        { id: "vprod-1", name: "Pregnacare Plus Tablets", price: 2500, stock: 45, category: "Maternal Care", expiry: "2027-04" },
        { id: "vprod-2", name: "SMA Gold Infant Formula", price: 5200, stock: 18, category: "Pediatrics", expiry: "2026-09" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!name || !price || !stock) return;

    try {
      await api.post("/marketplace/products", {
        name,
        description: `${name} - Licensed clinical quality product from verified pharmacy.`,
        price: String(price),
        category,
        inventoryCount: parseInt(stock)
      });

      alert(`Product "${name}" successfully registered in Hostinger DB!`);
      setName("");
      setPrice("");
      setStock("");
      loadProducts();
    } catch (err: any) {
      console.warn("API registration failed, adding locally", err);
      const newProd = {
        id: `vprod-${Date.now()}`,
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        expiry
      };
      setProducts([...products, newProd]);
      setName("");
      setPrice("");
      setStock("");
      alert("New product listing created locally (Mock Fallback).");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.delete(`/marketplace/products/${id}`);
      alert("Product successfully deleted from Hostinger DB!");
      loadProducts();
    } catch (err: any) {
      console.warn("API delete failed, removing locally", err);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleFulfill = (orderId: string) => {
    setOrders(prev => prev.map(ord => 
      ord.id === orderId 
        ? { ...ord, status: "Shipped" }
        : ord
    ));
    alert(`Order ${orderId} marked as Shipped. Handed over to Ahnara Courier.`);
  };

  return (
    <div className="min-h-screen bg-[#E8EFF4] text-[#0D090C] font-sans flex flex-col text-left">
      
      {/* NAVBAR */}
      <header className="px-8 py-5 flex items-center justify-between gap-4 bg-white/40 backdrop-blur-md border-b border-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4F475] flex items-center justify-center">
            <img src="/logo.png" alt="Ahnara Logo" className="w-7 h-7 object-contain" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 text-display">Ahnara Market</span>
        </div>

        <div className="flex items-center gap-3">
          <img src="/character4.jpg" className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs" />
          <div className="text-left hidden sm:block">
            <p className="font-bold text-sm text-slate-900 leading-none">Adeola Pharmacy</p>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Licensed Vendor</span>
          </div>
        </div>
      </header>

      {/* CORE CONTENT */}
      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
        
        {/* Navigation subtab capsule */}
        <div className="flex items-center gap-1 bg-[#DDEEF3]/50 p-1 rounded-xl w-fit border border-slate-300/30">
          <button
            onClick={() => setActiveSubTab("products")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeSubTab === "products" ? "bg-[#1E293B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            Manage Products
          </button>
          <button
            onClick={() => setActiveSubTab("pricing")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeSubTab === "pricing" ? "bg-[#1E293B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            Pricing &amp; Inventory
          </button>
          <button
            onClick={() => setActiveSubTab("fulfillment")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeSubTab === "fulfillment" ? "bg-[#1E293B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            Fulfillment Board
          </button>
        </div>

        {/* DETAILS */}
        
        {/* Tab 1: Products list */}
        {activeSubTab === "products" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Products catalog */}
            <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs">
              <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 mb-4">Your Product Listings</h3>
              
              <div className="flex flex-col gap-3">
                {products.map(prod => (
                  <div key={prod.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-150 px-2 py-0.5 rounded">
                        {prod.category}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 mt-2">{prod.name}</h4>
                      <span className="text-[10px] text-slate-450 font-bold block mt-1">₦{prod.price.toLocaleString()} • Stock: {prod.stock} units</span>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl border-none bg-transparent cursor-pointer"
                    >
                      <IconTrash className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs">
              <h3 className="font-black text-base text-slate-900 mb-4">List New Product</h3>
              
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-1">Product Title</label>
                  <AhnaraInput
                    placeholder="e.g. Diapers Pack"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs outline-none font-semibold cursor-pointer"
                  >
                    <option value="Maternal Care">Maternal Care</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Geriatrics">Geriatrics</option>
                    <option value="Diagnostic Scans">Diagnostic Scans</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label className="text-[9px] font-black uppercase text-slate-400 mb-1">Price (₦)</label>
                    <AhnaraInput
                      type="number"
                      placeholder="Price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[9px] font-black uppercase text-slate-400 mb-1">Stock</label>
                    <AhnaraInput
                      type="number"
                      placeholder="Qty"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>

                <AhnaraButton
                  onClick={handleAddProduct}
                  className="bg-[#1E293B] text-white font-bold text-xs py-2.5 rounded-xl border-none mt-2"
                >
                  Create Listing
                </AhnaraButton>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Pricing & Inventory */}
        {activeSubTab === "pricing" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs">
            <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 mb-4">Stock Ledger &amp; Expiration Monitor</h3>
            
            <div className="flex flex-col gap-3">
              {products.map(prod => (
                <div key={prod.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="text-left flex-1">
                    <h4 className="text-xs font-black text-slate-900">{prod.name}</h4>
                    <span className="text-[10px] text-slate-450 font-bold block mt-1">Expiry Date: <strong className="text-slate-700">{prod.expiry}</strong></span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col text-right">
                      <label className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">Price (₦)</label>
                      <input
                        type="number"
                        defaultValue={prod.price}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) prod.price = val;
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 w-24 text-xs font-bold outline-none text-slate-800 text-right"
                      />
                    </div>

                    <div className="flex flex-col text-right">
                      <label className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">Stock count</label>
                      <input
                        type="number"
                        defaultValue={prod.stock}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) prod.stock = val;
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 w-20 text-xs font-bold outline-none text-slate-800 text-right"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Order Fulfillment */}
        {activeSubTab === "fulfillment" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs">
            <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 mb-4">Fulfillment orders</h3>
            
            <div className="flex flex-col gap-4">
              {orders.map(ord => {
                const isAwaiting = ord.status === "Awaiting Packing";
                return (
                  <div key={ord.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black bg-purple-55 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                          {ord.id}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-lg border ${
                          isAwaiting ? "bg-amber-50 text-amber-600 border-amber-250 animate-pulse" : "bg-sky-50 text-sky-600 border-sky-250"
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 mt-2">{ord.item}</h4>
                      <span className="text-[10px] text-slate-450 font-bold block mt-1">Customer: {ord.buyer} • Date: {ord.date}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-900">₦{ord.total.toLocaleString()}</span>
                      {isAwaiting && (
                        <AhnaraButton
                          size="sm"
                          onClick={() => handleFulfill(ord.id)}
                          className="bg-emerald-650 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl border-none shadow-xs"
                        >
                          Ship Package
                        </AhnaraButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
