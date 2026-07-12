"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/ahnara/AuthContext";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraInput } from "@/components/ahnara/AhnaraInput";
import { IconLock, IconMail, IconArrowRight, IconUser, IconBuildingStore } from "@tabler/icons-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const determineRedirectPath = (userRole: string, userEmail: string) => {
    const roleUpper = userRole.toUpperCase();
    const emailLower = userEmail.toLowerCase();
    
    if (roleUpper === "ADMIN" || emailLower.includes("admin")) {
      return "/admin";
    } else if (roleUpper === "VENDOR" || roleUpper === "PHARMACIST" || emailLower.includes("vendor") || emailLower.includes("pharmacist")) {
      return "/vendor";
    } else {
      return "/buyer";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setTimeout(() => {
        setIsLoading(false);
        
        let detectedRole = "BUYER";
        if (email.toLowerCase().includes("admin")) {
          detectedRole = "ADMIN";
        } else if (email.toLowerCase().includes("vendor") || email.toLowerCase().includes("pharmacist")) {
          detectedRole = "VENDOR";
        }

        const mockToken = detectedRole === "ADMIN" 
          ? "mock-token-admin" 
          : detectedRole === "VENDOR" 
          ? "mock-token-vendor" 
          : "mock-token-buyer";

        login(mockToken, {
          id: `mock-${detectedRole.toLowerCase()}-id`,
          email: email,
          name: detectedRole === "ADMIN" ? "System Admin" : detectedRole === "VENDOR" ? "Adeola Pharmacy" : "Tyra Dhillon",
          role: detectedRole,
        });

        // Save mock onboarding profiles for the storefront dashboard to consume
        localStorage.setItem("provider_onboarding_data", JSON.stringify({
          practitionerName: detectedRole === "ADMIN" ? "System Admin" : detectedRole === "VENDOR" ? "Adeola Pharmacy" : "Tyra Dhillon",
          role: detectedRole,
          facilityName: "Lekki Care Hub",
          specialty: detectedRole === "ADMIN" ? "Administrator" : detectedRole === "VENDOR" ? "Pharmacist" : "Client"
        }));

        const destPath = determineRedirectPath(detectedRole, email);
        router.push(destPath);
      }, 1000);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Invalid credentials.");
    }
  };

  const handleQuickLogin = (role: "BUYER" | "VENDOR" | "ADMIN") => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      const email = role === "ADMIN" 
        ? "admin@ahnara.com" 
        : role === "VENDOR" 
        ? "vendor@ahnara.com" 
        : "buyer@ahnara.com";

      login(`mock-token-${role.toLowerCase()}`, {
        id: `mock-${role.toLowerCase()}-id`,
        email: email,
        name: role === "ADMIN" ? "System Admin" : role === "VENDOR" ? "Adeola Pharmacy" : "Tyra Dhillon",
        role: role,
      });

      localStorage.setItem("provider_onboarding_data", JSON.stringify({
        practitionerName: role === "ADMIN" ? "System Admin" : role === "VENDOR" ? "Adeola Pharmacy" : "Tyra Dhillon",
        role: role,
        facilityName: "Lekki Care Hub",
        specialty: role === "ADMIN" ? "Administrator" : role === "VENDOR" ? "Pharmacist" : "Client"
      }));

      const destPath = determineRedirectPath(role, email);
      router.push(destPath);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#E8EFF4] text-[#0D090C] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4F475]/30 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#0089C1]/10 rounded-full filter blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md z-10"
      >
        <AhnaraCard variant="flat" className="bg-white/80 backdrop-blur-md border border-slate-200/80 p-8 shadow-2xl rounded-3xl flex flex-col gap-6">
          
          <div className="flex flex-col items-center text-center gap-2">
            <Link href="/" className="flex items-center justify-center w-12 h-12 rounded-full bg-[#D4F475] shadow-sm mb-2 hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Ahnara Logo" className="w-8 h-8 object-contain" />
            </Link>
            <h2 className="text-2xl font-black tracking-tight text-slate-800 text-display text-left">Market Login</h2>
            <p className="text-xs text-slate-400 font-semibold text-left">Access your buyer, seller, or admin portal</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            <AhnaraInput
              label="Email Address"
              type="email"
              placeholder="e.g. buyer@ahnara.com, vendor@ahnara.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <AhnaraInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <AhnaraButton
              type="submit"
              disabled={isLoading}
              className="bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl w-full border-none shadow-sm flex items-center justify-center gap-1.5 mt-2"
            >
              {isLoading ? "Authenticating..." : "Login to Console"}
              <IconArrowRight className="w-4 h-4" />
            </AhnaraButton>
          </form>

          <div className="flex items-center my-2 text-slate-300">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[10px] font-black uppercase text-slate-400 mx-3">Quick Profile Login</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin("BUYER")}
              className="px-2 py-3 bg-sky-50 border border-sky-100 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-black text-sky-700 hover:bg-sky-100/50 transition-colors cursor-pointer"
            >
              <IconUser className="w-5 h-5 text-sky-500" />
              Buyer
            </button>
            <button
              onClick={() => handleQuickLogin("VENDOR")}
              className="px-2 py-3 bg-purple-50 border border-purple-100 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-black text-purple-700 hover:bg-purple-100/50 transition-colors cursor-pointer"
            >
              <IconBuildingStore className="w-5 h-5 text-purple-500" />
              Vendor
            </button>
            <button
              onClick={() => handleQuickLogin("ADMIN")}
              className="px-2 py-3 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-black text-amber-700 hover:bg-amber-100/50 transition-colors cursor-pointer"
            >
              <IconLock className="w-5 h-5 text-amber-500" />
              Admin
            </button>
          </div>

        </AhnaraCard>
      </motion.div>

    </div>
  );
}
