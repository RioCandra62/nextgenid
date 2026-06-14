"use client";

import React, { useState, useEffect } from "react";
import {
  Filter,
  User,
  Trash2,
  Plus,
  Search,
  UserCheck,
  UserX,
  CheckCircle2,
  Settings,
  Edit,
  X,
  AlertTriangle,
  Loader2,
  Lock,
} from "lucide-react";
import {
  getMember,
  addMember,
  editMember,
  deleteMember,
} from "@/app/lib/branch/data_member";

export default function AccountPage() {
  const [member, setMember] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recapModal, setRecapModal] = useState<"all" | "active" | "inactive" | "ratio" | null>(null);

  // Selected member state for edit/delete operations
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    member_name: "",
    username: "",
    password: "",
    status: "active",
  });

  // UI notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to show self-dismissing notifications
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Fetch members list
  async function fetchMembers() {
    setIsLoading(true);
    try {
      const res = await getMember();
      setMember(res);
    } catch (err: any) {
      showNotification("error", err.message || "Gagal memuat data sales agent");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  // Submit action: Add Member
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("member_name", formData.member_name);
      form.append("username", formData.username);
      form.append("password", formData.password);
      form.append("status", formData.status);

      const result = await addMember(form);
      if (result.success) {
        showNotification("success", `Akun sales "${formData.member_name}" berhasil ditambahkan!`);
        setIsAddModalOpen(false);
        setFormData({
          member_name: "",
          username: "",
          password: "",
          status: "active",
        });
        fetchMembers();
      }
    } catch (err: any) {
      showNotification("error", err.message || "Gagal menambahkan akun");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit action: Edit Member
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("member_id", selectedMember.member_id);
      form.append("member_name", formData.member_name);
      form.append("username", formData.username);
      form.append("password", formData.password); // blank means no change
      form.append("status", formData.status);

      const result = await editMember(form);
      if (result.success) {
        showNotification("success", `Akun sales "${formData.member_name}" berhasil diperbarui!`);
        setIsEditModalOpen(false);
        fetchMembers();
      }
    } catch (err: any) {
      showNotification("error", err.message || "Gagal memperbarui akun");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit action: Delete Member
  const handleDeleteSubmit = async () => {
    if (!selectedMember) return;
    setIsSubmitting(true);
    try {
      const result = await deleteMember(selectedMember.member_id);
      if (result.success) {
        showNotification("success", "Akun Sales Agent berhasil dihapus!");
        setIsDeleteModalOpen(false);
        fetchMembers();
      }
    } catch (err: any) {
      showNotification("error", err.message || "Gagal menghapus akun");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle status shortcut
  const handleToggleStatus = async (m: any) => {
    const newStatus = m.status === "active" ? "inactive" : "active";
    try {
      const form = new FormData();
      form.append("member_id", m.member_id);
      form.append("member_name", m.member_name);
      form.append("username", m.username);
      form.append("password", ""); // keep password unchanged
      form.append("status", newStatus);

      const result = await editMember(form);
      if (result.success) {
        showNotification(
          "success",
          `Status ${m.member_name} diubah menjadi ${
            newStatus === "active" ? "Aktif" : "Nonaktif"
          }`
        );
        fetchMembers();
      }
    } catch (err: any) {
      showNotification("error", err.message || "Gagal mengubah status akun");
    }
  };

  // Trigger Edit Modal
  const openEditModal = (m: any) => {
    setSelectedMember(m);
    setFormData({
      member_name: m.member_name,
      username: m.username,
      password: "", // empty so it won't overwrite unless explicitly typed
      status: m.status,
    });
    setIsEditModalOpen(true);
  };

  // Trigger Delete Modal
  const openDeleteModal = (m: any) => {
    setSelectedMember(m);
    setIsDeleteModalOpen(true);
  };

  // Filter & Search logic
  const filteredMembers = member.filter((m) => {
    const name = m.member_name || "";
    const user = m.username || "";
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats from total member list
  const totalAccounts = member.length;
  const activeAccounts = member.filter((m) => m.status === "active").length;
  const inactiveAccounts = member.filter((m) => m.status === "inactive").length;
  const activeRatio = totalAccounts > 0 ? Math.round((activeAccounts / totalAccounts) * 100) : 0;

  return (
    <section className="relative min-h-screen pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border transition-all transform animate-bounce duration-300 ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={20} />
          ) : (
            <AlertTriangle className="text-rose-500 flex-shrink-0" size={20} />
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">
              {notification.type === "success" ? "Sukses" : "Pemberitahuan"}
            </p>
            <p className="text-sm font-semibold mt-0.5">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 transition-colors ml-4"
          >
            <X size={16} />
          </button>
        </div>
      )}

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
          onClick={() => {
            setFormData({
              member_name: "",
              username: "",
              password: "",
              status: "active",
            });
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#312e81] hover:bg-[#1e1b4b] text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-md shadow-indigo-900/10 w-fit cursor-pointer text-sm"
        >
          <Plus size={18} />
          Tambah Akun User
        </button>
      </div>

      {/* Recap Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total Accounts */}
        <div 
          onClick={() => setRecapModal("all")}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md hover:border-[#312e81]/30 transition-all cursor-pointer active:scale-98"
        >
          <div>
            <span className="text-xs uppercase font-extrabold text-[#464652] tracking-wider block mb-1">
              Total Akun Sales
            </span>
            <span className="text-[28px] font-bold text-[#0b1c30]">
              {totalAccounts}
            </span>
            <span className="text-xs text-slate-500 font-semibold block mt-1">
              Klik untuk rincian
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-[#312e81] rounded-full flex items-center justify-center group-hover:bg-[#312e81] group-hover:text-white transition-all">
            <User size={22} />
          </div>
        </div>

        {/* Card 2: Active Accounts */}
        <div 
          onClick={() => setRecapModal("active")}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md hover:border-emerald-600/30 transition-all cursor-pointer active:scale-98"
        >
          <div>
            <span className="text-xs uppercase font-extrabold text-[#464652] tracking-wider block mb-1">
              Akun Aktif
            </span>
            <span className="text-[28px] font-bold text-emerald-600">
              {activeAccounts}
            </span>
            <span className="text-xs text-emerald-600 font-semibold block mt-1">
              Klik untuk rincian
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <UserCheck size={22} />
          </div>
        </div>

        {/* Card 3: Inactive Accounts */}
        <div 
          onClick={() => setRecapModal("inactive")}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md hover:border-slate-400/30 transition-all cursor-pointer active:scale-98"
        >
          <div>
            <span className="text-xs uppercase font-extrabold text-[#464652] tracking-wider block mb-1">
              Akun Nonaktif
            </span>
            <span className="text-[28px] font-bold text-slate-500">
              {inactiveAccounts}
            </span>
            <span className="text-xs text-slate-400 font-semibold block mt-1">
              Klik untuk rincian
            </span>
          </div>
          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center group-hover:bg-slate-500 group-hover:text-white transition-all">
            <UserX size={22} />
          </div>
        </div>

        {/* Card 4: Active Ratio */}
        <div 
          onClick={() => setRecapModal("ratio")}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md hover:border-indigo-600/30 transition-all cursor-pointer active:scale-98"
        >
          <div>
            <span className="text-xs uppercase font-extrabold text-[#464652] tracking-wider block mb-1">
              Rasio Keaktifan
            </span>
            <span className="text-[28px] font-bold text-indigo-600">
              {activeRatio}%
            </span>
            <span className="text-xs text-indigo-500 font-semibold block mt-1">
              Klik untuk analisis
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
            <Filter size={18} className="text-[#312e81]" />
            Daftar Sales Agent
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari nama atau username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-[#312e81] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#0b1c30] placeholder-slate-400 transition-all outline-none"
              />
            </div>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-40 bg-white border border-slate-200 focus:border-[#312e81] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#0b1c30] outline-none cursor-pointer hover:bg-slate-50"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* User Accounts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#464652] font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-center w-12">No</th>
                <th className="px-6 py-4 font-bold">Nama User</th>
                <th className="px-6 py-4 font-bold text-center">Username</th>
                <th className="px-6 py-4 font-bold text-center">Role</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 size={30} className="text-[#312e81] animate-spin" />
                      <span className="font-semibold text-xs text-slate-500">
                        Memuat data member...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <User size={40} className="text-slate-300" />
                      <span className="font-semibold text-sm text-slate-500">
                        Tidak ada akun user ditemukan
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((t, idx) => (
                  <tr
                    key={t.member_id || idx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-sm text-[#0b1c30]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-indigo-50 text-[#312e81] rounded-full flex items-center justify-center font-bold text-xs">
                          {t.member_name
                            ? t.member_name.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        {t.member_name || "Unknown Member"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#0b1c30] text-center">
                      {t.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-semibold text-slate-600">
                      Sales Agent
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                          t.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            t.status === "active" ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        ></span>
                        {t.status === "active" ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Toggle status */}
                        <button
                          onClick={() => handleToggleStatus(t)}
                          title={t.status === "active" ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                          className={`p-2 rounded-lg cursor-pointer transition-colors ${
                            t.status === "active"
                              ? "text-amber-600 hover:bg-amber-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {t.status === "active" ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(t)}
                          title="Edit Detail Akun"
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <Edit size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => openDeleteModal(t)}
                          title="Hapus Akun"
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 size={16} />
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
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-[60vh] rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
                <Plus size={20} className="text-[#312e81]" />
                Tambah Akun User
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              {/* Nama Sales */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  Nama Lengkap Sales Agent
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rian Hidayat"
                    value={formData.member_name}
                    onChange={(e) => setFormData({ ...formData, member_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#312e81] focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#0b1c30] placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: rian_h"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#312e81] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#0b1c30] placeholder-slate-400 outline-none transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  Password Akun
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="password"
                    required
                    placeholder="Masukkan password baru..."
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#312e81] focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#0b1c30] placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  Status Akun Awal
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#312e81] focus:bg-white rounded-xl px-3 py-2.5 text-xs text-[#0b1c30] outline-none transition-all cursor-pointer"
                >
                  <option value="active">Aktif (Dapat Login & Transaksi)</option>
                  <option value="inactive">Nonaktif (Akses Dikunci)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] disabled:opacity-70 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md shadow-indigo-950/10 flex items-center gap-1.5 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Akun"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POP-UP MODAL FORM FOR EDITING ACCOUNT */}
      {isEditModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white  rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
                <Settings size={20} className="text-[#312e81]" />
                Edit Akun User
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {/* Nama Sales */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  Nama Lengkap Sales Agent
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rian Hidayat"
                    value={formData.member_name}
                    onChange={(e) => setFormData({ ...formData, member_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#312e81] focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#0b1c30] placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: rian_h"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#312e81] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#0b1c30] placeholder-slate-400 outline-none transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  Ganti Password Akun
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="password"
                    placeholder="Biarkan kosong jika tidak diubah"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#312e81] focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#0b1c30] placeholder-slate-400 outline-none transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  *Isi kolom ini jika Anda ingin mengubah sandi masuk untuk sales agent ini.
                </p>
              </div>

              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  Status Akun
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#312e81] focus:bg-white rounded-xl px-3 py-2.5 text-xs text-[#0b1c30] outline-none transition-all cursor-pointer"
                >
                  <option value="active">Aktif (Dapat Login & Transaksi)</option>
                  <option value="inactive">Nonaktif (Akses Dikunci)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#312e81] hover:bg-[#1e1b4b] disabled:opacity-70 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md shadow-indigo-950/10 flex items-center gap-1.5 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-rose-50 flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-rose-950">Hapus Akun User</h3>
                <p className="text-xs text-rose-700">Tindakan ini permanen dan berisiko</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#464652] leading-relaxed">
                Apakah Anda yakin ingin menghapus akun Sales Agent{" "}
                <span className="font-bold text-[#0b1c30]">
                  "{selectedMember.member_name}"
                </span>{" "}
                (Username: <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-800">{selectedMember.username}</span>)?
              </p>

              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-xs space-y-2">
                <p className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertTriangle size={14} />
                  Informasi Batasan Database
                </p>
                <p className="leading-relaxed">
                  Jika akun sales ini <strong>telah memiliki riwayat transaksi penjualan</strong> di cabang, database akan memblokir penghapusan ini demi menjaga integritas data keuangan.
                </p>
                <p className="leading-relaxed font-semibold">
                  Saran: Jika penghapusan gagal, silakan gunakan tombol "Nonaktifkan" untuk menonaktifkan akses tanpa merusak riwayat transaksi.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-70 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md shadow-rose-950/10 flex items-center gap-1.5 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    "Ya, Hapus Akun"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECAP DETAILED MODALS */}
      {recapModal === "all" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
                <User className="text-[#312e81]" size={20} />
                Rincian Semua Akun Sales Agent ({totalAccounts})
              </h3>
              <button
                onClick={() => setRecapModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 max-h-[350px] overflow-y-auto space-y-3">
              {member.map((m, idx) => (
                <div key={m.member_id || idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-indigo-100 text-[#312e81] rounded-full flex items-center justify-center font-bold text-xs">
                      {m.member_name ? m.member_name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0b1c30]">{m.member_name}</p>
                      <p className="text-xs text-slate-400">@{m.username}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                    m.status === "active" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    {m.status === "active" ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setRecapModal(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {recapModal === "active" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50">
              <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                <UserCheck className="text-emerald-600" size={20} />
                Rincian Akun Sales Aktif ({activeAccounts})
              </h3>
              <button
                onClick={() => setRecapModal(null)}
                className="text-emerald-700 hover:bg-emerald-100 transition-colors p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 max-h-[350px] overflow-y-auto space-y-3">
              {member.filter(m => m.status === "active").map((m, idx) => (
                <div key={m.member_id || idx} className="flex items-center justify-between p-3 border border-emerald-100/50 rounded-xl bg-emerald-50/20 hover:bg-emerald-50/50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-xs">
                      {m.member_name ? m.member_name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0b1c30]">{m.member_name}</p>
                      <p className="text-xs text-slate-400">@{m.username}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border bg-emerald-50 text-emerald-700 border-emerald-200">
                    Aktif
                  </span>
                </div>
              ))}
              {activeAccounts === 0 && (
                <p className="text-center py-6 text-slate-400 text-sm font-semibold">Tidak ada akun aktif ditemukan</p>
              )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setRecapModal(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {recapModal === "inactive" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <UserX className="text-slate-500" size={20} />
                Rincian Akun Sales Nonaktif ({inactiveAccounts})
              </h3>
              <button
                onClick={() => setRecapModal(null)}
                className="text-slate-500 hover:bg-slate-200 transition-colors p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 max-h-[350px] overflow-y-auto space-y-3">
              {member.filter(m => m.status === "inactive").map((m, idx) => (
                <div key={m.member_id || idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-xs">
                      {m.member_name ? m.member_name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0b1c30]">{m.member_name}</p>
                      <p className="text-xs text-slate-400">@{m.username}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border bg-slate-100 text-slate-600 border-slate-200">
                    Nonaktif
                  </span>
                </div>
              ))}
              {inactiveAccounts === 0 && (
                <p className="text-center py-6 text-slate-400 text-sm font-semibold">Tidak ada akun nonaktif ditemukan</p>
              )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setRecapModal(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {recapModal === "ratio" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50">
              <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
                <CheckCircle2 className="text-[#312e81]" size={20} />
                Analisis Rasio Keaktifan Agen
              </h3>
              <button
                onClick={() => setRecapModal(null)}
                className="text-[#312e81] hover:bg-indigo-100 transition-colors p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-xs uppercase font-extrabold text-[#464652] tracking-wider mb-1">Rasio Akun Aktif</p>
                <p className="text-5xl font-black text-indigo-700">{activeRatio}%</p>
              </div>

              {/* Progress bar comparison */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#0b1c30]">
                  <span>Presentase Keaktifan</span>
                  <span>{activeRatio}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#312e81] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${activeRatio}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aktif</p>
                  <p className="text-2xl font-bold text-emerald-600">{activeAccounts} Akun</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nonaktif</p>
                  <p className="text-2xl font-bold text-slate-400">{inactiveAccounts} Akun</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed italic">
                *Rasio ini menggambarkan kesehatan operasional dari seluruh user sales agent cabang. Akun nonaktif membatasi otentikasi login pengguna demi perlindungan akses.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setRecapModal(null)}
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
