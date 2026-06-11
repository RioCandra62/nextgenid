"use client";

import React, { useState } from "react";
import { PersonalLead, PersonalTransaction } from "./layout";

interface SalesDashboardContentProps {
  activeTab: "performance" | "leads" | "deals" | "commission";
  setActiveTab: (tab: "performance" | "leads" | "deals" | "commission") => void;
  leads: PersonalLead[];
  transactions: PersonalTransaction[];
  totalClosedValue: number;
  personalDealsCount: number;
  commissionEarned: number;
}

export default function SalesDashboardContent({
  activeTab,
  setActiveTab,
  leads,
  transactions,
  totalClosedValue,
  personalDealsCount,
  commissionEarned,
}: SalesDashboardContentProps) {
  // Commission Simulator State
  const [simulateSales, setSimulateSales] = useState(250000);
  const simulateCommission = Math.round(simulateSales * 0.05);

  const goalTarget = 500000;
  const goalCompletion = Math.round((totalClosedValue / goalTarget) * 100);

  return (
    <main className="md:ml-64 flex-1 p-8 bg-[#f8f9ff] min-h-screen">
      
      {/* Agent Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[12px] text-[#1d4ed8] font-extrabold tracking-widest uppercase mb-1 block">
            Agent Workspace
          </span>
          <h1 className="text-[32px] font-bold text-[#0b1c30] leading-tight">
            Sarah Jenkins' Dashboard
          </h1>
          <p className="text-[14px] text-[#464652] mt-1">
            Track your custom targets, active commissions, and client pipeline.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => alert("Report compiled. Commission slip sent to regional manager.")}
            className="flex items-center gap-2 bg-[#1d4ed8] text-white px-4 py-2 rounded-lg text-[14px] font-semibold hover:bg-blue-800 shadow-lg shadow-blue-900/10 transition-all active:scale-95 border-0"
          >
            <span className="material-symbols-outlined text-[20px]">request_quote</span>
            Claim Commissions
          </button>
        </div>
      </div>

      {activeTab === "performance" && (
        <>
          {/* Agent Bento Aggregate KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            
            {/* Total Sales Card */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <h3 className="text-[16px] font-semibold text-[#464652] mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1d4ed8] text-[20px]">
                  payments
                </span>
                Total Closed Deals
              </h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-[36px] font-bold text-[#0b1c30] leading-none">
                  ${totalClosedValue.toLocaleString()}
                </span>
                <span className="text-[#059669] font-semibold text-[14px] flex items-center mb-1">
                  <span className="material-symbols-outlined text-[16px] font-extrabold mr-0.5">arrow_upward</span>
                  +14%
                </span>
              </div>
              <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden mt-4">
                <div
                  className="bg-[#1d4ed8] h-full rounded-full transition-all duration-500"
                  style={{ width: `${goalCompletion}%` }}
                ></div>
              </div>
              <span className="text-[12px] text-[#464652] mt-2 block font-medium">
                {goalCompletion}% of monthly quota reached
              </span>
            </div>

            {/* Total Deals Card */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <h3 className="text-[16px] font-semibold text-[#464652] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00658d] text-[20px]">
                  checklist
                </span>
                Deals Closed
              </h3>
              <div>
                <span className="text-[36px] font-bold text-[#0b1c30]">
                  {personalDealsCount}
                </span>
                <span className="text-[12px] text-[#464652] block font-medium">
                  Signed contract files
                </span>
              </div>
              <div className="text-[11px] text-[#00658d] font-bold mt-4">
                Average Deal Size: ${(totalClosedValue / personalDealsCount / 1000).toFixed(1)}k
              </div>
            </div>

            {/* Commissions Earned Card */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <h3 className="text-[16px] font-semibold text-[#464652] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#059669] text-[20px]">
                  savings
                </span>
                Active Commissions
              </h3>
              <div>
                <span className="text-[36px] font-bold text-[#059669]">
                  ${commissionEarned.toLocaleString()}
                </span>
                <span className="text-[12px] text-[#464652] block font-medium">
                  5% base commission rate
                </span>
              </div>
              <div className="text-[11px] text-[#059669] font-bold mt-4 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">check_circle</span>
                Eligible for payout
              </div>
            </div>

            {/* Current Rank Card */}
            <div className="bg-[#15157d] p-6 rounded-xl shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <span className="material-symbols-outlined text-[72px]">workspace_premium</span>
              </div>
              <h3 className="text-[16px] font-semibold mb-2 flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-white text-[20px]">
                  emoji_events
                </span>
                Branch Ranking
              </h3>
              <div>
                <span className="text-[36px] font-extrabold text-white leading-none">
                  #1 Rank
                </span>
                <span className="text-white/70 text-[12px] block font-medium mt-1">
                  Top performer in NYC region
                </span>
              </div>
              <div className="text-[11px] text-[#2dbcfe] font-bold mt-4">
                Next Rank Reward: 2.5% Bonus Boost
              </div>
            </div>

          </div>

          {/* Leads & Personal Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick Leads List */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="text-[18px] font-bold text-[#0b1c30]">
                  My Active Opportunities
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[#464652] font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                      <th className="px-6 py-3.5 font-bold">Contact Name</th>
                      <th className="px-6 py-3.5 font-bold">Company</th>
                      <th className="px-6 py-3.5 font-bold">Est. Value</th>
                      <th className="px-6 py-3.5 font-bold">Deal Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.slice(0, 3).map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-semibold text-[14px] text-[#0b1c30]">{lead.name}</td>
                        <td className="px-6 py-4 text-[13px] font-medium text-[#464652]">{lead.company}</td>
                        <td className="px-6 py-4 text-[13px] font-bold text-[#1d4ed8]">${lead.value.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fef3c7] text-[#92400e]">
                            {lead.stage}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* My Personal Sales Log */}
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                  <h3 className="text-[18px] font-bold text-[#0b1c30]">
                    My Recent Settlements
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex gap-3 items-center border-b border-slate-100 pb-3">
                      <span className="material-symbols-outlined text-[#059669] bg-emerald-50 p-2 rounded-full">
                        check_circle
                      </span>
                      <div className="flex-grow">
                        <span className="block text-[13px] font-bold text-[#0b1c30]">{tx.client}</span>
                        <span className="text-[10px] text-[#464652] font-semibold">{tx.timeString}</span>
                      </div>
                      <span className="text-[14px] font-bold text-[#1d4ed8]">
                        +${tx.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center rounded-b-xl">
                <span className="text-[12px] font-bold text-[#1d4ed8] hover:underline cursor-pointer" onClick={() => setActiveTab("deals")}>
                  View full ledger index
                </span>
              </div>
            </div>

          </div>
        </>
      )}

      {activeTab === "leads" && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#464652] font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-3.5 font-bold">Opportunity Lead</th>
                <th className="px-6 py-3.5 font-bold">Company</th>
                <th className="px-6 py-3.5 font-bold">Contract Value</th>
                <th className="px-6 py-3.5 font-bold">Stage</th>
                <th className="px-6 py-3.5 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[14px] text-[#0b1c30]">{lead.name}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-[#464652]">{lead.company}</td>
                  <td className="px-6 py-4 font-semibold text-[14px] text-[#1d4ed8]">${lead.value.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                      lead.stage === "Closed" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                    }`}>
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => alert(`Dialing contact number for ${lead.name}...`)}
                      className="px-3 py-1 text-xs font-semibold bg-[#1d4ed8] text-white rounded hover:bg-blue-800 border-0"
                    >
                      Call Lead
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "deals" && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#464652] font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-3.5 font-bold">Settled Account</th>
                <th className="px-6 py-3.5 font-bold">Value (USD)</th>
                <th className="px-6 py-3.5 font-bold">Cleared Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-[14px] text-[#0b1c30]">{tx.client}</td>
                  <td className="px-6 py-4 font-semibold text-[14px] text-emerald-600">+${tx.value.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-[#464652]">{tx.timeString}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "commission" && (
        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm space-y-6">
          <h3 className="text-[20px] font-bold text-[#0b1c30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1d4ed8]">calculate</span>
            Interactive Commission Calculator
          </h3>
          <p className="text-sm text-[#464652] leading-relaxed">
            Drag the slider below to simulate your monthly closed sales volume and calculate your commissions based on your 5% performance multiplier.
          </p>
          <div className="pt-4 space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-[#464652]">Simulated Sales Revenue:</span>
                <span className="text-lg font-bold text-[#0b1c30]">${simulateSales.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="1000000"
                step="10000"
                value={simulateSales}
                onChange={(e) => setSimulateSales(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1d4ed8]"
              />
              <div className="flex justify-between text-xs text-[#777683] font-bold">
                <span>$50,000</span>
                <span>$1,000,000</span>
              </div>
            </div>

            <div className="p-6 bg-blue-50/60 rounded-xl border border-blue-100 text-center space-y-2">
              <span className="block text-xs uppercase font-extrabold text-[#1d4ed8] tracking-wider">
                Simulated Commission (5%)
              </span>
              <span className="text-[36px] font-black text-[#1d4ed8] block">
                ${simulateCommission.toLocaleString()}
              </span>
              <p className="text-[11px] text-[#464652] font-semibold">
                Base commission earned before quarterly multipliers and performance bonuses.
              </p>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
