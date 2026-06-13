"use client";

import React, { useState } from "react";

interface ActivationRequest {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  requestedAt: string;
}

interface BranchPerformance {
  id: string;
  name: string;
  revenue: number;
  target: number;
  progress: number; // percentage
  status: "Above Target" | "On Target" | "Needs Review";
}

export default function BranchDashboardContent() {
  // Mock requests for account activations
  const [activationRequests, setActivationRequests] = useState<ActivationRequest[]>([
    { id: "req-1", name: "Budi Santoso", email: "budi.s@nextgen.id", role: "Sales Agent", branch: "NYC Downtown", requestedAt: "10 menit yang lalu" },
    { id: "req-2", name: "Dewi Lestari", email: "dewi.l@nextgen.id", role: "Sales Agent", branch: "London Financial", requestedAt: "2 jam yang lalu" },
    { id: "req-3", name: "Rian Hidayat", email: "rian.h@nextgen.id", role: "Branch Manager", branch: "Singapore Raffles", requestedAt: "1 hari yang lalu" },
  ]);

  // Mock branch performance list
  const [branchPerformance] = useState<BranchPerformance[]>([
    { id: "bp-1", name: "Jakarta", revenue: 1450000, target: 1600000, progress: 91, status: "Above Target" },
    { id: "bp-2", name: "Bandung", revenue: 1240000, target: 1500000, progress: 83, status: "On Target" },
    { id: "bp-3", name: "Surabaya", revenue: 980000, target: 1200000, progress: 81, status: "On Target" },
    { id: "bp-4", name: "Semarang", revenue: 720000, target: 1000000, progress: 72, status: "Needs Review" },
  ]);

  // Chart data state
  const chartData = [
    { month: "Jan", revenue: 840, target: 900 },
    { month: "Feb", revenue: 980, target: 1000 },
    { month: "Mar", revenue: 1120, target: 1100 },
    { month: "Apr", revenue: 1250, target: 1200 },
    { month: "May", revenue: 1420, target: 1300 },
    { month: "Jun", revenue: 1550, target: 1400 }
  ];

  // Selected bar for tooltip
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Approve account activation
  const handleApprove = (id: string, name: string) => {
    setActivationRequests(prev => prev.filter(req => req.id !== id));
    alert(`Akun untuk "${name}" berhasil diaktivasi dan diberikan hak akses.`);
  };

  // Decline account activation
  const handleDecline = (id: string, name: string) => {
    setActivationRequests(prev => prev.filter(req => req.id !== id));
    alert(`Permintaan aktivasi untuk "${name}" ditolak.`);
  };

  // Calculate total stats
  const totalRevenue = branchPerformance.reduce((acc, b) => acc + b.revenue, 0);
  const totalTarget = branchPerformance.reduce((acc, b) => acc + b.target, 0);
  const completionPercentage = totalTarget > 0 ? Math.round((totalRevenue / totalTarget) * 100) : 0;
  const numBranches = branchPerformance.length;

  return (
    <section>
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[12px] text-[#312e81] font-extrabold tracking-widest uppercase mb-1 block">
            Executive Summary Overview
          </span>
          <h1 className="text-[32px] font-bold text-[#0b1c30] leading-tight">
            Dashboard Utama
          </h1>
          <p className="text-[14px] text-[#464652] mt-1">
            Informasi ringkas mengenai performa penjualan cabang, notifikasi akun baru, dan visualisasi tren penjualan.
          </p>
        </div>
      </div>

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#464652] tracking-wider block mb-1">
              Total Pendapatan
            </span>
            <span className="text-[26px] font-bold text-[#0b1c30]">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-emerald-600 font-semibold block mt-1">
              ↑ 12% bulan ini
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-[#312e81] rounded-full flex items-center justify-center font-bold text-lg">
            Rp
          </div>
        </div>

        {/* Total Target */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#464652] tracking-wider block mb-1">
              Target Penjualan
            </span>
            <span className="text-[26px] font-bold text-[#0b1c30]">
              Rp {totalTarget.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-slate-500 font-semibold block mt-1">
              Akumulasi target global
            </span>
          </div>
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">track_changes</span>
          </div>
        </div>

        {/* Completion Percentage */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#464652] tracking-wider block mb-1">
              Pencapaian Target
            </span>
            <span className="text-[26px] font-bold text-indigo-700">
              {completionPercentage}%
            </span>
            <span className="text-xs text-indigo-500 font-semibold block mt-1">
              Berdasarkan performa riil
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50/70 text-[#312e81] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">military_tech</span>
          </div>
        </div>

        {/* Total Branches */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#464652] tracking-wider block mb-1">
              Kantor Cabang
            </span>
            <span className="text-[26px] font-bold text-[#0b1c30]">
              {numBranches}
            </span>
            <span className="text-xs text-slate-500 font-semibold block mt-1">
              Unit regional aktif
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-[#312e81] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">apartment</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Visual Trend & Branch list (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SVG Double-Bar Trend Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#0b1c30]">
                  Tren Penjualan vs Target
                </h3>
                <p className="text-xs text-[#464652]">Perbandingan bulanan semester awal (ribu Rp)</p>
              </div>
              
              {/* Legend indicators */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-[#312e81] rounded-sm"></span>
                  <span className="text-[#0b1c30]">Realisasi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-slate-300 rounded-sm"></span>
                  <span className="text-[#464652]">Target</span>
                </div>
              </div>
            </div>

            {/* Custom Interactive SVG Graph */}
            <div className="relative">
              <svg viewBox="0 0 600 320" className="w-full h-auto">
                {/* Horizontal Grid Lines */}
                <line x1="50" y1="270" x2="570" y2="270" stroke="#f1f5f9" strokeWidth="1.5" />
                <line x1="50" y1="212.5" x2="570" y2="212.5" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="50" y1="155" x2="570" y2="155" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="50" y1="97.5" x2="570" y2="97.5" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="50" y1="40" x2="570" y2="40" stroke="#f1f5f9" strokeWidth="1" />

                {/* Y Axis Labels */}
                <text x="40" y="274" textAnchor="end" className="text-[10px] font-bold fill-slate-400">0</text>
                <text x="40" y="216.5" textAnchor="end" className="text-[10px] font-bold fill-slate-400">400rb</text>
                <text x="40" y="159" textAnchor="end" className="text-[10px] font-bold fill-slate-400">800rb</text>
                <text x="40" y="101.5" textAnchor="end" className="text-[10px] font-bold fill-slate-400">1.2jt</text>
                <text x="40" y="44" textAnchor="end" className="text-[10px] font-bold fill-slate-400">1.6jt</text>

                {/* Render Bars */}
                {chartData.map((data, idx) => {
                  const widthPerGroup = 85;
                  const centerX = 50 + idx * widthPerGroup + 42.5;
                  const barWidth = 22;
                  
                  // Compute heights based on 1600 ceiling
                  const revHeight = (data.revenue / 1600) * 230;
                  const targetHeight = (data.target / 1600) * 230;

                  const revY = 270 - revHeight;
                  const targetY = 270 - targetHeight;

                  const isHovered = hoveredBarIndex === idx;

                  return (
                    <g 
                      key={data.month} 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    >
                      {/* Hover background highlights */}
                      {isHovered && (
                        <rect
                          x={centerX - 35}
                          y="30"
                          width="70"
                          height="245"
                          fill="#f8fafc"
                          rx="8"
                          className="transition-all duration-200"
                        />
                      )}

                      {/* Revenue Bar (Indigo) */}
                      <rect
                        x={centerX - 24}
                        y={revY}
                        width={barWidth}
                        height={revHeight}
                        fill={isHovered ? "#1e1b4b" : "#312e81"}
                        rx="4"
                        ry="4"
                        className="transition-all duration-200"
                      />

                      {/* Target Bar (Slate) */}
                      <rect
                        x={centerX + 2}
                        y={targetY}
                        width={barWidth}
                        height={targetHeight}
                        fill={isHovered ? "#94a3b8" : "#cbd5e1"}
                        rx="4"
                        ry="4"
                        className="transition-all duration-200"
                      />

                      {/* X Axis label */}
                      <text
                        x={centerX}
                        y="292"
                        textAnchor="middle"
                        className={`text-[11px] font-bold transition-all ${
                          isHovered ? "fill-[#312e81] scale-105" : "fill-slate-500"
                        }`}
                      >
                        {data.month}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Chart Tooltip Overlay */}
              {hoveredBarIndex !== null && (
                <div 
                  className="absolute bg-[#0b1c30] text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1 z-10 transition-all pointer-events-none"
                  style={{
                    left: `${50 + hoveredBarIndex * 85 + 20}px`,
                    top: "40px",
                  }}
                >
                  <div className="font-bold border-b border-slate-700 pb-1 mb-1">
                    Bulan: {chartData[hoveredBarIndex].month}
                  </div>
                  <div>
                    Realisasi: <span className="font-bold text-[#c7d2fe]">Rp {(chartData[hoveredBarIndex].revenue * 1000).toLocaleString("id-ID")}</span>
                  </div>
                  <div>
                    Target: <span className="font-bold text-[#e2e8f0]">Rp {(chartData[hoveredBarIndex].target * 1000).toLocaleString("id-ID")}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Branch Performance breakdowns */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#0b1c30] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#312e81]">bar_chart</span>
              Breakdown Performa Cabang
            </h3>
            
            <div className="space-y-6">
              {branchPerformance.map((branch) => (
                <div key={branch.id} className="group border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-[15px] text-[#0b1c30]">{branch.name}</span>
                      <span className="text-[11px] font-semibold text-[#464652] block">
                        Realisasi: Rp {branch.revenue.toLocaleString("id-ID")} / Target: Rp {branch.target.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                        branch.status === "Above Target"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : branch.status === "On Target"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        branch.status === "Above Target" ? "bg-emerald-500" : branch.status === "On Target" ? "bg-blue-500" : "bg-rose-500"
                      }`}></span>
                      {branch.status}
                    </span>
                  </div>

                  {/* Custom animated progress bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          branch.status === "Above Target"
                            ? "bg-emerald-500"
                            : branch.status === "On Target"
                            ? "bg-[#312e81]"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${branch.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-[#0b1c30] w-8 text-right">
                      {branch.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar panels (1 col) */}
        <div className="space-y-8">
          
          {/* Account Activations Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#0b1c30] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#312e81]">group_add</span>
              Aktivasi Akun Baru
            </h3>
            <p className="text-xs text-[#464652] mb-6">
              Permintaan otorisasi dari agen sales baru per wilayah cabang.
            </p>

            {activationRequests.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="material-symbols-outlined text-[36px] text-slate-350 block mb-1">
                  check_circle
                </span>
                <span className="text-xs font-bold text-slate-500">Semua permintaan diproses</span>
              </div>
            ) : (
              <div className="space-y-4">
                {activationRequests.map((req) => (
                  <div key={req.id} className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3 hover:bg-[#312e81]/5 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#0b1c30]">{req.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{req.requestedAt}</span>
                      </div>
                      <div className="text-xs text-[#464652] font-semibold flex flex-col gap-0.5">
                        <span>Role: {req.role}</span>
                        <span>Cabang: {req.branch}</span>
                        <span className="text-slate-400 font-normal italic">{req.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleApprove(req.id, req.name)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors"
                      >
                        Setuju
                      </button>
                      <button
                        onClick={() => handleDecline(req.id, req.name)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-[#464652] text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats Summary Card */}
          <div className="bg-[#312e81] text-white rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">
                bar_chart_4_bars
              </span>
            </div>

            <span className="text-[11px] font-extrabold tracking-widest uppercase text-indigo-300">
              NextGenID Branch Hub
            </span>
            <h4 className="text-xl font-bold mt-2">
              Kesehatan Penjualan
            </h4>
            <p className="text-xs text-indigo-200 mt-2 leading-relaxed">
              Seluruh unit kantor cabang beroperasi penuh. Wilayah Jakarta memimpin performa penjualan dengan persentase di atas 91% dari target.
            </p>

            <button 
              onClick={() => window.location.href = "/dashboard/branch/data_penjualan"}
              className="mt-6 flex items-center gap-2 bg-white text-[#312e81] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-indigo-50 active:scale-95 transition-all shadow-md shadow-indigo-950/10 cursor-pointer w-fit"
            >
              Lihat Data Penjualan
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
