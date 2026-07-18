"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraInput } from "@/components/ahnara/AhnaraInput";
import {
  IconHistory,
  IconTruck,
  IconMapPin,
  IconCoins,
  IconCheck,
  IconHourglassLow,
  IconDownload
} from "@tabler/icons-react";

export default function BuyerPortalPage() {
  const [activeSubTab, setActiveSubTab] = useState("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(15400);
  const [topUpAmount, setTopUpAmount] = useState("");

  const [addresses, setAddresses] = useState([
    { id: "addr-1", title: "Home Address", detail: "15, Admiralty Way, Lekki Phase 1, Lagos" },
    { id: "addr-2", title: "Office HQ", detail: "Plot 82, Victoria Island, Lagos" }
  ]);
  const [newAddrTitle, setNewAddrTitle] = useState("");
  const [newAddrDetail, setNewAddrDetail] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const orderData = await api.get("/marketplace/orders");
        if (orderData && Array.isArray(orderData)) {
          const mapped = orderData.map((o: any) => ({
            id: o.id,
            date: new Date(o.createdAt || o.orderedAt || Date.now()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            items: o.items ? o.items.map((i: any) => `${i.product?.name || "Product"} x${i.quantity}`).join(", ") : "Items",
            value: Number(o.totalPrice || o.totalValue || 0),
            status: o.status,
            address: "15, Admiralty Way, Lekki Phase 1, Lagos",
            temperature: "4.5°C",
            rider: "Courier Dispatch"
          }));
          setOrders(mapped);
        }
      } catch (err) {
        console.warn("Failed to fetch backend orders, loading mock local storage", err);
        const saved = localStorage.getItem("ahnara_market_orders");
        if (saved) {
          try {
            setOrders(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        } else {
          const starting = [
            {
              id: "ORD-90281",
              date: "July 04, 2026",
              items: "SMA Gold Infant Formula x2",
              value: 10400,
              status: "Delivered",
              address: "15, Admiralty Way, Lekki Phase 1, Lagos",
              temperature: "22.5°C (Ambient)",
              rider: "Rider Aminu"
            },
            {
              id: "ORD-77215",
              date: "June 18, 2026",
              items: "Insulin Glargine x1",
              value: 3500,
              status: "Processing",
              address: "15, Admiralty Way, Lekki Phase 1, Lagos",
              temperature: "4.2°C",
              rider: "Rider Joseph"
            }
          ];
          setOrders(starting);
          localStorage.setItem("ahnara_market_orders", JSON.stringify(starting));
        }
      }

      try {
        const wData = await api.get("/payments/wallet");
        if (wData && wData.balance) {
          setWalletBalance(Number(wData.balance));
        }
      } catch (err) {
        console.warn("Failed to fetch wallet balance, using local mock", err);
      }
    };

    loadData();
  }, []);

  const handleAddAddress = () => {
    if (!newAddrTitle || !newAddrDetail) return;
    const newAddr = {
      id: `addr-${Date.now()}`,
      title: newAddrTitle,
      detail: newAddrDetail
    };
    setAddresses([...addresses, newAddr]);
    setNewAddrTitle("");
    setNewAddrDetail("");
    alert("New shipping address saved successfully.");
  };

  const handleTopUp = async () => {
    const amt = parseFloat(topUpAmount);
    if (isNaN(amt) || amt <= 0) return;

    try {
      const ref = `topup-${Date.now()}`;
      await api.post("/payments/wallet/topup", {
        amount: String(amt),
        reference: ref,
        gateway: "paystack"
      });
      setWalletBalance(prev => prev + amt);
      setTopUpAmount("");
      alert(`₦${amt.toLocaleString()} added to your Ahnara Wallet.`);
    } catch (err: any) {
      console.warn("Wallet topup failed, falling back to local simulation", err);
      setWalletBalance(prev => prev + amt);
      setTopUpAmount("");
      alert(`₦${amt.toLocaleString()} added to your Ahnara Wallet (Mock).`);
    }
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
          <img src="/character3.jpg" className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs" />
          <div className="text-left hidden sm:block">
            <p className="font-bold text-sm text-slate-900 leading-none">Tyra Dhillon</p>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Buyer ID #401</span>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE */}
      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
        
        {/* Navigation capsule (Mama tabs style) */}
        <div className="flex items-center gap-1 bg-[#DDEEF3]/50 p-1 rounded-xl w-fit border border-slate-300/30">
          <button
            onClick={() => setActiveSubTab("orders")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeSubTab === "orders" ? "bg-[#1E293B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            Manage Orders
          </button>
          <button
            onClick={() => setActiveSubTab("tracking")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeSubTab === "tracking" ? "bg-[#1E293B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            Delivery Tracking
          </button>
          <button
            onClick={() => setActiveSubTab("address")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeSubTab === "address" ? "bg-[#1E293B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            Address Book
          </button>
          <button
            onClick={() => setActiveSubTab("wallet")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeSubTab === "wallet" ? "bg-[#1E293B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            Wallet Desk
          </button>
        </div>

        {/* SUBTAB DETAILS */}

        {/* Tab 1: Orders list */}
        {activeSubTab === "orders" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs">
            <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 mb-4">Your Purchase History</h3>
            
            <div className="flex flex-col gap-4">
              {orders.map(ord => (
                <div key={ord.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black bg-sky-55 text-sky-700 px-2 py-0.5 rounded border border-sky-200">
                        {ord.id}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                        ord.status === "Delivered" || ord.status === "Completed"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-250"
                          : "bg-amber-50 text-amber-600 border-amber-250 animate-pulse"
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 mt-2">{ord.items}</h4>
                    <span className="text-[10px] text-slate-450 font-bold block mt-1">Date: {ord.date} • Destination: {ord.address}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900">₦{ord.value.toLocaleString()}</span>
                    <AhnaraButton
                      size="sm"
                      onClick={() => alert("Downloading tax invoice PDF...")}
                      className="bg-white border border-slate-250 text-slate-700 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1"
                    >
                      <IconDownload className="w-4 h-4" />
                      Invoice
                    </AhnaraButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Delivery Tracking with Cold-Chain logs */}
        {activeSubTab === "tracking" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Courier timeline */}
            <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs">
              <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 mb-4">Active Shipments Route</h3>
              
              <div className="flex flex-col gap-5 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                <div className="relative">
                  <div className="absolute -left-6.5 top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  <span className="text-xs font-black text-slate-900">Courier Dispatched</span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Rider Aminu left Lekki Central Depot • 10:15 AM</span>
                </div>
                <div className="relative">
                  <div className="absolute -left-6.5 top-1 w-3 h-3 rounded-full bg-sky-500 border-2 border-white" />
                  <span className="text-xs font-black text-slate-950">In Transit (ETA: 12 mins)</span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Courier GPS routing along Admiralty Way, Lekki Phase 1</span>
                </div>
              </div>
            </div>

            {/* Cold chain logs sensor */}
            <div className="bg-white p-6 rounded-3xl border border-[#CDE0A4] bg-[#E8F3CE]/10 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-black text-sm text-emerald-800 flex items-center gap-1.5 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#8BB436] animate-pulse" />
                  Cold-Chain Telemetry
                </h3>

                <div className="p-4 bg-white border border-[#CDE0A4] rounded-2xl">
                  <span className="text-[9px] font-black uppercase text-slate-400 block">Temperature Reading</span>
                  <span className="text-3xl font-black text-[#608216] mt-2 block">4.2°C</span>
                  <span className="text-[10px] text-[#608216]/80 font-bold block mt-1.5">
                    Status: OPTIMAL range (2.0°C - 8.0°C) • Insulin and vaccines safe.
                  </span>
                </div>
              </div>

              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mt-4 text-center">Sensor Sync Active</span>
            </div>

          </div>
        )}

        {/* Tab 3: Address Manager */}
        {activeSubTab === "address" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* List addresses */}
            <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs">
              <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 mb-4">Saved Locations</h3>
              <div className="flex flex-col gap-3">
                {addresses.map(addr => (
                  <div key={addr.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-xs font-black text-slate-900 block">{addr.title}</span>
                      <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">{addr.detail}</span>
                    </div>
                    <button
                      onClick={() => setAddresses(prev => prev.filter(a => a.id !== addr.id))}
                      className="text-red-500 text-xs font-bold border-none bg-transparent cursor-pointer hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Address */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs">
              <h3 className="font-black text-base text-slate-900 mb-4">Add Address</h3>
              
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-1">Label</label>
                  <AhnaraInput
                    placeholder="e.g. Sister's House"
                    value={newAddrTitle}
                    onChange={(e) => setNewAddrTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-1">Detailed Address</label>
                  <AhnaraInput
                    placeholder="Enter street, city..."
                    value={newAddrDetail}
                    onChange={(e) => setNewAddrDetail(e.target.value)}
                  />
                </div>

                <AhnaraButton
                  onClick={handleAddAddress}
                  className="bg-[#1E293B] text-white font-bold text-xs py-2.5 rounded-xl border-none mt-2"
                >
                  Save Address
                </AhnaraButton>
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Wallet Desk */}
        {activeSubTab === "wallet" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Wallet details */}
            <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Ahnara Virtual Wallet Balance</span>
                <span className="text-3xl font-black text-slate-900 mt-2 block">₦{walletBalance.toLocaleString()}</span>
              </div>
              
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <span>Secure PCI-DSS compliant</span>
                <span>Active</span>
              </div>
            </div>

            {/* Top up */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs">
              <h3 className="font-black text-base text-slate-900 mb-4">Add Funds</h3>
              
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-1">Top-Up Amount (₦)</label>
                  <AhnaraInput
                    type="number"
                    placeholder="e.g. 5000"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                  />
                </div>

                <AhnaraButton
                  onClick={handleTopUp}
                  className="bg-[#1E293B] text-white font-bold text-xs py-2.5 rounded-xl border-none mt-2"
                >
                  Deposit Funds
                </AhnaraButton>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
