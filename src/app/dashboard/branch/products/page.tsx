"use client";

import React, { useEffect, useState } from "react";
import { getDataPenjualan, addProduct, addProductStock, editProduct } from "@/app/lib/branch/data_product";
import { Filter, ShoppingCart, Plus, PackageOpen, Layers, Edit3 } from "lucide-react";
import FormatRupiah from "@/app/lib/helper";

export default function BranchProductsPage() {
  const [product, setProducts] = useState<any[]>([]);

  // Add Product modal form states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductStock, setNewProductStock] = useState("");

  // Edit Product modal form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState("");
  const [editProductName, setEditProductName] = useState("");
  const [editProductPrice, setEditProductPrice] = useState("");
  const [editProductStock, setEditProductStock] = useState("");

  // Add Stock modal states
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");
  const [additionalStock, setAdditionalStock] = useState(1);

  async function loadProducts() {
    try {
      const result = await getDataPenjualan();
      setProducts(result);
    } catch (error) {
      console.error("Gagal memuat produk:", error);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle Add Product submit
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !newProductStock) {
      alert("Harap lengkapi semua data form!");
      return;
    }

    const formData = new FormData();
    formData.append("product_name", newProductName);
    formData.append("price", newProductPrice);
    formData.append("stock", newProductStock);

    try {
      const result = await addProduct(formData);
      if (result.success) {
        alert(`Produk "${newProductName}" berhasil didaftarkan!`);
        setIsAddModalOpen(false);
        // Reset states
        setNewProductName("");
        setNewProductPrice("");
        setNewProductStock("");
        loadProducts();
      }
    } catch (error: any) {
      alert(error.message || "Gagal menambahkan produk baru");
    }
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (p: any) => {
    setEditProductId(p.product_id);
    setEditProductName(p.product_name || "");
    setEditProductPrice((p.price || 0).toString());
    setEditProductStock((p.stock ?? 0).toString());
    setIsEditModalOpen(true);
  };

  // Handle Edit Product Submit
  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProductId || !editProductName || !editProductPrice || !editProductStock) {
      alert("Harap lengkapi semua kolom form edit!");
      return;
    }

    const formData = new FormData();
    formData.append("product_id", editProductId);
    formData.append("product_name", editProductName);
    formData.append("price", editProductPrice);
    formData.append("stock", editProductStock);

    try {
      const result = await editProduct(formData);
      if (result.success) {
        alert(`Produk "${editProductName}" berhasil diperbarui!`);
        setIsEditModalOpen(false);
        loadProducts();
      }
    } catch (error: any) {
      alert(error.message || "Gagal mengedit produk");
    }
  };

  // Open Add Stock modal
  const handleOpenStockModal = (id: string, name: string) => {
    setSelectedProductId(id);
    setSelectedProductName(name);
    setAdditionalStock(0);
    setIsStockModalOpen(true);
  };

  // Handle Add Stock submit
  const handleAddStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || additionalStock <= 0) return;

    try {
      const result = await addProductStock(selectedProductId, additionalStock);
      if (result.success) {
        alert(`Berhasil menambahkan ${additionalStock} unit stok ke "${selectedProductName}"!`);
        setIsStockModalOpen(false);
        loadProducts();
      }
    } catch (error: any) {
      alert(error.message || "Gagal memperbarui stok");
    }
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
            Data Stok Produk
          </h1>
          <p className="text-[14px] text-[#464652] mt-2">
            Manajemen dan pemantauan detail stok barang herbal per cabang.
          </p>
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#312e81] hover:bg-[#1e1b4b] text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-md shadow-indigo-900/10 w-fit cursor-pointer"
        >
          <Plus size={20} />
          Tambah Produk Baru
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
            <Filter size={18} className="text-[#312e81]" />
            Daftar Barang Herbal
          </h3>
        </div>

        {/* Sales Table element */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#464652] font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-bold">No</th>
                <th className="px-6 py-4 font-bold">Nama Barang</th>
                <th className="px-6 py-4 font-bold text-center">Stok</th>
                <th className="px-6 py-4 font-bold text-right">Harga</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {product.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShoppingCart size={40} className="text-slate-350" />
                      <span className="font-semibold text-sm">Belum ada data produk terdaftar</span>
                    </div>
                  </td>
                </tr>
              ) : (
                product.map((p, idx) => (
                  <tr key={p.product_id || idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#0b1c30]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-indigo-50 text-[#312e81] rounded-full flex items-center justify-center">
                          <PackageOpen size={16} />
                        </div>
                        {p.product_name || "Unknown Product"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#0b1c30] text-center">
                      {p.stock ?? 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#312e81] text-right">
                      {FormatRupiah(p.price || 0)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase border ${
                          p.stock >= 5
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : p.stock === 0
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          p.stock >= 5 ? "bg-emerald-500" : p.stock === 0 ? "bg-rose-500" : "bg-amber-500"
                        }`}></span>
                        {p.stock >= 5 ? "Stock Aman" : p.stock === 0 ? "Stock Habis" : "Stock Menipis"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center flex flex-row gap-6 justify-evenly">
                      <button
                        onClick={() => handleOpenStockModal(p.product_id, p.product_name)}
                        className="text-xs font-extrabold text-[#312e81] hover:underline cursor-pointer bg-transparent border-0"
                      >
                        Tambah Stock
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="text-xs font-extrabold text-amber-500 hover:underline cursor-pointer bg-transparent border-0"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POP-UP MODAL: TAMBAH PRODUK BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-[60vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#312e81] text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Plus size={20} />
                Tambah Produk Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white hover:bg-white/10 p-1.5 rounded-full transition-all border-0 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Madu Premium HNI"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                  Harga Satuan (Rp) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="Contoh: 120000"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                />
              </div>

              {/* Initial Stock */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                  Jumlah Stok Awal *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  placeholder="Contoh: 25"
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold rounded-xl hover:bg-slate-100 text-[#464652] transition-colors border-0 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#312e81] text-white rounded-xl hover:bg-[#1e1b4b] active:scale-95 transition-all shadow-md shadow-indigo-900/10 cursor-pointer"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POP-UP MODAL: EDIT PRODUK */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-[60vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#312e81] text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Edit3 size={18} />
                Edit Detail Produk
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white hover:bg-white/10 p-1.5 rounded-full transition-all border-0 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditProductSubmit} className="p-6 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  required
                  value={editProductName}
                  onChange={(e) => setEditProductName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                  Harga Satuan (Rp) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={editProductPrice}
                  onChange={(e) => setEditProductPrice(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                  Stok Produk *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={editProductStock}
                  onChange={(e) => setEditProductStock(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold rounded-xl hover:bg-slate-100 text-[#464652] transition-colors border-0 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#312e81] text-white rounded-xl hover:bg-[#1e1b4b] active:scale-95 transition-all shadow-md shadow-indigo-900/10 cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POP-UP MODAL: TAMBAH STOK PRODUK */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#312e81] text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Layers size={18} />
                Tambah Stok
              </h3>
              <button
                onClick={() => setIsStockModalOpen(false)}
                className="text-white hover:bg-white/10 p-1.5 rounded-full transition-all border-0 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddStockSubmit} className="p-6 space-y-4">
              {/* Product Info */}
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl">
                <span className="block text-[10px] font-bold text-[#312e81] uppercase tracking-wider mb-0.5">Nama Produk</span>
                <span className="text-sm font-bold text-[#0b1c30]">{selectedProductName}</span>
              </div>

              {/* Quantity input */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                  Jumlah Tambahan Stok *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={additionalStock}
                  onChange={(e) => setAdditionalStock(Math.max(1, Number(e.target.value)))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold rounded-xl hover:bg-slate-100 text-[#464652] transition-colors border-0 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#312e81] text-white rounded-xl hover:bg-[#1e1b4b] active:scale-95 transition-all shadow-md shadow-indigo-900/10 cursor-pointer"
                >
                  Tambah Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}