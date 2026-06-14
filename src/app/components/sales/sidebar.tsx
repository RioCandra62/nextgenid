"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface SalesDashboardSideBarProps {
  activeTab: "performance" | "leads" | "deals" | "commission";
  setActiveTab: (tab: "performance" | "leads" | "deals" | "commission") => void;
}

export default function SalesDashboardSideBar({
  activeTab,
  setActiveTab,
}: SalesDashboardSideBarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userSession");
    document.cookie = "better-auth.session-token=; path=/; max-age=0; SameSite=Lax";
    router.push("/dashboard");
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] flex flex-col py-6 w-64 z-30 bg-[#f7f7fc] border-r border-[#e2e8f0] hidden md:flex transition-colors duration-300">
      <nav className="flex-1 space-y-1 px-3">
        <div
          onClick={() => setActiveTab("performance")}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            activeTab === "performance"
              ? "bg-[#1d4ed8] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#1d4ed8] hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined">trending_up</span>
          <span className="text-[13px] font-semibold">My Performance</span>
        </div>

        <div
          onClick={() => setActiveTab("leads")}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            activeTab === "leads"
              ? "bg-[#1d4ed8] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#1d4ed8] hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined">contact_page</span>
          <span className="text-[13px] font-semibold">My Leads</span>
        </div>

        <div
          onClick={() => setActiveTab("deals")}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            activeTab === "deals"
              ? "bg-[#1d4ed8] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#1d4ed8] hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined">handshake</span>
          <span className="text-[13px] font-semibold">My Deals</span>
        </div>

        <div
          onClick={() => setActiveTab("commission")}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            activeTab === "commission"
              ? "bg-[#1d4ed8] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#1d4ed8] hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined">calculate</span>
          <span className="text-[13px] font-semibold">Commission Calc</span>
        </div>
      </nav>

      <div className="mt-auto border-t border-[#e2e8f0] pt-4 px-3">
        <div
          onClick={() => alert("Connecting to Support line...")}
          className="flex items-center gap-3 text-[#464652] px-4 py-3 rounded-lg hover:bg-slate-200/60 cursor-pointer transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">support_agent</span>
          <span className="text-[13px] font-semibold">Agent Support</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 text-[#ba1a1a] px-4 py-3 rounded-lg hover:bg-red-50 hover:text-[#93000a] cursor-pointer transition-all active:scale-95 border-0"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-[13px] font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
