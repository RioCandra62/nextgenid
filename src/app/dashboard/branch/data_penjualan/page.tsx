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

  // Calculate metrics
  const totalRevenue = transc.reduce((acc, t) => acc + (t.price * t.qts), 0);
  const totalQty = transc.reduce((acc, t) => acc + t.qts, 0);
  const totalTransactions = transc.length;

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

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
            <Filter size={18} className="text-[#312e81]" />
            Daftar Transaksi Penjualan
          </h3>
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
                <th className="px-6 py-4 font-bold text-center">Tanggal</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transc.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShoppingCart size={40} className="text-slate-300" />
                      <span className="font-semibold text-sm">Belum ada data transaksi penjualan</span>
                    </div>
                  </td>
                </tr>
              ) : (
                transc.map((t, idx) => (
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
