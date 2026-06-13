"use client";

import React from "react";

interface OwnerDashboardNavBarProps {
  activeTab: "overview" | "branches" | "corporate" | "financials" | "team";
  setActiveTab: (tab: "overview" | "branches" | "corporate" | "financials" | "team") => void;
}

export default function OwnerDashboardNavBar() {
  return (
    <header className="flex justify-between items-center h-16 px-8 w-full sticky top-0 z-40 bg-white border-b border-[#e2e8f0] shadow-sm">
      <div className="flex items-center gap-8">
        <span className="text-[24px] font-bold text-[#1e1b4b] tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-[#312e81] font-bold">corporate_fare</span>
          NextGenID <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 tracking-wider">Owner</span>
        </span>
        <div className="hidden md:flex items-center gap-6">
          <span
            className={`font-semibold text-[14px] cursor-pointer h-16 flex items-center border-b-2 transition-all duration-200`}
          >
            Executive Summary
          </span>
          <span
            
            className={`text-[#464652] text-[14px] font-medium hover:text-[#312e81] transition-colors duration-200 cursor-pointer h-16 flex items-center px-1`}
          >
            Branches
          </span>
          <span
           
            className={`text-[#464652] text-[14px] font-medium hover:text-[#312e81] transition-colors duration-200 cursor-pointer h-16 flex items-center px-1`}
          >
            Financials
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative group cursor-pointer p-2 rounded-full hover:bg-slate-50 text-[#464652] transition-colors duration-200">
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ba1a1a] border-2 border-white rounded-full"></span>
        </div>

        {/* Global Settings */}
        <span className="material-symbols-outlined text-[#464652] hover:bg-slate-50 p-2 rounded-full cursor-pointer transition-colors text-[24px]">
          admin_panel_settings
        </span>

        {/* Executive Profile */}
        <div className="flex items-center gap-3 ml-2 bg-slate-50 p-1 rounded-full px-3 border border-[#e2e8f0]">
          <div className="w-8 h-8 rounded-full bg-[#312e81] flex items-center justify-center text-white font-bold text-xs shadow-inner">
            MC
          </div>
          <span className="text-[13px] font-semibold hidden lg:block text-[#0b1c30]">
            Marcus CEO
          </span>
        </div>
      </div>
    </header>
  );
}
