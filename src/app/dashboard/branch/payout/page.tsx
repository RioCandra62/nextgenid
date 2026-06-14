"use client";
import PayoutTable from "@/app/components/branch/dashboard/table";
import React, { useState, useEffect } from "react";
import { X, Landmark } from "lucide-react";
import FormatRupiah from "@/app/lib/helper";
import { getDataPenjualan, getDailyOmzet } from "@/app/lib/branch/data_penjualan";

const bankAccounts = [
  {
    id: "bni",
    bank: "BNI",
    accountNumber: "386728495",
    label: "Rekening ROI",
    percentage: 43,
    color: "indigo",
    accentColor: "#312e81",
    bgColor: "bg-indigo-50",
    textColor: "text-[#312e81]",
    borderColor: "hover:border-indigo-300",
    icon: "payments",
    subtext: "↑ 12% bulan ini",
    categories: [

      { name: "EM", percent: 1, desc: "Emergency Fund (Dana Darurat)" },
      { name: "PI", percent: 5, desc: "Pengembangan Internal" },
      { name: "PS", percent: 10, desc: "Pembagian Sales" },
      { name: "BMA", percent: 20, desc: "Biaya Management & Administrasi" },
      { name: "BSA", percent: 5, desc: "Biaya Standardisasi Anggaran" },
      { name: "BEA", percent: 2, desc: "Biaya Edukasi & Asosiasi" },
    ]
  },
  {
    id: "bca",
    bank: "BCA",
    accountNumber: "0870336322",
    label: "Rekening Operasional",
    percentage: 15,
    color: "blue",
    accentColor: "#2563eb",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "hover:border-blue-300",
    icon: "track_changes",
    subtext: "Akumulasi target global",
    categories: [
      { name: "OP", percent: 15, desc: "Operasional Kantor & Cabang" },
    ]
  },
  {
    id: "bri",
    bank: "BRI",
    accountNumber: "031001041313508",
    label: "Rekening Pemasaran",
    percentage: 37,
    color: "emerald",
    accentColor: "#059669",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "hover:border-emerald-300",
    icon: "military_tech",
    subtext: "Berdasarkan performa riil",
    categories: [
      { name: "HPP", percent: 15, desc: "Harga Pokok Penjualan & Produksi Barang" },
      { name: "ADVERTS", percent: 22, desc: "Biaya Iklan & Promosi Digital" },
    ]
  },
  {
    id: "seabank",
    bank: "SEABANK",
    accountNumber: "901216560443",
    label: "Rekening HPP",
    percentage: 6,
    color: "amber",
    accentColor: "#d97706",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "hover:border-amber-300",
    icon: "apartment",
    subtext: "Unit regional aktif",
    categories: [
      { name: "EVENTS", percent: 2, desc: "Penyelenggaraan Event & Pameran" },
      { name: "BUSDEL", percent: 2, desc: "Business Development & Kemitraan" },
      { name: "CS", percent: 2, desc: "Customer Service & Layanan Pelanggan" },
    ]
  }
];

