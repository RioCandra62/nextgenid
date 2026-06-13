"use client";

import React, { useState } from "react";
import { CheckCircle2, Plus, Calendar, Filter, DollarSign, ShoppingCart, User, Trash2, ClipboardCheck } from "lucide-react";

interface SalesTransaction {
  id: string;
  salesName: string;
  itemName: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  date: Date;
}

// Initial mockup data spanning today, this week, and this month
const initialSales: SalesTransaction[] = [
  {
    id: "tx-1",
    salesName: "Budi Santoso",
    itemName: "Etta Goat Milk",
    qty: 5,
    unitPrice: 75000,
    totalPrice: 375000,
    date: new Date(), // Today
  },
  {
    id: "tx-2",
    salesName: "Dewi Lestari",
    itemName: "Laurik",
    qty: 2,
    unitPrice: 90000,
    totalPrice: 180000,
    date: new Date(), // Today
  },
  {
    id: "tx-3",
    salesName: "Rian Hidayat",
    itemName: "Mengkudu",
    qty: 10,
    unitPrice: 80000,
    totalPrice: 800000,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: "tx-4",
    salesName: "Budi Santoso",
    itemName: "Magafit",
    qty: 4,
    unitPrice: 95000,
    totalPrice: 380000,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
  },
  {
    id: "tx-5",
    salesName: "Dewi Lestari",
    itemName: "Fitago",
    qty: 8,
    unitPrice: 110000,
    totalPrice: 880000,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  },
  {
    id: "tx-6",
    salesName: "Rian Hidayat",
    itemName: "Etta Goat Milk",
    qty: 12,
    unitPrice: 75000,
    totalPrice: 900000,
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
  },
];

const availableProducts = [
  { name: "Etta Goat Milk", price: 75000 },
  { name: "Laurik", price: 90000 },
  { name: "Mengkudu", price: 80000 },
  { name: "Magafit", price: 95000 },
  { name: "Fitago", price: 110000 },
];

