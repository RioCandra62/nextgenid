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

export default function OwnerDashboardContent() {
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

  return (
    <main className="md:ml-64 flex-1 p-8 bg-[#f8f9ff] min-h-screen font-sans text-[#0b1c30]">
      
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

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT & CENTER: Performance Chart & Branch Table */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Revenue Performance Graph Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[16px] font-bold text-[#0b1c30]">Tren Pendapatan Bulanan</h3>
                <p className="text-xs text-[#777683] font-medium mt-0.5">Membandingkan realisasi pendapatan dengan target target (USD dalam Ribuan)</p>
              </div>
              
              {/* Legends */}
              <div className="flex gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#312e81] block"></span>
                  <span>Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-indigo-200 block"></span>
                  <span>Target</span>
                </div>
              </div>
            </div>

            {/* Custom Interactive SVG Graph */}
            <div className="relative w-full h-[260px] flex items-end">
              <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                {[0, 60, 120, 180].map((y, idx) => (
                  <line 
                    key={idx} 
                    x1="0" 
                    y1={y} 
                    x2="600" 
                    y2={y} 
                    stroke="#e2e8f0" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                  />
                ))}

                {/* Bars group */}
                {chartData.map((data, index) => {
                  const xOffset = 30 + index * 95;
                  
                  // Compute bar heights (scale maximum value 1600 to 180px height)
                  const targetHeight = (data.target / 1600) * 180;
                  const revenueHeight = (data.revenue / 1600) * 180;

                  return (
                    <g key={index} className="group cursor-pointer">
                      {/* Target bar (background pale indigo) */}
                      <rect
                        x={xOffset}
                        y={200 - targetHeight}
                        width="24"
                        height={targetHeight}
                        fill="#eff2fe"
                        rx="4"
                        className="transition-all duration-300"
                      />

                      {/* Revenue bar (foreground deep indigo) */}
                      <rect
                        x={xOffset + 6}
                        y={200 - revenueHeight}
                        width="18"
                        height={revenueHeight}
                        fill="url(#indigoGrad)"
                        rx="3"
                        onMouseEnter={() => setHoveredBarIndex(index)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                        className="transition-all duration-300 group-hover:brightness-110"
                      />

                      {/* Month Label */}
                      <text
                        x={xOffset + 12}
                        y="225"
                        fill="#777683"
                        fontSize="11px"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {data.month}
                      </text>
                    </g>
                  );
                })}

                {/* Gradients definitions */}
                <defs>
                  <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#312e81" />
                    <stop offset="100%" stopColor="#1e1b4b" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Dynamic Interactive Tooltip */}
              {hoveredBarIndex !== null && (
                <div 
                  className="absolute bg-slate-900 text-white rounded-lg p-3 text-[11px] shadow-lg border border-slate-700 pointer-events-none transition-all duration-150 animate-fade-in"
                  style={{
                    left: `${35 + hoveredBarIndex * 95}px`,
                    bottom: `${80 + (chartData[hoveredBarIndex].revenue / 1600) * 180}px`
                  }}
                >
                  <span className="block font-bold text-indigo-400 mb-1">Bulan {chartData[hoveredBarIndex].month}</span>
                  <span className="block">Realisasi: <strong>${chartData[hoveredBarIndex].revenue}k</strong></span>
                  <span className="block">Target: <strong>${chartData[hoveredBarIndex].target}k</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Branch Performance Summary List */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-[16px] font-bold text-[#0b1c30]">Performa Kantor Cabang</h3>
                <p className="text-xs text-[#777683] font-medium mt-0.5">Pemantauan cepat realisasi pendapatan 4 cabang teratas</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fcfcff] text-[#464652] font-semibold text-[11px] uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-3.5 font-bold">Nama Cabang</th>
                    <th className="px-6 py-3.5 font-bold text-center">Progress Target</th>
                    <th className="px-6 py-3.5 font-bold">Realisasi / Target</th>
                    <th className="px-6 py-3.5 font-bold">Status Cabang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {branchPerformance.map((bp) => (
                    <tr key={bp.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name */}
                      <td className="px-6 py-4 font-bold text-[14px] text-[#0b1c30]">
                        {bp.name}
                      </td>
                      
                      {/* Progress Bar */}
                      <td className="px-6 py-4 text-[13px] w-48 text-center">
                        <div className="flex flex-col gap-1">
                          <span className="text-[12px] font-bold text-[#0b1c30]">
                            {bp.progress}%
                          </span>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#312e81] h-full"
                              style={{ width: `${bp.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Revenue Numbers */}
                      <td className="px-6 py-4 text-[13px] font-semibold text-[#464652]">
                        <span className="font-bold text-[#0b1c30]">${(bp.revenue / 1000).toLocaleString()}k</span>
                        <span className="text-slate-400"> / ${(bp.target / 1000).toLocaleString()}k</span>
                      </td>

                      {/* Status Tag */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                            bp.status === "Above Target"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : bp.status === "On Target"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {bp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Account Activation Requests (Notifications) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Notifications Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-[22px] font-bold">
                  notifications_active
                </span>
                <h3 className="text-[16px] font-bold text-[#0b1c30]">Aktivasi Akun</h3>
              </div>
              {activationRequests.length > 0 && (
                <span className="bg-amber-100 text-amber-850 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {activationRequests.length} Pending
                </span>
              )}
            </div>

            {/* List of pending requests */}
            <div className="p-5 space-y-4 flex-1">
              {activationRequests.length > 0 ? (
                activationRequests.map((req) => (
                  <div 
                    key={req.id} 
                    className="p-4 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl transition-all space-y-3"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[13px] font-bold text-[#0b1c30] block">
                          {req.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {req.requestedAt}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                        {req.email}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 border-t border-b border-slate-200/50 py-2">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Jabatan</span>
                        <span>{req.role}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Cabang</span>
                        <span>{req.branch}</span>
                      </div>
                    </div>

                    {/* Approve / Decline Buttons */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleApprove(req.id, req.name)}
                        className="flex-1 bg-[#312e81] text-white py-1.5 rounded-lg text-[11px] font-bold hover:bg-indigo-900 transition-colors border-0 cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecline(req.id, req.name)}
                        className="flex-1 bg-white border border-slate-200 text-rose-600 py-1.5 rounded-lg text-[11px] font-bold hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>

                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 font-medium">
                  <span className="material-symbols-outlined text-[48px] block mb-2 opacity-45">
                    done_all
                  </span>
                  Semua permintaan aktivasi telah diproses!
                </div>
              )}
            </div>

            {/* Notification footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center rounded-b-xl">
              <span className="text-[11px] font-semibold text-slate-500">
                NextGenID Notification System
              </span>
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}
