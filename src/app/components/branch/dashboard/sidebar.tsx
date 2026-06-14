"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

interface BranchDashboardSideBarProps {
  isCollapsed?: boolean;
}

export default function BranchDashboardSideBar({ isCollapsed = false }: BranchDashboardSideBarProps) {
  const path = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userSession");
    }
    router.push("/dashboard");
  };

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] flex flex-col py-6 z-30 bg-[#f7f7fc] border-r border-[#e2e8f0] hidden md:flex transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <nav className="flex-1 space-y-1 px-3">
        {/* Overview Link */}
        <div
          onClick={() => router.push("/dashboard/branch")}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            path === "/dashboard/branch"
              ? "bg-[#312e81] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#312e81] hover:bg-slate-200/60"
          } ${isCollapsed ? "justify-center px-2" : ""}`}
          title={isCollapsed ? "Overview" : undefined}
        >
          <span className="material-symbols-outlined">insights</span>
          {!isCollapsed && <span className="text-[13px] font-semibold">Overview</span>}
        </div>

        {/* Payout Report Link */}
        <div
          onClick={() => router.push("/dashboard/branch/payout")}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            path === "/dashboard/branch/payout"
              ? "bg-[#312e81] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#312e81] hover:bg-slate-200/60"
          } ${isCollapsed ? "justify-center px-2" : ""}`}
          title={isCollapsed ? "Payout Report" : undefined}
        >
          <span className="material-symbols-outlined">receipt_long</span>
          {!isCollapsed && <span className="text-[13px] font-semibold">Payout Report</span>}
        </div>

        {/* Data Penjualan Link */}
        <div
          onClick={() => router.push("/dashboard/branch/data_penjualan")}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            path === "/dashboard/branch/data_penjualan"
              ? "bg-[#312e81] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#312e81] hover:bg-slate-200/60"
          } ${isCollapsed ? "justify-center px-2" : ""}`}
          title={isCollapsed ? "Data Penjualan" : undefined}
        >
          <span className="material-symbols-outlined">storefront</span>
          {!isCollapsed && <span className="text-[13px] font-semibold">Data Penjualan</span>}
        </div>

        {/* Daftar Produk Link */}
        <div
          onClick={() => router.push("/dashboard/branch/products")}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            path === "/dashboard/branch/products"
              ? "bg-[#312e81] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#312e81] hover:bg-slate-200/60"
          } ${isCollapsed ? "justify-center px-2" : ""}`}
          title={isCollapsed ? "Daftar Produk" : undefined}
        >
          <span className="material-symbols-outlined">inventory</span>
          {!isCollapsed && <span className="text-[13px] font-semibold">Daftar Produk</span>}
        </div>

        {/* Daftar Akun Link */}
        <div
          onClick={() => router.push("/dashboard/branch/account_page")}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
            path === "/dashboard/branch/account_page"
              ? "bg-[#312e81] text-white shadow-md font-semibold"
              : "text-[#464652] hover:text-[#312e81] hover:bg-slate-200/60"
          } ${isCollapsed ? "justify-center px-2" : ""}`}
          title={isCollapsed ? "Daftar Akun" : undefined}
        >
          <span className="material-symbols-outlined">manage_accounts</span>
          {!isCollapsed && <span className="text-[13px] font-semibold">Daftar Akun</span>}
        </div>
      </nav>

      <div className="mt-auto border-t border-[#e2e8f0] pt-4 px-3">
        {/* Support Link */}
        <div
          className={`flex items-center gap-3 text-[#464652] px-4 py-3 rounded-lg hover:bg-slate-200/60 cursor-pointer transition-all active:scale-95 ${
            isCollapsed ? "justify-center px-2" : ""
          }`}
          title={isCollapsed ? "Executive Help" : undefined}
        >
          <span className="material-symbols-outlined">contact_support</span>
          {!isCollapsed && <span className="text-[13px] font-semibold">Executive Help</span>}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 text-[#ba1a1a] px-4 py-3 rounded-lg hover:bg-red-50 hover:text-[#93000a] cursor-pointer transition-all active:scale-95 border-0 bg-transparent ${
            isCollapsed ? "justify-center px-2" : ""
          }`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <span className="material-symbols-outlined">logout</span>
          {!isCollapsed && <span className="text-[13px] font-bold">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
