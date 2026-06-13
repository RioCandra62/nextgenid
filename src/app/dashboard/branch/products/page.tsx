"use client"
import React from "react"

import { Filter, ShoppingCart,  } from "lucide-react"

export default function BranchProductsPage() {
    return(
        <section>
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
            </div>

            {/* Aggregate KPI Stat Cards */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
            <Filter size={18} className="text-[#312e81]" />
            Daftar Transaksi Penjualan
          </h3>
          
          {/* Time Filter Buttons */}

        </div>

        {/* Sales Table element */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#464652] font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-bold">No</th>
                <th className="px-6 py-4 font-bold">ID Barang</th>
                <th className="px-6 py-4 font-bold text-center">Nama Barang</th>
                <th className="px-6 py-4 font-bold text-right">Stok Awal</th>
                <th className="px-6 py-4 font-bold text-right">Stok Akhir</th>
                <th className="px-6 py-4 font-bold">Selisih</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">

            </tbody>
          </table>
        </div>
      </div>
        </section>
    )
}