export default function PayoutPage() {
  const [selectedAccount, setSelectedAccount] = useState<typeof bankAccounts[number] | null>(null);
  const [totalOmset, setTotalOmset] = useState(920000); // fallback default
  const [dailyOmzet, setDailyOmzet] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    async function loadData() {
      try {
        const salesResult = await getDataPenjualan();
        if (salesResult && salesResult.length > 0) {
          const total = salesResult.reduce((acc: number, t: any) => acc + (t.price * t.qts), 0);
          setTotalOmset(total);
        }

        const omzetResult = await getDailyOmzet();
        if (omzetResult) {
          setDailyOmzet(omzetResult);
        }
      } catch (error) {
        console.error("Gagal memuat data penjualan/omset:", error);
      }
    }
    loadData();
  }, []);

  // Filter omzet based on selected time filter (7 days vs 30 days relative to latest transaction date)
  const filteredData = React.useMemo(() => {
    if (dailyOmzet.length === 0) return [];

    const parsedData = dailyOmzet.map((row) => ({
      ...row,
      parsedDate: new Date(row.date),
      numericOmzet: Number(row.omzet),
    })).sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

    const latestDate = parsedData[parsedData.length - 1].parsedDate;

    const daysLimit = timeFilter === "weekly" ? 7 : 30;
    const cutoffDate = new Date(latestDate);
    cutoffDate.setDate(cutoffDate.getDate() - daysLimit);

    return parsedData.filter((row) => row.parsedDate >= cutoffDate);
  }, [dailyOmzet, timeFilter]);

  // Max omzet for bar scaling
  const maxOmzet = React.useMemo(() => {
    if (filteredData.length === 0) return 1;
    const max = Math.max(...filteredData.map((d) => d.numericOmzet));
    return max > 0 ? max : 1;
  }, [filteredData]);

  // Color logic according to user thresholds:
  // < 300rb: hitam
  // 300rb - 750rb: merah
  // 750rb - 2jt: biru
  // > 2jt: hijau
  const getBarColor = (omzetVal: number) => {
    if (omzetVal < 300000) return {
      bg: "bg-slate-900",
      textColor: "text-slate-900",
      borderColor: "border-slate-300",
      hoverBg: "hover:bg-slate-800"
    };
    if (omzetVal < 750000) return {
      bg: "bg-rose-500",
      textColor: "text-rose-500",
      borderColor: "border-rose-300",
      hoverBg: "hover:bg-rose-600"
    };
    if (omzetVal <= 2000000) return {
      bg: "bg-blue-600",
      textColor: "text-blue-600",
      borderColor: "border-blue-300",
      hoverBg: "hover:bg-blue-700"
    };
    return {
      bg: "bg-emerald-500",
      textColor: "text-emerald-500",
      borderColor: "border-emerald-300",
      hoverBg: "hover:bg-emerald-600"
    };
  };

  // Keyboard navigation for closing modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedAccount(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <div className="mb-4">
        <span className="text-[12px] text-[#312e81] font-extrabold tracking-widest uppercase mb-1 block">
          Branch Operations
        </span>
        <h1 className="text-[32px] font-bold text-[#0b1c30] leading-none">
          Data Penjualan
        </h1>
        <p className="text-[14px] text-[#464652] mt-2">
          Manajemen dan pemantauan detail transaksi barang herbal per cabang.
        </p>
      </div>

      {/* Payout Account */}
      <span className="text-xs uppercase font-extrabold text-[#464652] tracking-wider block mb-2">
        Rekapitulasi Pembagian Rekening (Klik untuk detail persentase)
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {bankAccounts.map((account) => {
          const value = (totalOmset * account.percentage) / 100;
          return (
            <div
              key={account.id}
              onClick={() => setSelectedAccount(account)}
              className={`bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md ${account.borderColor} transition-all cursor-pointer hover:-translate-y-0.5 active:scale-98`}
            >
              <div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-bold text-[#464652] tracking-wider block mb-1">
                    {account.bank} {account.accountNumber}
                  </span>
                </div>
                <span className="text-[22px] font-extrabold text-[#0b1c30] block">
                  {FormatRupiah(value)}
                </span>
                <span className={`text-[10px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-md inline-block mt-2 ${account.bgColor} ${account.textColor}`}>
                  Proporsi: {account.percentage}%
                </span>
                <span className="text-[11px] text-slate-500 font-semibold block mt-1">
                  {account.subtext}
                </span>
              </div>
              <div className={`w-12 h-12 ${account.bgColor} ${account.textColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined">{account.icon}</span>
              </div>
            </div>
          );
        })}
      </div>


        {/* graphic and chart */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-8 flex flex-col gap-6">
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#312e81]">bar_chart</span>
              Grafik Omzet Penjualan
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Visualisasi pendapatan harian berdasarkan kelompok ambang batas omzet
            </p>
          </div>
          {/* Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setTimeFilter("weekly")}
              className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all border-0 cursor-pointer ${
                timeFilter === "weekly"
                  ? "bg-white text-[#312e81] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Mingguan (7 Hari)
            </button>
            <button
              onClick={() => setTimeFilter("monthly")}
              className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all border-0 cursor-pointer ${
                timeFilter === "monthly"
                  ? "bg-white text-[#312e81] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bulanan (30 Hari)
            </button>
          </div>
        </div>

        {/* Dashboard Overview Cards specific to the chart */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Pendapatan Filter</span>
            <span className="text-lg font-bold text-[#0b1c30]">
              {FormatRupiah(filteredData.reduce((acc, r) => acc + r.numericOmzet, 0))}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rata-rata Harian</span>
            <span className="text-lg font-bold text-[#0b1c30]">
              {FormatRupiah(
                filteredData.length > 0
                  ? Math.round(filteredData.reduce((acc, r) => acc + r.numericOmzet, 0) / filteredData.length)
                  : 0
              )}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Transaksi Tertinggi</span>
            <span className="text-lg font-bold text-indigo-700">
              {FormatRupiah(filteredData.length > 0 ? Math.max(...filteredData.map(d => d.numericOmzet)) : 0)}
            </span>
          </div>
        </div>

        {/* Main Bar Chart Container */}
        {filteredData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
            <span className="material-symbols-outlined text-[36px] mb-2 text-slate-300">query_stats</span>
            <span className="text-sm font-semibold">Tidak ada data omzet dalam periode ini</span>
          </div>
        ) : (
          <div className="relative pt-6">
            {/* Chart Area */}
            <div className="flex items-end justify-between h-72 border-b border-slate-200 pb-2 relative mb-6">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2 text-[10px] text-slate-300 font-bold">
                <div className="border-b border-slate-100 w-full h-0"></div>
                <div className="border-b border-slate-100 w-full h-0"></div>
                <div className="border-b border-slate-100 w-full h-0"></div>
                <div className="border-b border-slate-100 w-full h-0"></div>
                <div className="w-full h-0"></div>
              </div>

              {/* Bars */}
              <div className="flex items-end justify-around w-full h-full z-10 px-2 sm:px-6 relative">
                {filteredData.map((row, index) => {
                  const barColor = getBarColor(row.numericOmzet);
                  // Calculate height relative to maxOmzet, clamp to minimum of 4% for visibility
                  const heightPercent = Math.max(4, (row.numericOmzet / maxOmzet) * 100);

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-end h-full group relative w-full max-w-[48px] mx-1 sm:mx-2"
                    >
                      {/* Bar Wrapper with specific height percentage */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full relative flex flex-col justify-end"
                      >
                        {/* Tooltip on Hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-20 whitespace-nowrap text-center flex flex-col gap-0.5">
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(row.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <span>{FormatRupiah(row.numericOmzet)}</span>
                        </div>

                        {/* The Bar */}
                        <div
                          className={`w-full h-full rounded-t-lg ${barColor.bg} ${barColor.hoverBg} transition-all duration-300 shadow-sm relative overflow-hidden cursor-pointer`}
                        >
                          {/* Glow effect */}
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      </div>

                      {/* X-Axis Labels positioned absolute below chart area */}
                      <span className="absolute top-full mt-2 text-[10px] font-bold text-slate-500 truncate w-full text-center">
                        {new Date(row.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Threshold Legends */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-slate-600">
              <span className="text-slate-500 uppercase tracking-wider text-[10px] mr-2">Legend threshold:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-900 inline-block border border-slate-300"></span>
                <span>&lt; Rp 300rb (Hitam)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-rose-500 inline-block border border-rose-300"></span>
                <span>Rp 300rb - 750rb (Merah)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-blue-600 inline-block border border-blue-300"></span>
                <span>Rp 750rb - 2jt (Biru)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 inline-block border border-emerald-300"></span>
                <span>&gt; Rp 2jt (Hijau)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <PayoutTable />

      {/* Modal Detail Rekapitulasi */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-[60vh] rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className={`p-6 border-b border-slate-100 flex items-center justify-between ${selectedAccount.bgColor}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${selectedAccount.bgColor} ${selectedAccount.textColor} rounded-full flex items-center justify-center font-bold`}>
                  <Landmark size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0b1c30]">
                    Detail {selectedAccount.bank}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    No. Rekening: {selectedAccount.accountNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAccount(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-black/5"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">
              {/* Summary Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {selectedAccount.label}
                  </span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${selectedAccount.bgColor} ${selectedAccount.textColor}`}>
                    {selectedAccount.percentage}%
                  </span>
                </div>
                <div className="text-2xl font-black text-[#0b1c30]">
                  {FormatRupiah((totalOmset * selectedAccount.percentage) / 100)}
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                    <span>Proporsi dari Total Omset</span>
                    <span>{selectedAccount.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${selectedAccount.percentage}%`,
                        backgroundColor: selectedAccount.accentColor
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Detail Categories List */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-[#0b1c30] uppercase tracking-wider">
                  Rincian Pos Anggaran
                </h4>
                <div className="max-h-[240px] overflow-y-auto pr-1 space-y-3">
                  {selectedAccount.categories.map((cat, idx) => {
                    const value = (totalOmset * cat.percent) / 100;
                    return (
                      <div
                        key={idx}
                        className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-sm font-bold text-[#0b1c30]">
                              {cat.name}
                            </span>
                            <span className="ml-2 text-xs font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                              {cat.percent}%
                            </span>
                          </div>
                          <span className="text-sm font-extrabold text-[#312e81]">
                            {FormatRupiah(value)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {cat.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAccount(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
