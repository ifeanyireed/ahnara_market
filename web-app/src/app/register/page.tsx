"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/ahnara/AuthContext";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraInput } from "@/components/ahnara/AhnaraInput";
import { IconUser, IconMail, IconLock, IconArrowRight } from "@tabler/icons-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mock registration fallback
      setTimeout(() => {
        setIsLoading(false);
        const role = email.toLowerCase().includes("kids") || email.toLowerCase().includes("pediatric") ? "KIDS" : "MAMA";
        login("mock-token-reg", {
          id: "mock-reg-id",
          email: email,
          name: name,
          role: role,
        });
        router.push("/onboarding");
      }, 1000);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Failed to register.");
    }
  };

  const handleQuickRegister = (role: "MAMA" | "KIDS") => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      const randomId = Math.floor(Math.random() * 1000);
      login("mock-token-quick-reg", {
        id: `mock-${randomId}`,
        email: role === "KIDS" ? `kids${randomId}@ahnara.com` : `mama${randomId}@ahnara.com`,
        name: role === "KIDS" ? "Jane Doe (Kids)" : "Jane Doe (Mama)",
        role: role,
      });
      router.push("/onboarding");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#E8EFF4] text-[#0D090C] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4F475]/30 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#0089C1]/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md z-10"
      >
        <AhnaraCard variant="flat" className="bg-white/80 backdrop-blur-md border border-slate-200/80 p-8 shadow-2xl rounded-3xl flex flex-col gap-6">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <Link href="/" className="flex items-center justify-center w-12 h-12 rounded-full bg-[#D4F475] shadow-sm mb-2 hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Ahnara Logo" className="w-8 h-8 object-contain" />
            </Link>
            <h2 className="text-2xl font-black tracking-tight text-slate-800 text-display">Create Account</h2>
            <p className="text-xs text-slate-400 font-semibold">Join Ahnara Health and begin your guided journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            <AhnaraInput
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              leftIcon={<IconUser className="w-5 h-5 text-slate-400" />}
            />

            <AhnaraInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<IconMail className="w-5 h-5 text-slate-400" />}
            />

            <AhnaraInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<IconLock className="w-5 h-5 text-slate-400" />}
            />

            <AhnaraInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              leftIcon={<IconLock className="w-5 h-5 text-slate-400" />}
            />

            <AhnaraButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-[#1E293B] text-white hover:bg-slate-800 rounded-xl mt-2"
              isLoading={isLoading}
              rightIcon={<IconArrowRight className="w-4 h-4" />}
            >
              Register
            </AhnaraButton>
          </form>

          {/* Quick Register Shortcuts */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center">Demo Quick Register</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRegister("MAMA")}
                className="py-3 px-2 bg-[#E8F3CE]/60 hover:bg-[#E8F3CE]/85 border border-[#CDE0A4]/45 rounded-xl text-[10px] font-black uppercase tracking-wider text-[#608216] transition-colors"
              >
                Maternal Reg
              </button>
              <button
                type="button"
                onClick={() => handleQuickRegister("KIDS")}
                className="py-3 px-2 bg-[#DDEEF3]/60 hover:bg-[#DDEEF3]/85 border border-sky-200/50 rounded-xl text-[10px] font-black uppercase tracking-wider text-[#0089C1] transition-colors"
              >
                Pediatric Reg
              </button>
            </div>
          </div>

          {/* Footnotes */}
          <div className="text-center mt-2">
            <span className="text-xs text-slate-400 font-semibold">
              Already have an account?{" "}
              <Link href="/login" className="text-[#0089C1] hover:underline font-bold">
                Sign In here
              </Link>
            </span>
          </div>

        </AhnaraCard>
      </motion.div>

    </div>
  );
}
