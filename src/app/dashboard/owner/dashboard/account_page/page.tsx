"use client";

import React, { useState } from "react";

interface Account {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Branch Manager" | "Sales Agent";
  branch: string;
  status: "Active" | "Revoked";
  createdAt: string;
}

export default function AccountPage() {
  // Initial Mock Data matching the dashboard's design parameters
  const [accounts, setAccounts] = useState<Account[]>([
    { id: "acc-1", name: "Alex Miller", email: "alex.miller@nextgen.id", role: "Branch Manager", branch: "NYC Downtown", status: "Active", createdAt: "2026-01-15" },
    { id: "acc-2", name: "Sarah Jenkins", email: "sarah.jenkins@nextgen.id", role: "Branch Manager", branch: "London Financial", status: "Active", createdAt: "2026-02-10" },
    { id: "acc-3", name: "Kenji Sato", email: "kenji.sato@nextgen.id", role: "Branch Manager", branch: "Tokyo Marunouchi", status: "Active", createdAt: "2026-03-01" },
    { id: "acc-4", name: "John Doe", email: "john.doe@nextgen.id", role: "Sales Agent", branch: "NYC Downtown", status: "Revoked", createdAt: "2026-04-12" },
    { id: "acc-5", name: "Jane Smith", email: "jane.smith@nextgen.id", role: "Sales Agent", branch: "London Financial", status: "Active", createdAt: "2026-05-02" },
  ]);

  // Selected account state for single-action triggers (Edit, Activate, Revoke)
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  
  // Search query state
  const [searchQuery, setSearchQuery] = useState("");

  // Modal visibility states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states for Add Account
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<Account["role"]>("Sales Agent");
  const [addBranch, setAddBranch] = useState("");
  const [addStatus, setAddStatus] = useState<Account["status"]>("Active");

  // Form states for Edit Account
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<Account["role"]>("Sales Agent");
  const [editBranch, setEditBranch] = useState("");
  const [editStatus, setEditStatus] = useState<Account["status"]>("Active");

  // Calculate aggregates
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter(a => a.status === "Active").length;
  const revokedAccounts = accounts.filter(a => a.status === "Revoked").length;

  // Filtered accounts based on search query
  const filteredAccounts = accounts.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get currently selected account object
  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  // Handle Activate Action
  const handleActivate = () => {
    if (!selectedAccountId) return;
    setAccounts(prev => prev.map(acc => 
      acc.id === selectedAccountId ? { ...acc, status: "Active" } : acc
    ));
    alert("Akun berhasil diaktifkan.");
  };

  // Handle Revoke Action
  const handleRevoke = () => {
    if (!selectedAccountId) return;
    setAccounts(prev => prev.map(acc => 
      acc.id === selectedAccountId ? { ...acc, status: "Revoked" } : acc
    ));
    alert("Akses akun berhasil dicabut (Revoked).");
  };

  // Open Edit Modal with pre-populated values
  const openEditModal = () => {
    if (!selectedAccount) return;
    setEditName(selectedAccount.name);
    setEditEmail(selectedAccount.email);
    setEditRole(selectedAccount.role);
    setEditBranch(selectedAccount.branch);
    setEditStatus(selectedAccount.status);
    setIsEditModalOpen(true);
  };

  // Handle Add Account Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addEmail || !addBranch) {
      alert("Harap isi semua kolom wajib.");
      return;
    }

    const newAccount: Account = {
      id: `acc-${Date.now()}`,
      name: addName,
      email: addEmail,
      role: addRole,
      branch: addBranch,
      status: addStatus,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setAccounts(prev => [newAccount, ...prev]);
    setIsAddModalOpen(false);
    
    // Reset fields
    setAddName("");
    setAddEmail("");
    setAddRole("Sales Agent");
    setAddBranch("");
    setAddStatus("Active");

    alert("Akun baru berhasil ditambahkan.");
  };

  // Handle Edit Account Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId || !editName || !editEmail || !editBranch) {
      alert("Harap isi semua kolom wajib.");
      return;
    }

    setAccounts(prev => prev.map(acc => 
      acc.id === selectedAccountId 
        ? { ...acc, name: editName, email: editEmail, role: editRole, branch: editBranch, status: editStatus }
        : acc
    ));
    setIsEditModalOpen(false);
    alert("Perubahan akun berhasil disimpan.");
  };

  return (
    <main className="md:ml-64 flex-1 p-8 bg-[#f8f9ff] min-h-screen font-sans text-[#0b1c30]">
      
      {/* Executive Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[12px] text-[#312e81] font-extrabold tracking-widest uppercase mb-1 block">
            Executive Control Panel
          </span>
          <h1 className="text-[32px] font-bold text-[#0b1c30] leading-tight">
            Manajemen Daftar Akun
          </h1>
          <p className="text-[14px] text-[#464652] mt-1">
            Pantau akun pengguna, edit status, aktifkan akses, atau cabut kewenangan agent di setiap divisi.
          </p>
        </div>
      </div>

      {/* Aggregate KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Accounts */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[72px] text-[#312e81]">
              groups
            </span>
          </div>
          <h3 className="text-[14px] font-bold text-[#464652] mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#312e81] text-[18px]">
              account_box
            </span>
            Total Akun Terdaftar
          </h3>
          <span className="text-[32px] font-bold text-[#0b1c30] leading-none">
            {totalAccounts}
          </span>
          <p className="text-xs text-[#777683] mt-2 font-medium">Semua level jabatan di NextGenID</p>
        </div>

        {/* Active Accounts */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[72px] text-emerald-600">
              check_circle
            </span>
          </div>
          <h3 className="text-[14px] font-bold text-[#464652] mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">
              verified_user
            </span>
            Akun Aktif
          </h3>
          <span className="text-[32px] font-bold text-emerald-600 leading-none">
            {activeAccounts}
          </span>
          <p className="text-xs text-[#777683] mt-2 font-medium">Memiliki izin akses penuh ke dashboard</p>
        </div>

        {/* Revoked Accounts */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[72px] text-rose-600">
              block
            </span>
          </div>
          <h3 className="text-[14px] font-bold text-[#464652] mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-600 text-[18px]">
              cancel
            </span>
            Akun Dicabut (Revoked)
          </h3>
          <span className="text-[32px] font-bold text-rose-600 leading-none">
            {revokedAccounts}
          </span>
          <p className="text-xs text-[#777683] mt-2 font-medium">Akses diblokir dari sistem sementara/selamanya</p>
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
                placeholder="Cari nama, email, cabang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f8f9ff] hover:bg-slate-50 border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg pl-10 pr-4 py-2 text-[13px] outline-none transition-all"
              />
            </div>
            {selectedAccountId && (
              <span className="text-[12px] font-semibold text-[#312e81] bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full animate-fade-in flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#312e81] animate-pulse"></span>
                1 Akun Terpilih
              </span>
            )}
          </div>

          {/* Right: CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* ADD Account Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#312e81] text-white px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-indigo-900 shadow-md shadow-indigo-950/10 active:scale-95 transition-all border-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Tambah
            </button>

            {/* EDIT Account Button */}
            <button
              onClick={openEditModal}
              disabled={!selectedAccountId}
              className="flex items-center gap-1.5 bg-white border border-slate-200 text-[#0b1c30] px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit
            </button>

            {/* ACTIVATE Account Button */}
            <button
              onClick={handleActivate}
              disabled={!selectedAccountId || selectedAccount?.status === "Active"}
              className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-emerald-700 shadow-md shadow-emerald-750/10 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none border-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Activate
            </button>

            {/* REVOKE Account Button */}
            <button
              onClick={handleRevoke}
              disabled={!selectedAccountId || selectedAccount?.status === "Revoked"}
              className="flex items-center gap-1.5 bg-rose-600 text-white px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-rose-700 shadow-md shadow-rose-750/10 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none border-0 cursor-pointer"
            >
              {/* <span className="material-symbols-outlined text-[18px]">block_notification</span> */}
              Revoke
            </button>

          </div>
        </div>

        {/* Responsive Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fcfcff] text-[#464652] font-semibold text-[11px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 w-12 text-center font-bold">Select</th>
                <th className="px-6 py-4 font-bold">Nama Lengkap</th>
                <th className="px-6 py-4 font-bold">Alamat Email</th>
                <th className="px-6 py-4 font-bold">Jabatan / Role</th>
                <th className="px-6 py-4 font-bold">Cabang / Divisi</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Tanggal Dibuat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => {
                  const isSelected = selectedAccountId === account.id;
                  return (
                    <tr
                      key={account.id}
                      onClick={() => setSelectedAccountId(isSelected ? null : account.id)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer select-none ${
                        isSelected ? "bg-indigo-50/45 hover:bg-indigo-50/60" : ""
                      }`}
                    >
                      {/* Checkbox selector column */}
                      <td className="px-6 py-4.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="radio"
                          name="selectedAccount"
                          checked={isSelected}
                          onChange={() => setSelectedAccountId(isSelected ? null : account.id)}
                          className="w-4 h-4 text-[#312e81] border-slate-300 focus:ring-[#312e81] accent-[#312e81] cursor-pointer"
                        />
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4.5 font-bold text-[14px] text-[#0b1c30]">
                        {account.name}
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4.5 text-[13px] font-medium text-[#464652]">
                        {account.email}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4.5 text-[13px]">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                          <span className="material-symbols-outlined text-[16px] text-slate-400">
                            {account.role === "Owner" ? "military_tech" : account.role === "Branch Manager" ? "store" : "badge"}
                          </span>
                          {account.role}
                        </span>
                      </td>

                      {/* Branch */}
                      <td className="px-6 py-4.5 text-[13px] font-bold text-slate-600">
                        {account.branch}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase ${
                            account.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            account.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
                          }`}></span>
                          {account.status}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4.5 text-[12px] font-medium text-[#777683]">
                        {account.createdAt}
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
                    Tidak ada akun yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info row */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[11px] font-semibold text-slate-500 rounded-b-xl">
          <span>Menampilkan {filteredAccounts.length} dari {totalAccounts} total akun</span>
          <span>NextGenID Identity Suite v1.2</span>
        </div>

      </div>

      {/* ==================== ADD ACCOUNT MODAL ==================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-[500px] rounded-2xl shadow-2xl shadow-indigo-950/20 overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-[#312e81] p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-[18px] font-bold">Tambah Akun Baru</h2>
                <p className="text-[12px] text-white/70 mt-0.5">Daftarkan agent atau manager ke divisi cabang.</p>
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
              
              {/* Name field */}
              <div className="space-y-1">
                <label className="block text-[12px] font-bold text-slate-700 uppercase">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all"
                />
              </div>

              {/* Email field */}
              <div className="space-y-1">
                <label className="block text-[12px] font-bold text-slate-700 uppercase">Alamat Email *</label>
                <input
                  type="email"
                  required
                  placeholder="budi.santoso@nextgen.id"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all"
                />
              </div>

              {/* Grid for Role and Status */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Role selection */}
                <div className="space-y-1">
                  <label className="block text-[12px] font-bold text-slate-700 uppercase">Jabatan / Role</label>
                  <select
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value as Account["role"])}
                    className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all cursor-pointer"
                  >
                    <option value="Sales Agent">Sales Agent</option>
                    <option value="Branch Manager">Branch Manager</option>
                    <option value="Owner">Owner</option>
                  </select>
                </div>

                {/* Status selection */}
                <div className="space-y-1">
                  <label className="block text-[12px] font-bold text-slate-700 uppercase">Status Awal</label>
                  <select
                    value={addStatus}
                    onChange={(e) => setAddStatus(e.target.value as Account["status"])}
                    className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Revoked">Revoked</option>
                  </select>
                </div>

              </div>

              {/* Branch field */}
              <div className="space-y-1">
                <label className="block text-[12px] font-bold text-slate-700 uppercase">Cabang / Unit Tugas *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tokyo Marunouchi, NYC Downtown"
                  value={addBranch}
                  onChange={(e) => setAddBranch(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all"
                />
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
                  Tambah Akun
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==================== EDIT ACCOUNT MODAL ==================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-[500px] rounded-2xl shadow-2xl shadow-indigo-950/20 overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-[#312e81] p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-[18px] font-bold">Edit Detail Akun</h2>
                <p className="text-[12px] text-white/70 mt-0.5">Ubah informasi data, role, atau status akses user.</p>
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
              
              {/* Name field */}
              <div className="space-y-1">
                <label className="block text-[12px] font-bold text-slate-700 uppercase">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all"
                />
              </div>

              {/* Email field */}
              <div className="space-y-1">
                <label className="block text-[12px] font-bold text-slate-700 uppercase">Alamat Email *</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all"
                />
              </div>

              {/* Grid for Role and Status */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Role selection */}
                <div className="space-y-1">
                  <label className="block text-[12px] font-bold text-slate-700 uppercase">Jabatan / Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as Account["role"])}
                    className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all cursor-pointer"
                  >
                    <option value="Sales Agent">Sales Agent</option>
                    <option value="Branch Manager">Branch Manager</option>
                    <option value="Owner">Owner</option>
                  </select>
                </div>

                {/* Status selection */}
                <div className="space-y-1">
                  <label className="block text-[12px] font-bold text-slate-700 uppercase">Status Akses</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as Account["status"])}
                    className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Revoked">Revoked</option>
                  </select>
                </div>

              </div>

              {/* Branch field */}
              <div className="space-y-1">
                <label className="block text-[12px] font-bold text-slate-700 uppercase">Cabang / Unit Tugas *</label>
                <input
                  type="text"
                  required
                  value={editBranch}
                  onChange={(e) => setEditBranch(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#312e81] focus:bg-white rounded-lg px-3.5 py-2.5 text-[13px] outline-none transition-all"
                />
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

    </main>
  );
}