"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface BranchDashboardSideBarProps {
  activeTab:
    | "dashboard"
    | "leads"
    | "opportunities"
    | "accounts"
    | "reports"
    | "team";
  setActiveTab: (
    tab:
      | "dashboard"
      | "leads"
      | "opportunities"
      | "accounts"
      | "reports"
      | "team",
  ) => void;
}

export default function BranchDashboardSideBar({
  activeTab,
  setActiveTab,
}: BranchDashboardSideBarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] flex flex-col py-6 w-64 z-30 bg-[#f0f4fa] border-r border-[#e2e8f0] hidden md:flex transition-colors duration-300">
      <nav className="flex-1 space-y-1 px-3">
        <div
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            activeTab === "dashboard"
              ? "bg-[#15157d] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#15157d] hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[13px] font-semibold">Dashboard</span>
        </div>

        <div
          onClick={() => {
            setActiveTab("leads");
          }}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            activeTab === "leads"
              ? "bg-[#15157d] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#15157d] hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined">person_search</span>
          <span className="text-[13px] font-semibold">Leads</span>
        </div>

        <div
          onClick={() => {
            setActiveTab("opportunities");
          }}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            activeTab === "opportunities"
              ? "bg-[#15157d] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#15157d] hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined">monetization_on</span>
          <span className="text-[13px] font-semibold">Opportunities</span>
        </div>

        <div
          onClick={() => {
            setActiveTab("accounts");
          }}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            activeTab === "accounts"
              ? "bg-[#15157d] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#15157d] hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined">business</span>
          <span className="text-[13px] font-semibold">Accounts</span>
        </div>

        <div
          onClick={() => {
            setActiveTab("reports");
          }}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            activeTab === "reports"
              ? "bg-[#15157d] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#15157d] hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined">assessment</span>
          <span className="text-[13px] font-semibold">Reports</span>
        </div>

        <div
          onClick={() => {
            setActiveTab("team");
          }}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            activeTab === "team"
              ? "bg-[#15157d] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#15157d] hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined">group</span>
          <span className="text-[13px] font-semibold">Team</span>
        </div>
      </nav>

      <div className="mt-auto border-t border-[#e2e8f0] pt-4 px-3">
        <div className="flex items-center gap-3 text-[#464652] px-4 py-3 rounded-lg hover:bg-slate-200/60 cursor-pointer transition-all active:scale-95">
          <span className="material-symbols-outlined">help</span>
          <span className="text-[13px] font-semibold">Support</span>
        </div>
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 text-[#ba1a1a] px-4 py-3 rounded-lg hover:bg-red-50 hover:text-[#93000a] cursor-pointer transition-all active:scale-95"
    >
      <span className="material-symbols-outlined">logout</span>
      <span className="text-[13px] font-bold">Logout</span>
    </button>
      </div>
    </aside>
  );
}
