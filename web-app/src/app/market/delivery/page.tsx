"use client";

import React from "react";
import Link from "next/link";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import {
  IconArrowLeft,
  IconTruck,
  IconMapPin,
  IconClock,
  IconDeviceHeartMonitor
} from "@tabler/icons-react";

export default function DeliveryRoutingPage() {
  return (
    <div className="min-h-screen bg-[#E8EFF4] text-[#0D090C] font-sans flex flex-col text-left">
      
      {/* NAVBAR */}
      <header className="px-8 py-5 border-b border-slate-200/50 bg-white/40 backdrop-blur-md flex items-center justify-between">
        <Link href="/market" className="flex items-center gap-1 text-xs font-black text-slate-700 hover:text-slate-955 transition-all">
          <IconArrowLeft className="w-4 h-4" />
          Return to Store
        </Link>
        <span className="font-extrabold text-sm tracking-tight text-slate-900 uppercase">Delivery Dispatch Tracker</span>
        <div className="w-16" />
      </header>

      <main className="max-w-4xl w-full mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Columns: GPS Routing Map */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs">
            <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 mb-4">Courier Route Tracking</h3>
            
            <div className="bg-slate-200 rounded-2xl h-64 border border-slate-300 flex items-center justify-center relative overflow-hidden mb-4">
              <span className="text-slate-650 text-xs font-bold flex items-center gap-1 z-10">
                <IconMapPin className="w-5 h-5 text-red-500 animate-bounce" />
                GPS map pins active (Lekki Phase 1 route)
              </span>
            </div>

            <div className="flex flex-col gap-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              <div className="relative">
                <div className="absolute -left-6.5 top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                <span className="text-xs font-black text-slate-900">Courier Dispatched</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Rider Aminu left Lekki Central Depot • 10:15 AM</span>
              </div>
              <div className="relative">
                <div className="absolute -left-6.5 top-1 w-3 h-3 rounded-full bg-sky-500 border-2 border-white" />
                <span className="text-xs font-black text-slate-950">In Transit (ETA: 12 mins)</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Courier GPS routing along Admiralty Way</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Cold Chain Monitor */}
        <div className="flex flex-col gap-4">
          <div className="bg-white p-6 rounded-3xl border border-[#CDE0A4] bg-[#E8F3CE]/10 shadow-xs flex flex-col justify-between min-h-[200px]">
            <div>
              <h3 className="font-black text-sm text-[#608216] flex items-center gap-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#8BB436] animate-pulse" />
                Cold-Chain Telemetry
              </h3>

              <div className="p-4 bg-white border border-[#CDE0A4] rounded-2xl">
                <span className="text-[9px] font-black uppercase text-slate-400 block">Temperature Reading</span>
                <span className="text-3xl font-black text-[#608216] mt-2 block">4.2°C</span>
                <span className="text-[10px] text-[#608216]/80 font-bold block mt-1.5 leading-normal">
                  Status: OPTIMAL range (2.0°C - 8.0°C) • Insulin and vaccines safe.
                </span>
              </div>
            </div>

            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mt-4 text-center">Sensor Sync Active</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[9px] font-black uppercase text-slate-400 block">Estimated Arrival</span>
              <span className="text-xl font-black text-slate-900 mt-2 block">10:42 AM</span>
            </div>
            <IconClock className="w-8 h-8 text-sky-500" />
          </div>
        </div>

      </main>

    </div>
  );
}