export default function DataPenjualanPage() {
  const [sales, setSales] = useState<SalesTransaction[]>(initialSales);
  const [filterRange, setFilterRange] = useState<"all" | "day" | "week" | "month">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [salesName, setSalesName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(availableProducts[0].name);
  const [qty, setQty] = useState(1);
  const [customPrice, setCustomPrice] = useState(availableProducts[0].price);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);

  // Handle product select change to auto-update unit price
  const handleProductChange = (productName: string) => {
    setSelectedProduct(productName);
    const prod = availableProducts.find(p => p.name === productName);
    if (prod) {
      setCustomPrice(prod.price);
    }
  };

  // Add new sale item
  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salesName || qty <= 0 || customPrice <= 0) return;

    const newTx: SalesTransaction = {
      id: `tx-${Math.random().toString(36).substring(2, 9)}`,
      salesName,
      itemName: selectedProduct,
      qty,
      unitPrice: customPrice,
      totalPrice: qty * customPrice,
      date: new Date(saleDate),
    };

    setSales(prev => [newTx, ...prev]);

    // Reset form
    setSalesName("");
    setSelectedProduct(availableProducts[0].name);
    setQty(1);
    setCustomPrice(availableProducts[0].price);
    setSaleDate(new Date().toISOString().split("T")[0]);
    setIsModalOpen(false);
  };

  // Delete transaction
  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data penjualan ini?")) {
      setSales(prev => prev.filter(s => s.id !== id));
    }
  };

  // Filter transactions based on date
  const filteredSales = sales.filter(item => {
    const itemDate = new Date(item.date);
    const today = new Date();
    
    // Reset hours for accurate calendar day comparison
    const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()).getTime();
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    if (filterRange === "day") {
      return itemDay === todayDay;
    }
    if (filterRange === "week") {
      const oneWeekAgo = todayDay - 7 * 24 * 60 * 60 * 1000;
      return itemDay >= oneWeekAgo && itemDay <= todayDay;
    }
    if (filterRange === "month") {
      const oneMonthAgo = todayDay - 30 * 24 * 60 * 60 * 1000;
      return itemDay >= oneMonthAgo && itemDay <= todayDay;
    }
    return true; // 'all'
  });

  // Calculate metrics
  const totalRevenue = filteredSales.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalQty = filteredSales.reduce((acc, curr) => acc + curr.qty, 0);
  const totalTransactions = filteredSales.length;

  // Dynamic sales recap calculation based on filteredSales
  const salesRecaps = React.useMemo(() => {
    const recapMap: Record<string, { qty: number; revenue: number; txCount: number }> = {};
    
    filteredSales.forEach(item => {
      const name = item.salesName;
      if (!recapMap[name]) {
        recapMap[name] = { qty: 0, revenue: 0, txCount: 0 };
      }
      recapMap[name].qty += item.qty;
      recapMap[name].revenue += item.totalPrice;
      recapMap[name].txCount += 1;
    });

    return Object.entries(recapMap).map(([salesName, data]) => {
      // Logic for status: if revenue > 300,000, consider it verified, else pending
      const depositStatus = data.revenue >= 300000 ? "Selesai Disetor" : "Verifikasi";
      return {
        salesName,
        txCount: data.txCount,
        totalQty: data.qty,
        totalRevenue: data.revenue,
        status: depositStatus
      };
    });
  }, [filteredSales]);

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
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#312e81] hover:bg-[#1e1b4b] text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-md shadow-indigo-900/10 w-fit"
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
              Rp {totalRevenue.toLocaleString("id-ID")}
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

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
            <Filter size={18} className="text-[#312e81]" />
            Daftar Transaksi Penjualan
          </h3>
          
          {/* Time Filter Buttons */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200">
            <button
              onClick={() => setFilterRange("all")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterRange === "all"
                  ? "bg-white text-[#312e81] shadow-sm"
                  : "text-[#464652] hover:text-[#0b1c30]"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterRange("day")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterRange === "day"
                  ? "bg-white text-[#312e81] shadow-sm"
                  : "text-[#464652] hover:text-[#0b1c30]"
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setFilterRange("week")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterRange === "week"
                  ? "bg-white text-[#312e81] shadow-sm"
                  : "text-[#464652] hover:text-[#0b1c30]"
              }`}
            >
              Minggu Ini
            </button>
            <button
              onClick={() => setFilterRange("month")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterRange === "month"
                  ? "bg-white text-[#312e81] shadow-sm"
                  : "text-[#464652] hover:text-[#0b1c30]"
              }`}
            >
              Bulan Ini
            </button>
          </div>
        </div>

        {/* Sales Table element */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#464652] font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-bold">Nama Sales</th>
                <th className="px-6 py-4 font-bold">Nama Barang</th>
                <th className="px-6 py-4 font-bold text-center">Jumlah (Qty)</th>
                <th className="px-6 py-4 font-bold text-right">Harga Satuan</th>
                <th className="px-6 py-4 font-bold text-right">Total Harga</th>
                <th className="px-6 py-4 font-bold">Tanggal</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShoppingCart size={40} className="text-slate-300" />
                      <span className="font-semibold text-sm">Tidak ada data penjualan untuk filter ini</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSales.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-sm text-[#0b1c30]">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-50 text-[#312e81] rounded-full flex items-center justify-center font-bold text-xs">
                          {item.salesName[0]}
                        </div>
                        {item.salesName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#464652]">
                      <span className="bg-[#f0edec] px-2.5 py-1 rounded-full text-xs font-semibold text-[#0b1c30]">
                        {item.itemName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-semibold text-[#0b1c30]">
                      {item.qty}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-[#464652]">
                      Rp {item.unitPrice.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-[#312e81]">
                      Rp {item.totalPrice.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-[#ba1a1a] hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recap Setoran Per Sales */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
            <ClipboardCheck size={18} className="text-[#312e81]" />
            Rekap Setoran Hasil Penjualan Sales
          </h3>
          <span className="text-xs bg-indigo-50 text-[#312e81] px-3 py-1 rounded-full font-bold">
            Filter Aktif: {filterRange === "all" ? "Semua Waktu" : filterRange === "day" ? "Hari Ini" : filterRange === "week" ? "Minggu Ini" : "Bulan Ini"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#464652] font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-bold">Nama Sales</th>
                <th className="px-6 py-4 font-bold text-center">Jumlah Transaksi</th>
                <th className="px-6 py-4 font-bold text-center">Produk Terjual</th>
                <th className="px-6 py-4 font-bold text-right">Total Hasil Setoran</th>
                <th className="px-6 py-4 font-bold text-center">Status Setoran</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salesRecaps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <User size={40} className="text-slate-300" />
                      <span className="font-semibold text-sm">Tidak ada rekap setoran sales untuk filter ini</span>
                    </div>
                  </td>
                </tr>
              ) : (
                salesRecaps.map((recap, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-sm text-[#0b1c30]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-indigo-50 text-[#312e81] rounded-full flex items-center justify-center font-bold text-xs">
                          {recap.salesName[0]}
                        </div>
                        {recap.salesName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-semibold text-[#0b1c30]">
                      {recap.txCount} kali
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-semibold text-slate-600">
                      {recap.totalQty} pcs
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-[#312e81]">
                      Rp {recap.totalRevenue.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase border ${
                          recap.status === "Selesai Disetor"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          recap.status === "Selesai Disetor" ? "bg-emerald-500" : "bg-amber-500"
                        }`}></span>
                        {recap.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => alert(`Setoran dari "${recap.salesName}" senilai Rp ${recap.totalRevenue.toLocaleString("id-ID")} berhasil diverifikasi.`)}
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

      {/* POP-UP MODAL FORM FOR ADDING SALE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
                <Plus size={20} className="text-[#312e81]" />
                Tambah Transaksi Penjualan
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-[#0b1c30] p-1.5 hover:bg-slate-200 rounded-full transition-all"
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSale} className="p-6 space-y-5">
              {/* Sales Rep Name */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                  Nama Sales Agent
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={salesName}
                    onChange={(e) => setSalesName(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-3 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81] focus:ring-1 focus:ring-[#312e81] transition-all"
                  />
                </div>
              </div>

              {/* Product Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                    Pilih Barang Herbal
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-3 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                  >
                    {availableProducts.map((p, idx) => (
                      <option key={idx} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom price */}
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                    Harga Satuan (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-3 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                  />
                </div>
              </div>

              {/* Qty & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                    Jumlah Barang (Qty)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-3 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                    Tanggal Transaksi
                  </label>
                  <input
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-3 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                  />
                </div>
              </div>

              {/* Dynamic Live Total Price Preview */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center text-sm font-semibold">
                <span className="text-[#464652]">Total Harga Transaksi:</span>
                <span className="text-xl text-[#312e81] font-bold">
                  Rp {(qty * customPrice).toLocaleString("id-ID")}
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold rounded-xl hover:bg-slate-100 text-[#464652] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#312e81] text-white rounded-xl hover:bg-[#1e1b4b] active:scale-95 transition-all shadow-md shadow-indigo-900/10"
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
