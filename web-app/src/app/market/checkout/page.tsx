"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraInput } from "@/components/ahnara/AhnaraInput";
import {
  IconArrowLeft,
  IconReceipt,
  IconMapPin,
  IconDiscount2,
  IconCreditCard,
  IconCoins
} from "@tabler/icons-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [address, setAddress] = useState("15, Admiralty Way, Lekki Phase 1, Lagos");
  const [paymentMethod, setPaymentMethod] = useState("Card");

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

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  };
  const getGovSubsidy = () => {
    return isVoucherApplied ? Math.min(getSubtotal(), 3000) : 0;
  };
  const getEmployerCredit = () => {
    return getSubtotal() > 0 ? 1500 : 0;
  };
  const getFinalBalance = () => {
    return Math.max(0, getSubtotal() - getGovSubsidy() - getEmployerCredit());
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    try {
      const itemsPayload = cart.map(item => ({
        product_id: item.product.id,
        quantity: item.qty
      }));

      // Call API gateway to place order
      const apiOrder = await api.post("/marketplace/orders", {
        items: itemsPayload
      });

      // Clear cart
      localStorage.removeItem("ahnara_market_cart");

      alert(`Order ${apiOrder.id} successfully placed! Routing you to delivery progress...`);
      router.push("/buyer"); // Route to buyer dashboard to see purchase history
      return;
    } catch (err: any) {
      console.warn("Real order placement failed, falling back to mock storage", err);
    }

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      items: cart.map(item => `${item.product.name} x${item.qty}`).join(", "),
      value: getFinalBalance(),
      status: "Processing",
      address: address,
      temperature: "4.5°C",
      rider: "Rider Aminu"
    };

    const savedOrders = localStorage.getItem("ahnara_market_orders");
    let ordersList = [];
    if (savedOrders) {
      try {
        ordersList = JSON.parse(savedOrders);
      } catch (e) {
        console.error(e);
      }
    }
    ordersList.unshift(newOrder);
    localStorage.setItem("ahnara_market_orders", JSON.stringify(ordersList));

    // Clear cart
    localStorage.removeItem("ahnara_market_cart");

    alert(`Order ${orderId} successfully placed (Mock)! Routing you to delivery progress...`);
    router.push("/buyer"); // Route to buyer dashboard
  };

  return (
    <div className="min-h-screen bg-[#E8EFF4] text-[#0D090C] font-sans flex flex-col text-left">
      
      {/* NAVBAR */}
      <header className="px-8 py-5 border-b border-slate-200/50 bg-white/40 backdrop-blur-md flex items-center justify-between">
        <Link href="/market/cart" className="flex items-center gap-1 text-xs font-black text-slate-700 hover:text-slate-955 transition-all">
          <IconArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
        <span className="font-extrabold text-sm tracking-tight text-slate-900 uppercase">Checkout Invoice</span>
        <div className="w-16" />
      </header>

      {/* CORE */}
      <main className="max-w-4xl w-full mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Columns: Address & Payment */}
        <div className="md:col-span-2 flex flex-col gap-4">
          
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col gap-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <IconMapPin className="w-4.5 h-4.5 text-slate-500" />
              Delivery Location
            </h3>
            
            <div className="flex flex-col">
              <label className="text-[9px] font-black uppercase text-slate-400 mb-1">Destination Address</label>
              <AhnaraInput
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter detailed shipping destination..."
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col gap-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <IconCreditCard className="w-4.5 h-4.5 text-slate-500" />
              Payment Selection
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod("Card")}
                className={`p-4 rounded-2xl border font-bold text-xs flex flex-col gap-2 text-left cursor-pointer transition-all ${
                  paymentMethod === "Card" ? "border-[#8BB436] bg-[#E8F3CE]/20 text-[#608216]" : "border-slate-200 hover:bg-slate-50 text-slate-650"
                }`}
              >
                <IconCreditCard className="w-5 h-5" />
                Credit/Debit Card
              </button>
              <button
                onClick={() => setPaymentMethod("Wallet")}
                className={`p-4 rounded-2xl border font-bold text-xs flex flex-col gap-2 text-left cursor-pointer transition-all ${
                  paymentMethod === "Wallet" ? "border-[#8BB436] bg-[#E8F3CE]/20 text-[#608216]" : "border-slate-200 hover:bg-slate-50 text-slate-650"
                }`}
              >
                <IconCoins className="w-5 h-5" />
                Ahnara Wallet
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Invoice summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-4">
              <IconReceipt className="w-4.5 h-4.5 text-slate-500" />
              Invoice Summary
            </h3>

            <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto mb-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between text-xs font-semibold text-slate-600">
                  <span className="line-clamp-1">{item.product.name} x{item.qty}</span>
                  <span className="flex-shrink-0">₦{(item.product.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Subtotal</span>
                <span>₦{getSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Employer credit</span>
                <span className="text-emerald-700">- ₦{getEmployerCredit().toLocaleString()}</span>
              </div>
              {isVoucherApplied && (
                <div className="flex justify-between text-xs font-semibold text-[#8BB436]">
                  <span>Gov subsidy</span>
                  <span>- ₦{getGovSubsidy().toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-slate-150 pt-3 flex justify-between items-center mt-1">
                <span className="text-xs font-black text-slate-950">Total Balance</span>
                <span className="text-base font-black text-slate-950">₦{getFinalBalance().toLocaleString()}</span>
              </div>
            </div>

            {/* Voucher code */}
            <div className="mt-6 flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <IconDiscount2 className="w-4 h-4 text-slate-500" />
                Promo / Voucher Code
              </label>
              <div className="flex gap-2">
                <AhnaraInput
                  placeholder="e.g. GOV-MAMA20"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <AhnaraButton
                  onClick={() => {
                    if (voucherCode.toLowerCase() === "gov-mama20") {
                      setIsVoucherApplied(true);
                      alert("Government Maternity Voucher applied! Subtotal updated.");
                    } else {
                      alert("Invalid Voucher code. Try GOV-MAMA20");
                    }
                  }}
                  className="bg-[#1E293B] text-white px-3 font-bold text-xs rounded-xl"
                >
                  Apply
                </AhnaraButton>
              </div>
            </div>
          </div>

          <AhnaraButton
            onClick={handlePlaceOrder}
            disabled={cart.length === 0}
            className="bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl w-full border-none shadow-xs mt-6"
          >
            Authorize Payment
          </AhnaraButton>
        </div>

      </main>

    </div>
  );
}
