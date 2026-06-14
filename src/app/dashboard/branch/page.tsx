"use client";

import PayoutTable from "@/app/components/branch/dashboard/table";
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
    </section>
  );
}
