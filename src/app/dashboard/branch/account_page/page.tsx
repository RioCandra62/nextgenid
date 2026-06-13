"use client"

import React, { useState } from "react"
import { Filter, User, Trash2, Plus, Search, UserCheck, UserX, CheckCircle2, Settings } from "lucide-react"

interface BranchAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "CEO" | "Branch Manager" | "Sales Agent";
  branch: string;
  status: "Active" | "Pending" | "Inactive";
}

const initialAccounts: BranchAccount[] = [
  { id: "acc-1", name: "Marcus CEO", username: "marcus.ceo", email: "marcus@nextgen.id", role: "CEO", branch: "Head Office", status: "Active" },
  { id: "acc-2", name: "Budi Santoso", username: "sales.budi", email: "budi.s@nextgen.id", role: "Sales Agent", branch: "Jakarta", status: "Active" },
  { id: "acc-3", name: "Dewi Lestari", username: "sales.dewi", email: "dewi.l@nextgen.id", role: "Sales Agent", branch: "Bandung", status: "Active" },
  { id: "acc-4", name: "Rian Hidayat", username: "manager.rian", email: "rian.h@nextgen.id", role: "Branch Manager", branch: "Surabaya", status: "Active" },
  { id: "acc-5", name: "Linda Utami", username: "sales.linda", email: "linda.u@nextgen.id", role: "Sales Agent", branch: "Semarang", status: "Pending" },
  { id: "acc-6", name: "Ahmad Fauzi", username: "manager.ahmad", email: "ahmad.f@nextgen.id", role: "Branch Manager", branch: "Semarang", status: "Inactive" },
];

