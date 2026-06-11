"use client";

import React from "react";

interface SalesDashboardNavBarProps {
  activeTab: "performance" | "leads" | "deals" | "commission";
  setActiveTab: (tab: "performance" | "leads" | "deals" | "commission") => void;
}

export default function SalesDashboardNavBar({
  activeTab,
  setActiveTab,
}: SalesDashboardNavBarProps) {
  return (
    <header className="flex justify-between items-center h-16 px-8 w-full sticky top-0 z-40 bg-white border-b border-[#e2e8f0] shadow-sm">
      <div className="flex items-center gap-8">
        <span className="text-[24px] font-bold text-[#1d4ed8] tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1d4ed8] font-bold">badge</span>
          SalesStream <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-700 tracking-wider">Sales Agent</span>
        </span>
        <div className="hidden md:flex items-center gap-6">
          <span
            onClick={() => setActiveTab("performance")}
            className={`font-semibold text-[14px] cursor-pointer h-16 flex items-center border-b-2 transition-all duration-200 ${
              activeTab === "performance"
                ? "text-[#1d4ed8] border-[#1d4ed8]"
                : "text-[#464652] border-transparent hover:text-[#1d4ed8]"
            }`}
          >
            My Performance
          </span>
          <span
            onClick={() => setActiveTab("leads")}
            className={`text-[#464652] text-[14px] font-medium hover:text-[#1d4ed8] transition-colors duration-200 cursor-pointer h-16 flex items-center px-1 ${
              activeTab === "leads" ? "text-[#1d4ed8] font-bold" : ""
            }`}
          >
            My Leads
          </span>
          <span
            onClick={() => setActiveTab("deals")}
            className={`text-[#464652] text-[14px] font-medium hover:text-[#1d4ed8] transition-colors duration-200 cursor-pointer h-16 flex items-center px-1 ${
              activeTab === "deals" ? "text-[#1d4ed8] font-bold" : ""
            }`}
          >
            Deals
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative group cursor-pointer p-2 rounded-full hover:bg-slate-50 text-[#464652] transition-colors duration-200">
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ba1a1a] border-2 border-white rounded-full"></span>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 ml-2 bg-slate-50 p-1 rounded-full px-3 border border-[#e2e8f0]">
          <div className="w-8 h-8 rounded-full bg-[#1d4ed8] flex items-center justify-center text-white font-bold text-xs shadow-inner">
            SJ
          </div>
          <span className="text-[13px] font-semibold hidden lg:block text-[#0b1c30]">
            Sarah Jenkins
          </span>
        </div>
      </div>
    </header>
  );
}
