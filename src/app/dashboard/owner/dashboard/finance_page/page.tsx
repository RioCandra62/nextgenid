"use client"

import React from "react"

export default function OwnerDashboardFinancePage() {
    return(
        <main className="md:ml-64 flex-1 p-8 bg-[#f8f9ff] min-h-screen font-sans text-[#0b1c30]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[12px] text-[#312e81] font-extrabold tracking-widest uppercase mb-1 block">
            Executive Control Panel
          </span>
          <h1 className="text-[32px] font-bold text-[#0b1c30] leading-tight">
            Data Penjualan
          </h1>
          <p className="text-[14px] text-[#464652] mt-1">
            Pantau performa pendapatan cabang, tentukan target penjualan, serta tugaskan Branch Manager regional.
          </p>
        </div>
      </div>
    </main>
    )
}