export default function AccountPage() {
  const [accounts, setAccounts] = useState<BranchAccount[]>(initialAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "CEO" | "Branch Manager" | "Sales Agent">("All");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"CEO" | "Branch Manager" | "Sales Agent">("Sales Agent");
  const [branch, setBranch] = useState("Jakarta");
  const [status, setStatus] = useState<"Active" | "Pending" | "Inactive">("Active");

  // Handle delete
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun "${name}"?`)) {
      setAccounts(prev => prev.filter(acc => acc.id !== id));
    }
  };

  // Toggle account status
  const handleToggleStatus = (id: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        const nextStatus: BranchAccount["status"] = 
          acc.status === "Active" ? "Inactive" : acc.status === "Inactive" ? "Active" : "Active";
        return { ...acc, status: nextStatus };
      }
      return acc;
    }));
  };

  // Handle add account submit
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !email || !branch) return;

    const newAcc: BranchAccount = {
      id: `acc-${Date.now()}`,
      name,
      username,
      email,
      role,
      branch,
      status,
    };

    setAccounts(prev => [...prev, newAcc]);
    
    // Reset form
    setName("");
    setUsername("");
    setEmail("");
    setRole("Sales Agent");
    setBranch("Jakarta");
    setStatus("Active");
    setIsModalOpen(false);

    alert(`Akun untuk "${name}" berhasil dibuat.`);
  };

  // Filter accounts based on query and role
  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = 
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.branch.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "All" || acc.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <section>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <span className="text-[12px] text-[#312e81] font-extrabold tracking-widest uppercase mb-1 block">
            Branch Operations
          </span>
          <h1 className="text-[32px] font-bold text-[#0b1c30] leading-none">
            Data Akun Cabang
          </h1>
          <p className="text-[14px] text-[#464652] mt-2">
            Manajemen kredensial, perizinan hak akses, dan status keaktifan akun user di kantor cabang.
          </p>
        </div>

        {/* Add User Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#312e81] hover:bg-[#1e1b4b] text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-md shadow-indigo-900/10 w-fit cursor-pointer"
        >
          <Plus size={20} />
          Tambah Akun User
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Cari user, email, cabang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-slate-250 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#0b1c30] focus:outline-none focus:border-[#312e81] focus:ring-1 focus:ring-[#312e81] transition-all bg-slate-50/50 hover:bg-slate-50"
              />
            </div>

            {/* Role Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200 text-xs font-bold w-fit">
              {(["All", "CEO", "Branch Manager", "Sales Agent"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    roleFilter === r
                      ? "bg-white text-[#312e81] shadow-sm"
                      : "text-[#464652] hover:text-[#0b1c30]"
                  }`}
                >
                  {r === "All" ? "Semua Role" : r}
                </button>
              ))}
            </div>
          </div>
          
          <span className="text-xs font-semibold text-slate-400">
            Terfilter: {filteredAccounts.length} dari {accounts.length} akun
          </span>
        </div>

        {/* User Accounts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#464652] font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-bold">Nama User</th>
                <th className="px-6 py-4 font-bold">Username</th>
                <th className="px-6 py-4 font-bold">Role & Cabang</th>
                <th className="px-6 py-4 font-bold text-center">Email</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <User size={40} className="text-slate-350" />
                      <span className="font-semibold text-sm">Tidak ada akun user ditemukan</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* User profile and name */}
                    <td className="px-6 py-4 font-semibold text-sm text-[#0b1c30]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-indigo-50 text-[#312e81] rounded-full flex items-center justify-center font-bold text-xs shadow-inner">
                          {acc.name[0]}
                        </div>
                        <div>
                          <span className="block font-bold text-[#0b1c30]">{acc.name}</span>
                          <span className="text-[11px] text-slate-400 font-normal">ID: {acc.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      @{acc.username}
                    </td>

                    {/* Role & Branch */}
                    <td className="px-6 py-4 text-xs font-semibold text-[#0b1c30] space-y-1">
                      <span className="inline-block bg-indigo-50 text-[#312e81] px-2 py-0.5 rounded font-bold">
                        {acc.role}
                      </span>
                      <span className="block text-slate-400 font-medium">
                        Unit: {acc.branch}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-center font-medium text-[#464652]">
                      {acc.email}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase border ${
                          acc.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : acc.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          acc.status === "Active" ? "bg-emerald-500" : acc.status === "Pending" ? "bg-amber-500" : "bg-rose-500"
                        }`}></span>
                        {acc.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Toggle active status button */}
                        <button
                          onClick={() => handleToggleStatus(acc.id)}
                          title={acc.status === "Active" ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            acc.status === "Active" 
                              ? "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100" 
                              : "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {acc.status === "Active" ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>
                        
                        {/* Delete Account */}
                        <button
                          onClick={() => handleDelete(acc.id, acc.name)}
                          title="Hapus Akun Permanen"
                          className="text-[#ba1a1a] hover:bg-red-50 p-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POP-UP MODAL FORM FOR ADDING ACCOUNT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-full max-w-md animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#312e81] text-white">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Plus size={20} />
                  Tambah Akun Baru
                </h3>
                <p className="text-xs text-indigo-200/90 mt-0.5">Daftarkan kredensial user kantor cabang baru.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all border-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddAccount} className="p-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Linda Utami"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81] focus:ring-1 focus:ring-[#312e81] transition-all"
                />
              </div>

              {/* Username & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="sales.linda"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="linda.u@nextgen.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                  />
                </div>
              </div>

              {/* Role & Branch */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                    Role Jabatan
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81] cursor-pointer"
                  >
                    <option value="Sales Agent">Sales Agent</option>
                    <option value="Branch Manager">Branch Manager</option>
                    <option value="CEO">CEO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                    Cabang Kerja *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jakarta"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81]"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-1.5">
                  Status Keaktifan
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:border-[#312e81] cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold rounded-xl hover:bg-slate-100 text-[#464652] transition-colors border-none cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#312e81] text-white rounded-xl hover:bg-[#1e1b4b] active:scale-95 transition-all shadow-md shadow-indigo-900/10 cursor-pointer"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}