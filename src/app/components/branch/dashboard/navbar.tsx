"use client";

import React from "react";

interface BranchDashboardNavBarProps {
  activeTab: "dashboard" | "leads" | "opportunities" | "accounts" | "reports" | "team";
  setActiveTab: (tab: "dashboard" | "leads" | "opportunities" | "accounts" | "reports" | "team") => void;
}

export default function BranchDashboardNavBar({
  activeTab,
  setActiveTab,
}: BranchDashboardNavBarProps) {
    return(
              <header className="flex justify-between items-center h-16 px-8 w-full sticky top-0 z-40 bg-white border-b border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-8">
          <span className="text-[24px] font-bold text-[#15157d] tracking-tight">
            SalesStream
          </span>
          <div className="hidden md:flex items-center gap-6">
            <span
              onClick={() => setActiveTab("dashboard")}
              className={`font-semibold text-[14px] cursor-pointer h-16 flex items-center border-b-2 transition-all duration-200 ${
                activeTab === "dashboard"
                  ? "text-[#15157d] border-[#15157d]"
                  : "text-[#464652] border-transparent hover:text-[#15157d]"
              }`}
            >
              Dashboard
            </span>
            <span
              onClick={() => {
                setActiveTab("leads");
              }}
              className={`text-[#464652] text-[14px] font-medium hover:text-[#15157d] transition-colors duration-200 cursor-pointer h-16 flex items-center px-1 ${
                activeTab === "leads" ? "text-[#15157d] font-bold" : ""
              }`}
            >
              Analytics
            </span>
            <span
              onClick={() => {
                setActiveTab("opportunities");
              }}
              className={`text-[#464652] text-[14px] font-medium hover:text-[#15157d] transition-colors duration-200 cursor-pointer h-16 flex items-center px-1 ${
                activeTab === "opportunities" ? "text-[#15157d] font-bold" : ""
              }`}
            >
              Forecast
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div
            className="relative group cursor-pointer p-2 rounded-full hover:bg-slate-50 text-[#464652] transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ba1a1a] border-2 border-white rounded-full"></span>
          </div>

          {/* Settings */}
          <span
            className="material-symbols-outlined text-[#464652] hover:bg-slate-50 p-2 rounded-full cursor-pointer transition-colors text-[24px]"
          >
            settings
          </span>

          {/* User profile */}
          <div className="flex items-center gap-3 ml-2 bg-slate-50 p-1 rounded-full px-3 border border-[#e2e8f0]">
            <div className="w-8 h-8 rounded-full bg-[#2e3192] flex items-center justify-center text-white font-bold text-xs shadow-inner">
              AM
            </div>
            <span className="text-[13px] font-semibold hidden lg:block text-[#0b1c30]">
              Alex Miller
            </span>
          </div>
        </div>
      </header>
    )
}