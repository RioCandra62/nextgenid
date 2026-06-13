"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";


export default function BranchDashboardSideBar() {

  const path = usePathname();

  const router = useRouter();

  const handleLogout = () => {
    router.push("/auth/login");
  };
  
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] flex flex-col py-6 w-64 z-30 bg-[#f7f7fc] border-r border-[#e2e8f0] hidden md:flex transition-colors duration-300">
      <nav className="flex-1 space-y-1 px-3">
        <div
          onClick={() => router.push("/dashboard/branch")}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${path === "/dashboard/branch" ? "bg-[#312e81] text-white shadow-md font-semibold" : "text-[#464652] hover:text-[#312e81] hover:bg-slate-200/60"} `}
        >
          <span className="material-symbols-outlined">insights</span>
          <span className="text-[13px] font-semibold">Overview</span>
        </div>

        <div
          onClick={() => router.push("/dashboard/branch/data_penjualan")}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${path === "/dashboard/branch/data_penjualan" ? "bg-[#312e81] text-white shadow-md font-semibold" : "text-[#464652] hover:text-[#312e81] hover:bg-slate-200/60"} `}
        >
          <span className="material-symbols-outlined">storefront</span>
          <span className="text-[13px] font-semibold">Data Penjualan</span>
        </div>

        <div
          onClick={() => router.push("/dashboard/branch/account_page")}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${path === "/dashboard/branch/account_page" ? "bg-[#312e81] text-white shadow-md font-semibold" : "text-[#464652] hover:text-[#312e81] hover:bg-slate-200/60"} `}
        >
          <span className="material-symbols-outlined">manage_accounts</span>
          <span className="text-[13px] font-semibold">Daftar Akun</span>
        </div>
        <div
          onClick={() => router.push("/dashboard/branch/products")}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${path === "/dashboard/branch/products" ? "bg-[#312e81] text-white shadow-md font-semibold" : "text-[#464652] hover:text-[#312e81] hover:bg-slate-200/60"} `}
        >
          <span className="material-symbols-outlined">inventory</span>
          <span className="text-[13px] font-semibold">Daftar Produk</span>
        </div>
        {/* <div
          
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200`}
        >
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="text-[13px] font-semibold">Financial Ledger</span>
        </div>

        <div
          
          className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 `}
        >
          <span className="material-symbols-outlined">supervisor_account</span>
          <span className="text-[13px] font-semibold">Regional Leaders</span>
        </div> */}
      </nav>

      <div className="mt-auto border-t border-[#e2e8f0] pt-4 px-3">
        <div
          
          className="flex items-center gap-3 text-[#464652] px-4 py-3 rounded-lg hover:bg-slate-200/60 cursor-pointer transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">contact_support</span>
          <span className="text-[13px] font-semibold">Executive Help</span>
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
