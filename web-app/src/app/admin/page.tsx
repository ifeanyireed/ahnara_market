"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraInput } from "@/components/ahnara/AhnaraInput";
import {
  IconUserCheck,
  IconTruck,
  IconCoins,
  IconSettings,
  IconAlertTriangle,
  IconCheck
} from "@tabler/icons-react";

export default function AdminConsolePage() {
  const [activeSubTab, setActiveSubTab] = useState("vendors");
  
  // Pending vendors to vet
  const [vendors, setVendors] = useState([
    { id: "VND-881", name: "Ikoyi General Pharmacy", license: "PCN-4902-X", status: "Awaiting Vetting" },
    { id: "VND-882", name: "Lagos Biotech Diagnostics", license: "MLSCN-9028", status: "Vetted" }
  ]);

  // Courier dispatches
  const [shipments, setShipments] = useState([
    { id: "SHIP-01", orderId: "ORD-90281", destination: "Lekki Phase 1", rider: "Rider Aminu", temp: "4.5°C", status: "In Transit" },
    { id: "SHIP-02", orderId: "ORD-77215", destination: "Victoria Island", rider: "Unassigned", temp: "22.0°C", status: "Awaiting Dispatch" }
  ]);

  // Currencies / Settings
  const [currencyRate, setCurrencyRate] = useState("1600");
  const [govSubsidyMax, setGovSubsidyMax] = useState("3000");

  const handleApproveVendor = (id: string) => {
    setVendors(prev => prev.map(vnd => 
      vnd.id === id ? { ...vnd, status: "Vetted" } : vnd
    ));
    alert(`Vendor ${id} license successfully verified. Shop listings unlocked.`);
  };

  const handleSuspendVendor = (id: string) => {
    setVendors(prev => prev.map(vnd => 
      vnd.id === id ? { ...vnd, status: "Suspended" } : vnd
    ));
    alert(`Vendor ${id} has been suspended. Listings hidden from buyer search.`);
  };

  const handleAssignRider = (shipId: string, rider: string) => {
    setShipments(prev => prev.map(sh => 
      sh.id === shipId ? { ...sh, rider, status: "In Transit" } : sh
    ));
    alert(`Rider ${rider} assigned to shipment ${shipId}. Courier route active.`);
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

        <nav className="flex items-center gap-1 bg-[#DDEEF3]/60 p-1 rounded-2xl border border-slate-300/30">
          <Link href="/" className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-650 hover:text-slate-900 transition-all">Storefront</Link>
          <Link href="/buyer" className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-650 hover:text-slate-900 transition-all">Buyer Portal</Link>
          <Link href="/vendor" className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-650 hover:text-slate-900 transition-all">Vendor Hub</Link>
          <Link href="/admin" className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#1E293B]">Admin Desk</Link>
        </nav>

        <div className="flex items-center gap-3">
          <img src="/character1.jpg" className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs" />
          <div className="text-left hidden sm:block">
            <p className="font-bold text-sm text-slate-900 leading-none">System Admin</p>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Superuser Desk</span>
          </div>
        </div>
      </header>

      {/* CORE CONTENT */}
      <main className="max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
        
        {/* Subtabs Navigation */}
        <div className="flex items-center gap-1 bg-[#DDEEF3]/50 p-1 rounded-xl w-fit border border-slate-300/30">
          <button
            onClick={() => setActiveSubTab("vendors")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeSubTab === "vendors" ? "bg-[#1E293B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            Vetting Board
          </button>
          <button
            onClick={() => setActiveSubTab("shipment")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeSubTab === "shipment" ? "bg-[#1E293B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            Shipment Routing
          </button>
          <button
            onClick={() => setActiveSubTab("currency")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
              activeSubTab === "currency" ? "bg-[#1E293B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            Currency &amp; Rules
          </button>
        </div>

        {/* DETAILS */}
        
        {/* Tab 1: Vetting Board */}
        {activeSubTab === "vendors" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs">
            <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 mb-4">Vendor QA Approval Console</h3>
            
            <div className="flex flex-col gap-4">
              {vendors.map(vnd => {
                const isAwaiting = vnd.status === "Awaiting Vetting";
                return (
                  <div key={vnd.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-250">
                          {vnd.id}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                          vnd.status === "Vetted" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                          vnd.status === "Suspended" ? "bg-red-50 text-red-650 border-red-200" :
                          "bg-amber-50 text-amber-600 border-amber-200 animate-pulse"
                        }`}>
                          {vnd.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 mt-2">{vnd.name}</h4>
                      <span className="text-[10px] text-slate-450 font-bold block mt-1">Regulatory Code: {vnd.license}</span>
                    </div>

                    <div className="flex gap-2">
                      {isAwaiting && (
                        <AhnaraButton
                          size="sm"
                          onClick={() => handleApproveVendor(vnd.id)}
                          className="bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl border-none shadow-xs"
                        >
                          Approve Shop
                        </AhnaraButton>
                      )}
                      {vnd.status !== "Suspended" && (
                        <AhnaraButton
                          size="sm"
                          onClick={() => handleSuspendVendor(vnd.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl border-none shadow-xs"
                        >
                          Suspend Shop
                        </AhnaraButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Shipment Routing */}
        {activeSubTab === "shipment" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs">
            <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 mb-4">Courier Dispatch Board</h3>
            
            <div className="flex flex-col gap-4">
              {shipments.map(sh => {
                const isUnassigned = sh.rider === "Unassigned";
                return (
                  <div key={sh.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">
                          {sh.id}
                        </span>
                        <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-150 px-2 py-0.5 rounded">
                          Order Ref: {sh.orderId}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 mt-2">Destination: {sh.destination}</h4>
                      <span className="text-[10px] text-slate-450 font-bold block mt-1">
                        Active Rider: {sh.rider} • Temp Sensor: <strong className="text-slate-800">{sh.temp}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isUnassigned ? (
                        <select
                          onChange={(e) => handleAssignRider(sh.id, e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs outline-none font-semibold cursor-pointer"
                          defaultValue=""
                        >
                          <option value="" disabled>-- Assign Dispatch Rider --</option>
                          <option value="Rider Aminu">Rider Aminu (Ahnara Dispatch)</option>
                          <option value="Rider Joseph">Rider Joseph (Ahnara Dispatch)</option>
                        </select>
                      ) : (
                        <span className="text-xs font-black text-slate-500 flex items-center gap-1">
                          <IconCheck className="w-4 h-4 text-emerald-600" /> Active courier route
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Currency & Rules */}
        {activeSubTab === "currency" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs max-w-md">
            <h3 className="font-black text-base text-slate-900 mb-4">Market Operations Settings</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-[9px] font-black uppercase text-slate-400 mb-1">USD to NGN Exchange Rate</label>
                <AhnaraInput
                  type="number"
                  value={currencyRate}
                  onChange={(e) => setCurrencyRate(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] font-black uppercase text-slate-400 mb-1">Max Government Subsidy Cover (₦)</label>
                <AhnaraInput
                  type="number"
                  value={govSubsidyMax}
                  onChange={(e) => setGovSubsidyMax(e.target.value)}
                />
              </div>

              <AhnaraButton
                onClick={() => alert("Global configuration variables updated and flushed to central cache.")}
                className="bg-[#1E293B] text-white font-bold text-xs py-3 rounded-xl border-none mt-2"
              >
                Flush System Variables
              </AhnaraButton>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
