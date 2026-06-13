"use client";

import React, { useState } from "react";

interface CompanyBranch {
  id: string;
  name: string;
  region: string;
  revenue: number;
  goal: number;
  manager: string;
  status: "Above Target" | "On Target" | "Needs Review";
}

// Available managers pool for assignment
const AVAILABLE_MANAGERS = [
  "Belum Ditugaskan",
  "Alex Miller",
  "Sarah Jenkins",
  "Kenji Sato",
  "Lin Wei",
  "Michael Chang",
  "David Beck",
  "Sophia Loren",
  "Diana Prince"
];

export default function BranchPage() {
  // Initial Mock Data matching original design aggregates
  const [branches, setBranches] = useState<CompanyBranch[]>([
    { id: "b1", name: "Jakarta", region: "North America", revenue: 1240000, goal: 1500000, manager: "Alex Miller", status: "Above Target" },
    { id: "b2", name: "Bandung", region: "Europe", revenue: 980000, goal: 1200000, manager: "Sarah Jenkins", status: "On Target" },
    { id: "b3", name: "Surabaya", region: "Asia Pacific", revenue: 1450000, goal: 1600000, manager: "Kenji Sato", status: "Above Target" },
    { id: "b4", name: "Semarang", region: "Asia Pacific", revenue: 720000, goal: 1000000, manager: "Lin Wei", status: "Needs Review" }
  ]);

  // States
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals Visibility
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Add Form fields
  const [addName, setAddName] = useState("");
  const [addRegion, setAddRegion] = useState("");
  const [addRevenue, setAddRevenue] = useState(0);
  const [addGoal, setAddGoal] = useState(0);
  const [addManager, setAddManager] = useState("Belum Ditugaskan");

  // Edit Form fields
  const [editName, setEditName] = useState("");
  const [editRegion, setEditRegion] = useState("");
  const [editRevenue, setEditRevenue] = useState(0);
  const [editGoal, setEditGoal] = useState(0);

  // Assign Manager field
  const [assignedManager, setAssignedManager] = useState("");

  // Filtered branches
  const filteredBranches = branches.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.manager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBranch = branches.find(b => b.id === selectedBranchId);

  // Aggregates
  const totalBranches = branches.length;
  const totalRevenue = branches.reduce((sum, b) => sum + b.revenue, 0);
  const totalGoal = branches.reduce((sum, b) => sum + b.goal, 0);
  const aggregateGoalPercentage = totalGoal > 0 ? Math.round((totalRevenue / totalGoal) * 100) : 0;

  // Determine status automatically based on progress
  const getComputedStatus = (rev: number, goal: number): CompanyBranch["status"] => {
    const ratio = rev / goal;
    if (ratio >= 0.95) return "Above Target";
    if (ratio >= 0.8) return "On Target";
    return "Needs Review";
  };

  // Create
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addRegion || addGoal <= 0) {
      alert("Harap lengkapi formulir dengan benar. Target Goal harus lebih dari 0.");
      return;
    }

    const newBranch: CompanyBranch = {
      id: `b-${Date.now()}`,
      name: addName,
      region: addRegion,
      revenue: Number(addRevenue),
      goal: Number(addGoal),
      manager: addManager,
      status: getComputedStatus(Number(addRevenue), Number(addGoal))
    };

    setBranches(prev => [...prev, newBranch]);
    setIsAddModalOpen(false);
    
    // Reset Form
    setAddName("");
    setAddRegion("");
    setAddRevenue(0);
    setAddGoal(0);
    setAddManager("Belum Ditugaskan");

    alert("Cabang baru berhasil didaftarkan.");
  };

  // Edit fields loader
  const openEditModal = () => {
    if (!selectedBranch) return;
    setEditName(selectedBranch.name);
    setEditRegion(selectedBranch.region);
    setEditRevenue(selectedBranch.revenue);
    setEditGoal(selectedBranch.goal);
    setIsEditModalOpen(true);
  };

  // Update details
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranchId || !editName || !editRegion || editGoal <= 0) {
      alert("Harap isi semua kolom wajib.");
      return;
    }

    setBranches(prev => prev.map(b =>
      b.id === selectedBranchId
        ? {
            ...b,
            name: editName,
            region: editRegion,
            revenue: Number(editRevenue),
            goal: Number(editGoal),
            status: getComputedStatus(Number(editRevenue), Number(editGoal))
          }
        : b
    ));

    setIsEditModalOpen(false);
    alert("Detail kantor cabang berhasil disimpan.");
  };

  // Open assign manager modal
  const openAssignModal = () => {
    if (!selectedBranch) return;
    setAssignedManager(selectedBranch.manager);
    setIsAssignModalOpen(true);
  };

  // Update Assigned Manager
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranchId) return;

    setBranches(prev => prev.map(b =>
      b.id === selectedBranchId ? { ...b, manager: assignedManager } : b
    ));

    setIsAssignModalOpen(false);
    alert(`Manager "${assignedManager}" berhasil ditugaskan ke cabang.`);
  };

  // Delete Branch
  const handleDelete = () => {
    if (!selectedBranchId) return;
    if (confirm(`Apakah Anda yakin ingin menghapus cabang "${selectedBranch?.name}"?`)) {
      setBranches(prev => prev.filter(b => b.id !== selectedBranchId));
      setSelectedBranchId(null);
      alert("Kantor cabang berhasil dihapus dari daftar.");
    }
  };

  return (
    <main className="md:ml-64 flex-1 p-8 bg-[#f8f9ff] min-h-screen font-sans text-[#0b1c30]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[12px] text-[#312e81] font-extrabold tracking-widest uppercase mb-1 block">
            Executive Control Panel
          </span>
          <h1 className="text-[32px] font-bold text-[#0b1c30] leading-tight">
            Manajemen Kantor Cabang
          </h1>
          <p className="text-[14px] text-[#464652] mt-1">
            Pantau performa pendapatan cabang, tentukan target penjualan, serta tugaskan Branch Manager regional.
          </p>
        </div>
      </div>

      {/* Aggregate KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Branches */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[72px] text-[#312e81]">
              storefront
            </span>
          </div>
          <h3 className="text-[14px] font-bold text-[#464652] mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#312e81] text-[18px]">
              apartment
            </span>
            Total Kantor Cabang
          </h3>
          <span className="text-[32px] font-bold text-[#0b1c30] leading-none">
            {totalBranches}
          </span>
          <p className="text-xs text-[#777683] mt-2 font-medium">Beroperasi secara global di 3 region utama</p>
        </div>

        {/* Total Aggregated Revenue */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[72px] text-emerald-600">
              payments
            </span>
          </div>
          <h3 className="text-[14px] font-bold text-[#464652] mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">
              monetization_on
            </span>
            Total Pendapatan Cabang
          </h3>
          <span className="text-[32px] font-bold text-emerald-600 leading-none">
            ${(totalRevenue / 1000000).toFixed(2)}M
          </span>
          <p className="text-xs text-[#777683] mt-2 font-medium">Akumulasi penjualan seluruh divisi</p>
        </div>

        {/* Aggregated Target Goal */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[72px] text-indigo-600">
              military_tech
            </span>
          </div>
          <h3 className="text-[14px] font-bold text-[#464652] mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-[18px]">
              trending_up
            </span>
            Pencapaian Target Global
          </h3>
          <span className="text-[32px] font-bold text-indigo-600 leading-none">
            {aggregateGoalPercentage}%
          </span>
          <p className="text-xs text-[#777683] mt-2 font-medium">Dari target global sebesar ${(totalGoal / 1000000).toFixed(2)}M</p>
        </div>

      </div>

      {/* Main Interactive Table & Filter Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white">
          {/* Left: Search Bar & Selection Indicator */}
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-[320px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Cari cabang, region, manager..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f8f9ff] hover:bg-slate-50 border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg pl-10 pr-4 py-2 text-[13px] outline-none transition-all"
              />
            </div>
            {selectedBranchId && (
              <span className="text-[12px] font-semibold text-[#312e81] bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#312e81] animate-pulse"></span>
                1 Cabang Terpilih
              </span>
            )}
          </div>

          {/* Right: CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* ADD Branch Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#312e81] text-white px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-indigo-900 shadow-md shadow-indigo-950/10 active:scale-95 transition-all border-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Tambah Cabang
            </button>

            {/* EDIT Branch Button */}
            <button
              onClick={openEditModal}
              disabled={!selectedBranchId}
              className="flex items-center gap-1.5 bg-white border border-slate-200 text-[#0b1c30] px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Detail
            </button>

            {/* ASSIGN MANAGER Button */}
            <button
              onClick={openAssignModal}
              disabled={!selectedBranchId}
              className="flex items-center gap-1.5 bg-indigo-650 border border-indigo-700 text-white px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">assignment_ind</span>
              Assign Manager
            </button>

            {/* DELETE Branch Button */}
            <button
              onClick={handleDelete}
              disabled={!selectedBranchId}
              className="flex items-center gap-1.5 bg-rose-600 text-white px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-rose-700 shadow-md shadow-rose-750/10 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none border-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">delete_forever</span>
              Hapus
            </button>

          </div>
        </div>

        {/* Responsive Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fcfcff] text-[#464652] font-semibold text-[11px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 w-12 text-center font-bold">Select</th>
                <th className="px-6 py-4 font-bold">Nama Kantor Cabang</th>
                <th className="px-6 py-4 font-bold">Wilayah / Region</th>
                <th className="px-6 py-4 font-bold">Progress Target Penjualan</th>
                <th className="px-6 py-4 font-bold">Total Penjualan (USD)</th>
                <th className="px-6 py-4 font-bold">Status Cabang</th>
                <th className="px-6 py-4 font-bold">Branch Manager</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBranches.length > 0 ? (
                filteredBranches.map((branch) => {
                  const isSelected = selectedBranchId === branch.id;
                  const completionPct = Math.min(100, Math.round((branch.revenue / branch.goal) * 100));
                  return (
                    <tr
                      key={branch.id}
                      onClick={() => setSelectedBranchId(isSelected ? null : branch.id)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer select-none ${
                        isSelected ? "bg-indigo-50/45 hover:bg-indigo-50/60" : ""
                      }`}
                    >
                      {/* Checkbox selector column */}
                      <td className="px-6 py-4.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="radio"
                          name="selectedBranch"
                          checked={isSelected}
                          onChange={() => setSelectedBranchId(isSelected ? null : branch.id)}
                          className="w-4 h-4 text-[#312e81] border-slate-300 focus:ring-[#312e81] accent-[#312e81] cursor-pointer"
                        />
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4.5 font-bold text-[14px] text-[#0b1c30]">
                        {branch.name}
                      </td>

                      {/* Region */}
                      <td className="px-6 py-4.5 text-[13px] font-semibold text-slate-600">
                        {branch.region}
                      </td>

                      {/* Progress bar */}
                      <td className="px-6 py-4.5 text-[13px] w-48">
                        <div className="flex flex-col gap-1">
                          <span className="text-[12px] font-bold text-[#0b1c30]">
                            {completionPct}% dari target
                          </span>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#312e81] h-full"
                              style={{ width: `${completionPct}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Revenue vs Goal numbers */}
                      <td className="px-6 py-4.5 text-[13px] font-semibold text-[#464652]">
                        <span className="font-bold text-[#0b1c30]">${branch.revenue.toLocaleString()}</span>
                        <span className="text-slate-400 block text-[11px] font-medium">Target: ${branch.goal.toLocaleString()}</span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase ${
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
                      </td>

                      {/* Assigned Manager */}
                      <td className="px-6 py-4.5 text-[13px]">
                        <span className={`inline-flex items-center gap-1 font-bold ${
                          branch.manager === "Belum Ditugaskan" ? "text-slate-400 italic" : "text-indigo-850"
                        }`}>
                          <span className="material-symbols-outlined text-[16px] text-slate-400">
                            assignment_ind
                          </span>
                          {branch.manager}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                    <span className="material-symbols-outlined text-[48px] block mb-2 opacity-50">
                      sentiment_dissatisfied
                    </span>
                    Tidak ada kantor cabang yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info row */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[11px] font-semibold text-slate-500 rounded-b-xl">
          <span>Menampilkan {filteredBranches.length} dari {totalBranches} total kantor cabang</span>
          <span>NextGenID Region Hub v1.2</span>
        </div>

      </div>

      {/* ==================== ADD BRANCH MODAL ==================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-[500px] rounded-2xl shadow-2xl shadow-indigo-950/20 overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-[#312e81] p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-[18px] font-bold">Tambah Kantor Cabang</h2>
                <p className="text-[12px] text-white/70 mt-0.5">Daftarkan cabang unit regional baru.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg border-0 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              
              {/* Branch Name field */}
              <div className="space-y-1">
                <label className="block text-[12px] font-bold text-slate-700 uppercase">Nama Cabang *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tokyo Marunouchi Hub"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all"
                />
              </div>

              {/* Region field */}
              <div className="space-y-1">
                <label className="block text-[12px] font-bold text-slate-700 uppercase">Wilayah / Region *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Asia Pacific, Europe, North America"
                  value={addRegion}
                  onChange={(e) => setAddRegion(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all"
                />
              </div>

              {/* Grid for Revenue and Goal */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Initial Revenue */}
                <div className="space-y-1">
                  <label className="block text-[12px] font-bold text-slate-700 uppercase">Revenue Awal (USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={addRevenue}
                    onChange={(e) => setAddRevenue(Number(e.target.value))}
                    className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all"
                  />
                </div>

                {/* Target Goal */}
                <div className="space-y-1">
                  <label className="block text-[12px] font-bold text-slate-700 uppercase">Target Goal (USD) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={addGoal}
                    onChange={(e) => setAddGoal(Number(e.target.value))}
                    className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all"
                  />
                </div>

              </div>

              {/* Initial Manager assignment dropdown */}
              <div className="space-y-1">
                <label className="block text-[12px] font-bold text-slate-700 uppercase">Tugaskan Branch Manager</label>
                <select
                  value={addManager}
                  onChange={(e) => setAddManager(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all cursor-pointer"
                >
                  {AVAILABLE_MANAGERS.map((mgr) => (
                    <option key={mgr} value={mgr}>{mgr}</option>
                  ))}
                </select>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-[#0b1c30] px-5 py-2.5 rounded-lg text-[13px] font-bold active:scale-95 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#312e81] hover:bg-indigo-900 text-white px-5 py-2.5 rounded-lg text-[13px] font-bold active:scale-95 transition-all border-0 cursor-pointer"
                >
                  Tambah Cabang
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==================== EDIT BRANCH DETAILS MODAL ==================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-[500px] rounded-2xl shadow-2xl shadow-indigo-950/20 overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-[#312e81] p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-[18px] font-bold">Edit Detail Cabang</h2>
                <p className="text-[12px] text-white/70 mt-0.5">Ubah informasi nama, region, dan target performa cabang.</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg border-0 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              
              {/* Branch Name field */}
              <div className="space-y-1">
                <label className="block text-[12px] font-bold text-slate-700 uppercase">Nama Cabang *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all"
                />
              </div>

              {/* Region field */}
              <div className="space-y-1">
                <label className="block text-[12px] font-bold text-slate-700 uppercase">Wilayah / Region *</label>
                <input
                  type="text"
                  required
                  value={editRegion}
                  onChange={(e) => setEditRegion(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all"
                />
              </div>

              {/* Grid for Revenue and Goal */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Revenue */}
                <div className="space-y-1">
                  <label className="block text-[12px] font-bold text-slate-700 uppercase">Total Revenue (USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={editRevenue}
                    onChange={(e) => setEditRevenue(Number(e.target.value))}
                    className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all"
                  />
                </div>

                {/* Target Goal */}
                <div className="space-y-1">
                  <label className="block text-[12px] font-bold text-slate-700 uppercase">Target Goal (USD) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editGoal}
                    onChange={(e) => setEditGoal(Number(e.target.value))}
                    className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all"
                  />
                </div>

              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-[#0b1c30] px-5 py-2.5 rounded-lg text-[13px] font-bold active:scale-95 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#312e81] hover:bg-indigo-900 text-white px-5 py-2.5 rounded-lg text-[13px] font-bold active:scale-95 transition-all border-0 cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==================== ASSIGN MANAGER MODAL ==================== */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-[460px] rounded-2xl shadow-2xl shadow-indigo-950/20 overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-[#312e81] p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-[18px] font-bold">Tugaskan Branch Manager</h2>
                <p className="text-[12px] text-white/70 mt-0.5">Assign atau re-assign manager regional untuk cabang.</p>
              </div>
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg border-0 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
              
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-4">
                <span className="block text-[11px] font-extrabold uppercase text-[#312e81] tracking-wider mb-1">
                  Unit Kerja Aktif
                </span>
                <span className="text-[16px] font-extrabold text-[#0b1c30]">
                  {selectedBranch?.name}
                </span>
                <span className="block text-[12px] text-[#464652] mt-0.5">
                  Region: {selectedBranch?.region}
                </span>
              </div>

              {/* Manager assignment dropdown */}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-bold text-slate-700 uppercase">Pilih Nama Manager *</label>
                <select
                  value={assignedManager}
                  onChange={(e) => setAssignedManager(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-3 text-[13px] font-semibold outline-none transition-all cursor-pointer"
                >
                  {AVAILABLE_MANAGERS.map((mgr) => (
                    <option key={mgr} value={mgr}>{mgr}</option>
                  ))}
                </select>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-[#0b1c30] px-5 py-2.5 rounded-lg text-[13px] font-bold active:scale-95 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#312e81] hover:bg-indigo-900 text-white px-5 py-2.5 rounded-lg text-[13px] font-bold active:scale-95 transition-all border-0 cursor-pointer"
                >
                  Simpan Penugasan
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </main>
  );
}