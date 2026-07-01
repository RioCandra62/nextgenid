"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Plus, Calendar, Filter, DollarSign, ShoppingCart, User, Trash2, ClipboardCheck } from "lucide-react";
import { getDataPenjualan, getMembersAndProducts, AddDataPenjualan } from "@/app/lib/branch/data_penjualan";
import FormatRupiah from "@/app/lib/helper";

export default function DataPenjualanPage() {

  const [transc, setTransc] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [productId, setProductId] = useState("");
  const [qts, setQts] = useState(1);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);

  // Report controls states
  const [activeTab, setActiveTab] = useState<"report" | "log">("report");
  const [reportViewMode, setReportViewMode] = useState<"harian" | "bulanan">("harian");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM

  // Date parsing helper to handle time zones safely
  const getLocalDateString = (dateInput: any): string => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatIndonesianDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatIndonesianMonth = (monthStr: string) => {
    try {
      const [year, month] = monthStr.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric"
      });
    } catch (e) {
      return monthStr;
    }
  };

  // Product classification helper
  const getProductMeta = (productName: string, dbPrice?: number) => {
    const norm = productName.toLowerCase().trim().replace(/[\s\.\-_]/g, '');
    
    if (norm.includes('karada') || norm.includes('kscan')) {
      return { abbreviation: "K.scan", group: "kscan" as const, label: "Karada Scan", defaultPrice: 20000 };
    }
    if (norm.includes('getsliming') || norm.includes('gsl')) {
      return { abbreviation: "GSL", group: "nexgen" as const, label: "Get.Slimming", defaultPrice: 230000 };
    }
    if (norm.includes('syifastamin') || norm.includes('sftm')) {
      return { abbreviation: "SFTM", group: "nexgen" as const, label: "Syifastamin", defaultPrice: 230000 };
    }
    if (norm.includes('immultan') || norm.includes('imlt')) {
      return { abbreviation: "IMLT", group: "nexgen" as const, label: "Immultan Formula", defaultPrice: 150000 };
    }
    
    if (norm.includes('fitago') || norm.includes('ftg')) {
      return { abbreviation: "FTG", group: "hni" as const, label: "Fitago", defaultPrice: 145000 };
    }
    if (norm.includes('ettagoat') || norm.includes('etg')) {
      return { abbreviation: "ETG", group: "hni" as const, label: "Ettagoat", defaultPrice: 145000 };
    }
    if (norm.includes('magafit') || norm.includes('mgft')) {
      return { abbreviation: "MGFT", group: "hni" as const, label: "Magafit", defaultPrice: 110000 };
    }
    if (norm.includes('laurik') || norm.includes('lrk')) {
      return { abbreviation: "LRK", group: "hni" as const, label: "Laurik", defaultPrice: 110000 };
    }
    if (norm.includes('mengkudu') || norm.includes('mgkd')) {
      return { abbreviation: "MGKD", group: "hni" as const, label: "Mengkudu", defaultPrice: 110000 };
    }
    
    // Default fallback
    return {
      abbreviation: productName.slice(0, 4).toUpperCase(),
      group: "nexgen" as const,
      label: productName,
      defaultPrice: dbPrice ?? 0
    };
  };

  // Helper to fetch current price from database state
  const getProductPrice = (abbrev: string, defaultPrice: number): number => {
    const matchingProduct = products.find(p => {
      const norm = p.product_name.toLowerCase().trim().replace(/[\s\.\-_]/g, '');
      if (abbrev === "K.scan" && (norm.includes("karada") || norm.includes("kscan"))) return true;
      if (abbrev === "GSL" && (norm.includes("getsliming") || norm.includes("gsl"))) return true;
      if (abbrev === "SFTM" && (norm.includes("syifastamin") || norm.includes("sftm"))) return true;
      if (abbrev === "IMLT" && (norm.includes("immultan") || norm.includes("imlt"))) return true;
      if (abbrev === "FTG" && (norm.includes("fitago") || norm.includes("ftg"))) return true;
      if (abbrev === "ETG" && (norm.includes("ettagoat") || norm.includes("etg"))) return true;
      if (abbrev === "MGFT" && (norm.includes("magafit") || norm.includes("mgft"))) return true;
      if (abbrev === "LRK" && (norm.includes("laurik") || norm.includes("lrk"))) return true;
      if (abbrev === "MGKD" && (norm.includes("mengkudu") || norm.includes("mgkd"))) return true;
      return false;
    });
    return matchingProduct ? matchingProduct.price : defaultPrice;
  };

  useEffect(() => {
    async function load() {
      try {
        const result = await getDataPenjualan();
        setTransc(result);
        
        const dropDowns = await getMembersAndProducts();
        setMembers(dropDowns.members);
        setProducts(dropDowns.products);
        
        if (dropDowns.members.length > 0) setMemberId(dropDowns.members[0].member_id);
        if (dropDowns.products.length > 0) setProductId(dropDowns.products[0].product_id);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    }
    load();
  }, []);

  // Update default states when modal opens
  const handleOpenModal = () => {
    if (members.length > 0 && !memberId) setMemberId(members[0].member_id);
    if (products.length > 0 && !productId) setProductId(products[0].product_id);
    setQts(1);
    setSaleDate(new Date().toISOString().split("T")[0]);
    setIsModalOpen(true);
  };

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !productId || qts <= 0 || !saleDate) {
      alert("Harap lengkapi semua kolom form!");
      return;
    }

    const formData = new FormData();
    formData.append("member_id", memberId);
    formData.append("product_id", productId);
    formData.append("qts", qts.toString());
    formData.append("date", saleDate);

    try {
      const result = await AddDataPenjualan(formData);
      if (result.success) {
        alert("Data transaksi penjualan berhasil disimpan!");
        setIsModalOpen(false);
        // Reload transactions list
        const updated = await getDataPenjualan();
        setTransc(updated);
      }
    } catch (error: any) {
      alert(error.message || "Gagal menyimpan transaksi");
    }
  };

  // Find currently selected product price for live preview
  const selectedProduct = products.find(p => p.product_id === productId);
  const selectedProductPrice = selectedProduct ? selectedProduct.price : 0;
  const totalPrice = qts * selectedProductPrice;

  // Filter transactions based on report controls
  const filteredTransc = transc.filter((t) => {
    const tDateStr = getLocalDateString(t.date);
    if (reportViewMode === "harian") {
      return tDateStr === selectedDate;
    } else {
      return tDateStr.slice(0, 7) === selectedMonth;
    }
  });

  // Calculate metrics based on current filter
  const totalRevenue = filteredTransc.reduce((acc, t) => acc + (t.price * t.qts), 0);
  const totalQty = filteredTransc.reduce((acc, t) => acc + t.qts, 0);
  const totalTransactions = filteredTransc.length;

  // Build matrix data per member
  const matrixData = members.map((m, idx) => {
    const unitCode = `G.${idx + 1}`;
    
    // Quantities per product
    const qtyMap: Record<string, number> = {
      "K.scan": 0,
      "GSL": 0,
      "SFTM": 0,
      "IMLT": 0,
      "FTG": 0,
      "ETG": 0,
      "MGFT": 0,
      "LRK": 0,
      "MGKD": 0,
    };
    
    // Accumulate for this member
    const memberSales = filteredTransc.filter(t => t.member_id === m.member_id);
    memberSales.forEach(s => {
      const meta = getProductMeta(s.product_name, s.price);
      if (qtyMap[meta.abbreviation] !== undefined) {
        qtyMap[meta.abbreviation] += s.qts;
      } else {
        qtyMap[meta.abbreviation] = (qtyMap[meta.abbreviation] || 0) + s.qts;
      }
    });

    // Calculate Nexgen Total Revenue for this member
    const nexgenTotal = 
      (qtyMap["K.scan"] * getProductPrice("K.scan", 20000)) +
      (qtyMap["GSL"] * getProductPrice("GSL", 230000)) +
      (qtyMap["SFTM"] * getProductPrice("SFTM", 230000)) +
      (qtyMap["IMLT"] * getProductPrice("IMLT", 150000));

    // Calculate HNI Total Revenue for this member
    const hniTotal = 
      (qtyMap["FTG"] * getProductPrice("FTG", 145000)) +
      (qtyMap["ETG"] * getProductPrice("ETG", 145000)) +
      (qtyMap["MGFT"] * getProductPrice("MGFT", 110000)) +
      (qtyMap["LRK"] * getProductPrice("LRK", 110000)) +
      (qtyMap["MGKD"] * getProductPrice("MGKD", 110000));

    return {
      member_id: m.member_id,
      member_name: m.member_name,
      unit: unitCode,
      qtyMap,
      nexgenTotal,
      hniTotal
    };
  });

  // Grand totals for Nexgen.id matrix
  const grandTotalNexgen = {
    "K.scan": matrixData.reduce((sum, item) => sum + item.qtyMap["K.scan"], 0),
    "GSL": matrixData.reduce((sum, item) => sum + item.qtyMap["GSL"], 0),
    "SFTM": matrixData.reduce((sum, item) => sum + item.qtyMap["SFTM"], 0),
    "IMLT": matrixData.reduce((sum, item) => sum + item.qtyMap["IMLT"], 0),
    "Total": matrixData.reduce((sum, item) => sum + item.nexgenTotal, 0),
  };

  // Grand totals for HNI matrix
  const grandTotalHni = {
    "FTG": matrixData.reduce((sum, item) => sum + item.qtyMap["FTG"], 0),
    "ETG": matrixData.reduce((sum, item) => sum + item.qtyMap["ETG"], 0),
    "MGFT": matrixData.reduce((sum, item) => sum + item.qtyMap["MGFT"], 0),
    "LRK": matrixData.reduce((sum, item) => sum + item.qtyMap["LRK"], 0),
    "MGKD": matrixData.reduce((sum, item) => sum + item.qtyMap["MGKD"], 0),
    "Total": matrixData.reduce((sum, item) => sum + item.hniTotal, 0),
  };

  return (
    <section>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
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

        {/* Add Data Button */}
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-[#312e81] hover:bg-[#1e1b4b] text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-md shadow-indigo-900/10 w-fit cursor-pointer"
        >
          <Plus size={20} />
          Tambah Penjualan
        </button>
      </div>

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#464652] tracking-wider block mb-1">
              Total Pendapatan
            </span>
            <span className="text-[28px] font-bold text-[#0b1c30]">
              {FormatRupiah(totalRevenue)}
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-[#312e81] rounded-full flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Total Quantity */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#464652] tracking-wider block mb-1">
              Produk Terjual
            </span>
            <span className="text-[28px] font-bold text-[#0b1c30]">
              {totalQty} <span className="text-sm font-semibold text-slate-500">pcs</span>
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-[#10b981] rounded-full flex items-center justify-center">
            <ShoppingCart size={24} />
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#464652] tracking-wider block mb-1">
              Jumlah Transaksi
            </span>
            <span className="text-[28px] font-bold text-[#0b1c30]">
              {totalTransactions} <span className="text-sm font-semibold text-slate-500">kali</span>
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-[#f59e0b] rounded-full flex items-center justify-center">
            <Calendar size={24} />
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("report")}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "report"
              ? "border-[#312e81] text-[#312e81]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Laporan Matriks
        </button>
        <button
          onClick={() => setActiveTab("log")}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "log"
              ? "border-[#312e81] text-[#312e81]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Log Transaksi
        </button>
      </div>

      {activeTab === "report" ? (
        <div className="space-y-10">
          {/* Laporan Matriks Controls Panel */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0b1c30] flex items-center gap-2">
                <ClipboardCheck size={22} className="text-[#312e81]" />
                {reportViewMode === "harian" ? "Laporan Penjualan Harian" : "Laporan Penjualan Bulanan"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {reportViewMode === "harian" 
                  ? formatIndonesianDate(selectedDate)
                  : formatIndonesianMonth(selectedMonth)}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Mode Selector Toggle */}
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setReportViewMode("harian")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reportViewMode === "harian"
                      ? "bg-white text-[#312e81] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Harian
                </button>
                <button
                  type="button"
                  onClick={() => setReportViewMode("bulanan")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reportViewMode === "bulanan"
                      ? "bg-white text-[#312e81] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Bulanan
                </button>
              </div>

              {/* Date / Month Picker */}
              <div>
                {reportViewMode === "harian" ? (
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-slate-300 rounded-xl px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81] bg-white cursor-pointer"
                  />
                ) : (
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border border-slate-300 rounded-xl px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81] bg-white cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>

          {/* TABLE 1: NEXGEN.ID PRODUK */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-sky-50/50">
              <h3 className="text-md font-extrabold text-[#312e81] tracking-wide uppercase">
                Tabel Penjualan Nexgen.id
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sky-100/75 text-sky-950 border-b border-slate-200">
                    <th rowSpan={2} className="px-4 py-3 font-bold text-center border-r border-slate-200/60 w-12 text-xs">No</th>
                    <th rowSpan={2} className="px-4 py-3 font-bold text-center border-r border-slate-200/60 w-16 text-xs">Unit</th>
                    <th rowSpan={2} className="px-5 py-3 font-bold border-r border-slate-200/60 text-xs">Explorer</th>
                    <th rowSpan={2} className="px-4 py-3 font-bold text-center border-r border-slate-200/60 text-xs bg-sky-150/20">K.scan</th>
                    <th colSpan={3} className="px-4 py-2 font-bold text-center border-b border-r border-slate-200/60 text-xs">Nexgen.id Produk</th>
                    <th rowSpan={2} className="px-5 py-3 font-bold text-right text-xs">Total</th>
                  </tr>
                  <tr className="bg-sky-50 text-sky-900 border-b border-slate-200">
                    <th className="px-4 py-2 font-bold text-center border-r border-slate-200/60 text-[11px]">GSL</th>
                    <th className="px-4 py-2 font-bold text-center border-r border-slate-200/60 text-[11px]">SFTM</th>
                    <th className="px-4 py-2 font-bold text-center border-r border-slate-200/60 text-[11px]">IMLT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {matrixData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-slate-400 text-sm">
                        Belum ada data Explorer terdaftar
                      </td>
                    </tr>
                  ) : (
                    matrixData.map((row, idx) => (
                      <tr key={row.member_id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-4 py-3.5 text-center font-semibold text-slate-500 text-xs border-r border-slate-100">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-700 text-xs border-r border-slate-100">
                          {row.unit}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-900 text-sm border-r border-slate-100">
                          {row.member_name}
                        </td>
                        <td className="px-4 py-3.5 text-center font-extrabold text-[#312e81] border-r border-slate-100 bg-sky-50/10">
                          {row.qtyMap["K.scan"] || ""}
                        </td>
                        <td className="px-4 py-3.5 text-center font-semibold text-slate-700 border-r border-slate-100">
                          {row.qtyMap["GSL"] || ""}
                        </td>
                        <td className="px-4 py-3.5 text-center font-semibold text-slate-700 border-r border-slate-100">
                          {row.qtyMap["SFTM"] || ""}
                        </td>
                        <td className="px-4 py-3.5 text-center font-semibold text-slate-700 border-r border-slate-100">
                          {row.qtyMap["IMLT"] || ""}
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-slate-800 text-sm">
                          {FormatRupiah(row.nexgenTotal)}
                        </td>
                      </tr>
                    ))
                  )}
                  {/* Grand Total Row */}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                    <td colSpan={3} className="px-5 py-4 text-right border-r border-slate-200">
                      Grand Total
                    </td>
                    <td className="px-4 py-4 text-center border-r border-slate-200 text-[#312e81] font-extrabold">
                      {grandTotalNexgen["K.scan"]}
                    </td>
                    <td className="px-4 py-4 text-center border-r border-slate-200 text-slate-700">
                      {grandTotalNexgen["GSL"]}
                    </td>
                    <td className="px-4 py-4 text-center border-r border-slate-200 text-slate-700">
                      {grandTotalNexgen["SFTM"]}
                    </td>
                    <td className="px-4 py-4 text-center border-r border-slate-200 text-slate-700">
                      {grandTotalNexgen["IMLT"]}
                    </td>
                    <td className="px-5 py-4 text-right text-indigo-900 font-extrabold">
                      {FormatRupiah(grandTotalNexgen["Total"])}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Rekapitulasi Nexgen */}
            <div className="p-6 bg-slate-50 border-t border-slate-200/80">
              <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4">
                Rekapitulasi Nexgen.id PRODUK:
              </h4>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="font-semibold w-1/3">Karada Scan</span>
                  <span className="w-1/12 text-center">:</span>
                  <span className="w-1/12 text-center font-bold text-slate-900">{grandTotalNexgen["K.scan"]}</span>
                  <span className="w-1/4 text-right font-medium text-slate-500">{FormatRupiah(getProductPrice("K.scan", 20000))}</span>
                  <span className="w-1/4 text-right font-bold text-slate-900">{FormatRupiah(grandTotalNexgen["K.scan"] * getProductPrice("K.scan", 20000))}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="font-semibold w-1/3">Get.Slimming</span>
                  <span className="w-1/12 text-center">:</span>
                  <span className="w-1/12 text-center font-bold text-slate-900">{grandTotalNexgen["GSL"]}</span>
                  <span className="w-1/4 text-right font-medium text-slate-500">{FormatRupiah(getProductPrice("GSL", 230000))}</span>
                  <span className="w-1/4 text-right font-bold text-slate-900">{FormatRupiah(grandTotalNexgen["GSL"] * getProductPrice("GSL", 230000))}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="font-semibold w-1/3">Syifastamin</span>
                  <span className="w-1/12 text-center">:</span>
                  <span className="w-1/12 text-center font-bold text-slate-900">{grandTotalNexgen["SFTM"]}</span>
                  <span className="w-1/4 text-right font-medium text-slate-500">{FormatRupiah(getProductPrice("SFTM", 230000))}</span>
                  <span className="w-1/4 text-right font-bold text-slate-900">{FormatRupiah(grandTotalNexgen["SFTM"] * getProductPrice("SFTM", 230000))}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="font-semibold w-1/3">Immultan Formula</span>
                  <span className="w-1/12 text-center">:</span>
                  <span className="w-1/12 text-center font-bold text-slate-900">{grandTotalNexgen["IMLT"]}</span>
                  <span className="w-1/4 text-right font-medium text-slate-500">{FormatRupiah(getProductPrice("IMLT", 150000))}</span>
                  <span className="w-1/4 text-right font-bold text-slate-900">{FormatRupiah(grandTotalNexgen["IMLT"] * getProductPrice("IMLT", 150000))}</span>
                </div>
                <div className="flex justify-between items-center pt-3 text-md font-bold text-[#312e81]">
                  <span className="w-1/3 uppercase">Total Omset</span>
                  <span className="w-1/12 text-center">:</span>
                  <span className="w-1/12 text-center">{grandTotalNexgen["K.scan"] + grandTotalNexgen["GSL"] + grandTotalNexgen["SFTM"] + grandTotalNexgen["IMLT"]}</span>
                  <span className="w-1/4"></span>
                  <span className="w-1/4 text-right text-lg font-extrabold">{FormatRupiah(grandTotalNexgen["Total"])}</span>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE 2: HNI PRODUK */}
        </div>
      ) : (
        /* Log Transaksi Tab (Original View) */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Table Toolbar controls */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
              <Filter size={18} className="text-[#312e81]" />
              Daftar Transaksi Penjualan ({filteredTransc.length} transaksi)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[#464652] font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4 font-bold">Nama Sales</th>
                  <th className="px-6 py-4 font-bold">Nama Barang</th>
                  <th className="px-6 py-4 font-bold text-center">Jumlah (Qty)</th>
                  <th className="px-6 py-4 font-bold text-right">Harga Satuan</th>
                  <th className="px-6 py-4 font-bold text-right">Total Harga</th>
                  <th className="px-6 py-4 font-bold text-center">Tanggal</th>
                  <th className="px-6 py-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransc.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ShoppingCart size={40} className="text-slate-300" />
                        <span className="font-semibold text-sm">Tidak ada transaksi penjualan untuk filter terpilih</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransc.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-sm text-[#0b1c30]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-indigo-50 text-[#312e81] rounded-full flex items-center justify-center font-bold text-xs">
                            {t.member_name ? t.member_name.charAt(0).toUpperCase() : "?"}
                          </div>
                          {t.member_name || "Unknown Member"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#0b1c30]">
                        {t.product_name || "Unknown Product"}
                      </td>
                      <td className="px-6 py-4 text-sm text-center font-semibold text-slate-600">
                        {t.qts}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-bold text-[#464652]">
                        {FormatRupiah(t.price)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-bold text-[#312e81]">
                        {FormatRupiah(t.price * t.qts)}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-500 font-semibold">
                        {new Date(t.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        <button
                          onClick={() => alert(`Setoran dari "${t.member_name}" senilai Rp ${FormatRupiah(t.price*t.qts)} berhasil diverifikasi.`)}
                          className="text-xs font-bold text-[#312e81] hover:underline cursor-pointer bg-transparent border-0"
                        >
                          Verifikasi
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* POP-UP MODAL FORM FOR ADDING SALE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden ">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#312e81] text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Plus size={20} />
                Tambah Transaksi Penjualan
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:bg-white/10 p-1.5 rounded-full transition-all border-0 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSale} className="p-6 space-y-5">
              {/* Sales Rep Name Selection */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                  Pilih Sales Agent *
                </label>
                <select
                  required
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-3 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81] cursor-pointer"
                >
                  <option value="" disabled>-- Pilih Agen Sales --</option>
                  {members.map((m) => (
                    <option key={m.member_id} value={m.member_id}>
                      {m.member_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                    Pilih Barang Herbal *
                  </label>
                  <select
                    required
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-3 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81] cursor-pointer"
                  >
                    <option value="" disabled>-- Pilih Produk --</option>
                    {products.map((p) => (
                      <option key={p.product_id} value={p.product_id}>
                        {p.product_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Harga Satuan Preview */}
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                    Harga Satuan
                  </label>
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-[#464652] font-semibold">
                    {FormatRupiah(selectedProductPrice)}
                  </div>
                </div>
              </div>

              {/* Qty & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                    Jumlah Barang (Qty) *
                  </label>
                  <input
                    type="number"
                    required
                    value={qts}
                    onChange={(e) => setQts(Math.max(1, Number(e.target.value)))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-3 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                    Tanggal Transaksi *
                  </label>
                  <input
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-3 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81] cursor-pointer"
                  />
                </div>
              </div>

              {/* Dynamic Live Total Price Preview */}
              <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 flex justify-between items-center text-sm font-semibold">
                <span className="text-[#312e81] font-bold">Total Harga Transaksi:</span>
                <span className="text-xl text-[#312e81] font-extrabold">
                  {FormatRupiah(totalPrice)}
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold rounded-xl hover:bg-slate-100 text-[#464652] transition-colors border-0 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#312e81] text-white rounded-xl hover:bg-[#1e1b4b] active:scale-95 transition-all shadow-md shadow-indigo-900/10 cursor-pointer"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
