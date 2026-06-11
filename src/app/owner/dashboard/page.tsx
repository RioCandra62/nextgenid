"use client";

import React, { useState } from "react";
import { CompanyBranch, CorporateAccount } from "./layout";

interface OwnerDashboardContentProps {
  activeTab: "overview" | "branches" | "corporate" | "financials" | "team";
  setActiveTab: (tab: "overview" | "branches" | "corporate" | "financials" | "team") => void;
  branches: CompanyBranch[];
  corporateAccounts: CorporateAccount[];
  totalRevenue: number;
  companyGoal: number;
  totalCorporateValue: number;
  totalAgents: number;
}

export default function OwnerDashboardContent({
  activeTab,
  setActiveTab,
  branches,
  corporateAccounts,
  totalRevenue,
  companyGoal,
  totalCorporateValue,
  totalAgents,
}: OwnerDashboardContentProps) {
  const goalCompletionPercentage = Math.round((totalRevenue / companyGoal) * 100);

  return (
    <main className="md:ml-64 flex-1 p-8 bg-[#f8f9ff] min-h-screen">
      
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[12px] text-[#312e81] font-extrabold tracking-widest uppercase mb-1 block">
            Executive Control Panel
          </span>
          <h1 className="text-[32px] font-bold text-[#0b1c30] leading-tight">
            Company Performance Suite
          </h1>
          <p className="text-[14px] text-[#464652] mt-1">
            Global aggregates, branch leaderboards, and regional statistics.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => alert("Global Executive Report generated. PDF download started.")}
            className="flex items-center gap-2 bg-[#312e81] text-white px-4 py-2 rounded-lg text-[14px] font-semibold hover:bg-indigo-900 shadow-lg shadow-indigo-900/10 transition-all active:scale-95 border-0"
          >
            <span className="material-symbols-outlined text-[20px]">print</span>
            Generate Executive Ledger
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <>
          {/* Executive Bento Aggregate KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            
            {/* Total Company Sales Card */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[72px] text-[#312e81]">
                  payments
                </span>
              </div>
              <h3 className="text-[16px] font-semibold text-[#464652] mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#312e81] text-[20px]">
                  monetization_on
                </span>
                Total Revenue
              </h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-[36px] font-bold text-[#0b1c30] leading-none">
                  ${(totalRevenue / 1000000).toFixed(2)}M
                </span>
                <span className="text-[#059669] font-semibold text-[14px] flex items-center mb-1">
                  <span className="material-symbols-outlined text-[16px] font-extrabold mr-0.5">arrow_upward</span>
                  18.2%
                </span>
              </div>
              <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden mt-4">
                <div
                  className="bg-[#312e81] h-full rounded-full transition-all duration-500"
                  style={{ width: `${goalCompletionPercentage}%` }}
                ></div>
              </div>
              <span className="text-[12px] text-[#464652] mt-2 block font-medium">
                {goalCompletionPercentage}% of corporate target achieved
              </span>
            </div>

            {/* Target Completion Card */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <h3 className="text-[16px] font-semibold text-[#464652] mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#312e81] text-[20px]">
                  military_tech
                </span>
                Global Target Goal
              </h3>
              <div>
                <span className="text-[28px] font-bold text-[#0b1c30]">
                  ${(companyGoal / 1000000).toFixed(2)}M
                </span>
                <span className="text-[12px] text-[#464652] block font-medium mt-1">
                  Target threshold across 4 regions
                </span>
              </div>
              <div className="text-xs text-indigo-700 bg-indigo-50 p-2 rounded-lg font-bold mt-4 flex items-center gap-1.5 justify-center">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                Target Completion: {goalCompletionPercentage}%
              </div>
            </div>

            {/* Best Performing Branch Card */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <h3 className="text-[16px] font-semibold text-[#464652] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#059669] text-[20px]">
                  star
                </span>
                Top Branch
              </h3>
              <div>
                <span className="text-[24px] font-extrabold text-[#312e81] block truncate leading-tight">
                  Tokyo Central
                </span>
                <span className="text-[13px] text-[#059669] font-bold mt-0.5 block flex items-center gap-1">
                  $1.45M closed revenue
                </span>
              </div>
              <div className="text-[11px] text-[#464652] border-t border-slate-100 pt-3 font-semibold mt-4">
                Manager: Kenji Sato
              </div>
            </div>

            {/* Total Sales Representatives */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <h3 className="text-[16px] font-semibold text-[#464652] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00658d] text-[20px]">
                  groups
                </span>
                Active Sales Reps
              </h3>
              <div>
                <span className="text-[36px] font-bold text-[#0b1c30]">
                  {totalAgents}
                </span>
                <span className="text-[12px] text-[#464652] block font-medium">
                  Deployed across all divisions
                </span>
              </div>
              <div className="text-[11px] text-[#00658d] font-bold mt-4">
                Average Value per Rep: ${(totalRevenue / totalAgents / 1000).toFixed(0)}k
              </div>
            </div>

          </div>

          {/* Leaderboard & Corporate Accounts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Branch Leaderboard */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="text-[18px] font-bold text-[#0b1c30]">
                  Regional Branch Standings
                </h3>
                <span className="bg-slate-100 text-[#464652] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                  4 Divisions
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[#464652] font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                      <th className="px-6 py-3.5 font-bold">Branch Name</th>
                      <th className="px-6 py-3.5 font-bold">Manager</th>
                      <th className="px-6 py-3.5 font-bold">Revenue vs Goal</th>
                      <th className="px-6 py-3.5 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {branches.map((branch) => {
                      const completePct = Math.round((branch.revenue / branch.goal) * 100);
                      return (
                        <tr key={branch.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 font-semibold text-[14px] text-[#0b1c30]">
                            {branch.name}
                          </td>
                          <td className="px-6 py-4 text-[13px] font-medium text-[#464652]">
                            {branch.manager}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[13px] font-bold text-[#0b1c30]">
                                ${(branch.revenue / 1000000).toFixed(2)}M / ${(branch.goal / 1000000).toFixed(2)}M
                              </span>
                              <div className="w-28 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#312e81] h-full"
                                  style={{ width: `${completePct}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                branch.status === "Above Target"
                                  ? "bg-[#d1fae5] text-[#065f46]"
                                  : branch.status === "On Target"
                                  ? "bg-[#e0f2fe] text-[#0369a1]"
                                  : "bg-[#fee2e2] text-[#991b1b]"
                              }`}
                            >
                              {branch.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Corporate Contracts Summary */}
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                  <h3 className="text-[18px] font-bold text-[#0b1c30]">
                    Enterprise Accounts
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  {corporateAccounts.map((account) => (
                    <div key={account.id} className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div>
                        <span className="block text-[13px] font-bold text-[#0b1c30]">
                          {account.companyName}
                        </span>
                        <span className="text-[10px] text-[#464652] font-semibold">
                          Branch: {account.branch} • Rep: {account.representative}
                        </span>
                      </div>
                      <span className="text-[14px] font-bold text-[#312e81]">
                        +${(account.contractValue / 1000).toFixed(0)}k
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center rounded-b-xl">
                <span className="text-[12px] font-bold text-[#312e81]">
                  Total Contracts: ${(totalCorporateValue / 1000).toFixed(0)}k
                </span>
              </div>
            </div>

          </div>
        </>
      )}

      {activeTab === "branches" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch) => {
            const completion = Math.round((branch.revenue / branch.goal) * 100);
            return (
              <div key={branch.id} className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm ${branch.colorClass}`}>
                <h3 className="text-[18px] font-bold text-[#0b1c30] mb-1">{branch.name}</h3>
                <span className="text-xs uppercase font-extrabold text-[#312e81] tracking-wider block mb-4">
                  {branch.region} Division
                </span>
                <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#464652] tracking-wide">Manager</span>
                    <span className="text-sm font-semibold text-[#0b1c30]">{branch.manager}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#464652] tracking-wide">Reps</span>
                    <span className="text-sm font-semibold text-[#0b1c30]">{branch.agents}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#464652] tracking-wide">Status</span>
                    <span className="text-xs font-bold text-[#059669]">{branch.status}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-[#464652] mb-1">
                    <span>Revenue Target Progress</span>
                    <span>{completion}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#312e81] h-full" style={{ width: `${completion}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs font-semibold">
                    <span>Closed: ${(branch.revenue / 1000).toLocaleString()}k</span>
                    <span>Goal: ${(branch.goal / 1000).toLocaleString()}k</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "corporate" && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#464652] font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-3.5 font-bold">Enterprise Client</th>
                <th className="px-6 py-3.5 font-bold">Value (USD)</th>
                <th className="px-6 py-3.5 font-bold">Assigned Representative</th>
                <th className="px-6 py-3.5 font-bold">Origin Branch</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {corporateAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[14px] text-[#0b1c30]">{account.companyName}</td>
                  <td className="px-6 py-4 font-semibold text-[14px] text-[#312e81]">${account.contractValue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-[#464652]">{account.representative}</td>
                  <td className="px-6 py-4 text-[13px] font-semibold text-[#0b1c30]">{account.branch}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-[#d1fae5] text-[#065f46]">
                      {account.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "financials" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <h3 className="text-[18px] font-bold text-[#0b1c30] mb-4">Corporate Revenue Ledger Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 rounded-lg">
                <span className="block text-xs font-semibold text-[#464652]">Gross Closed Revenue</span>
                <span className="text-[28px] font-bold text-[#0b1c30]">${totalRevenue.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <span className="block text-xs font-semibold text-[#464652]">Total Goal Targets</span>
                <span className="text-[28px] font-bold text-[#0b1c30]">${companyGoal.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <span className="block text-xs font-semibold text-[#464652]">Corporate Accounts Share</span>
                <span className="text-[28px] font-bold text-[#312e81]">${totalCorporateValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#464652] font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-3.5 font-bold">Regional Leader</th>
                <th className="px-6 py-3.5 font-bold">Managed Branch</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
                <th className="px-6 py-3.5 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {branches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[14px] text-[#0b1c30]">{b.manager}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-[#464652]">{b.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-[#d1fae5] text-[#065f46]">
                      Online
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => alert(`Paging manager ${b.manager}...`)}
                      className="px-3 py-1 text-xs font-semibold bg-[#312e81] text-white rounded hover:bg-indigo-900 border-0"
                    >
                      Ping Leader
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </main>
  );
}
