"use client";

import React, { useState, useEffect } from "react";
import SalesDashboardNavBar from "@/app/components/sales/navbar";
import SalesDashboardSideBar from "@/app/components/sales/sidebar";
import SalesDashboardContent from "./page";
import { useRouter } from "next/navigation";

export interface PersonalLead {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: "Discovery" | "Proposal" | "Negotiation" | "Closed";
}

export interface PersonalTransaction {
  id: string;
  client: string;
  value: number;
  timeString: string;
}

export default function SalesDashboardLayout() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"performance" | "leads" | "deals" | "commission">("performance");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionStr = localStorage.getItem("userSession");
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          if (session && session.isLoggedIn && session.email === "nextgendepok@179") {
            setIsAuthenticated(true);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      localStorage.removeItem("userSession");
      router.push("/dashboard/auth/login");
    }
  }, [router]);

  // Agent Performance states
  const [leads] = useState<PersonalLead[]>([
    { id: "l1", name: "Robert Downey", company: "Stark Industries", value: 120000, stage: "Proposal" },
    { id: "l2", name: "Steve Rogers", company: "Shield Corp", value: 85000, stage: "Negotiation" },
    { id: "l3", name: "Bruce Banner", company: "Gamma Lab Inc", value: 45000, stage: "Discovery" },
    { id: "l4", name: "Natasha Romanoff", company: "Red Room Tech", value: 160000, stage: "Closed" }
  ]);

  const [transactions] = useState<PersonalTransaction[]>([
    { id: "pt1", client: "Acme Enterprise Licenses", value: 12400, timeString: "2 mins ago" },
    { id: "pt2", client: "Creative Studio - basic plans", value: 850, timeString: "3 hours ago" },
    { id: "pt3", client: "Individual - Monthly Subscriptions", value: 1500, timeString: "1 day ago" }
  ]);

  // Calculations
  const totalClosedValue = 452000; // Mock Base + Transactions
  const personalDealsCount = 24;
  const commissionRate = 0.05; // 5% commission
  const commissionEarned = totalClosedValue * commissionRate;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Checking authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcff] text-[#0b1c30] min-h-screen flex flex-col font-sans transition-all duration-300">
      {/* Top Navbar */}
      <SalesDashboardNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <SalesDashboardSideBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Agent Performance Content */}
        <SalesDashboardContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          leads={leads}
          transactions={transactions}
          totalClosedValue={totalClosedValue}
          personalDealsCount={personalDealsCount}
          commissionEarned={commissionEarned}
        />
      </div>
    </div>
  );
}
