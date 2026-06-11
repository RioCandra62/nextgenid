"use client";

import React from "react";
import { Agent, Transaction } from "./layout";

interface BranchDashboardContentProps {
  showFilterDropdown: boolean;
  setShowFilterDropdown: (show: boolean) => void;
  setActiveFilter: (filter: "all" | "high" | "recent") => void;
  totalSales: number;
  targetPercentSales: number;
  targetPercentCompletion: number;
  monthlyGoal: number;
  targetCompletionCurrent: number;
  agents: Agent[];
  filteredTransactions: Transaction[];
  setSelectedAgentForView: (agent: Agent | null) => void;
}

export default function BranchDashboardContent({
  showFilterDropdown,
  setShowFilterDropdown,
  setActiveFilter,
  totalSales,
  targetPercentSales,
  targetPercentCompletion,
  monthlyGoal,
  targetCompletionCurrent,
  agents,
  filteredTransactions,
  setSelectedAgentForView,
}: BranchDashboardContentProps) {
    return (
         <main className="md:ml-64 flex-1 p-8 bg-[#f8f9ff] min-h-screen">
          
          {/* Branch Overview Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[12px] text-[#15157d] font-extrabold tracking-widest uppercase mb-1 block">
                North East Region
              </span>
              <h1 className="text-[32px] font-bold text-[#0b1c30] leading-tight">
                Branch Overview
              </h1>
              <p className="text-[14px] text-[#464652] mt-1">
                Real-time performance monitoring for NYC Downtown Branch.
              </p>
            </div>
            <div className="flex gap-3">
              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-2 bg-white border border-[#c7c5d4] px-4 py-2 rounded-lg text-[#0b1c30] text-[14px] font-semibold hover:bg-slate-50 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#464652]">filter_list</span>
                  <span>Filter</span>
                </button>
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e2e8f0] rounded-lg shadow-xl z-20 overflow-hidden">
                    <button
                      onClick={() => {
                        setActiveFilter("all");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-semibold text-[#0b1c30]"
                    >
                      All Transactions
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilter("high");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-semibold text-[#0b1c30]"
                    >
                      High Value (&ge; $10k)
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilter("recent");
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-semibold text-[#0b1c30]"
                    >
                      Recently Closed
                    </button>
                  </div>
                )}
              </div>

              {/* Export Button */}
              <button
                className="flex items-center gap-2 bg-[#15157d] text-white px-4 py-2 rounded-lg text-[14px] font-semibold hover:bg-[#2e3192] shadow-lg shadow-blue-900/10 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                Export Report
              </button>
            </div>
          </div>

          {/* Bento Grid Aggregate KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            
            {/* Total Sales Card */}
            <div className="md:col-span-1 bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[72px] text-[#15157d]">
                  payments
                </span>
              </div>
              <h3 className="text-[16px] font-semibold text-[#464652] mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#15157d] text-[20px]">
                  analytics
                </span>
                Total Branch Sales
              </h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-[36px] font-bold text-[#0b1c30] leading-none">
                  ${(totalSales / 1000000).toFixed(2)}M
                </span>
                <span className="text-[#059669] font-semibold text-[14px] flex items-center mb-1">
                  <span className="material-symbols-outlined text-[16px] font-extrabold mr-0.5">arrow_upward</span>
                  12.5%
                </span>
              </div>
              <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden mt-4">
                <div
                  className="bg-[#15157d] h-full rounded-full transition-all duration-500"
                  style={{ width: `${targetPercentSales}%` }}
                ></div>
              </div>
              <span className="text-[12px] text-[#464652] mt-2 block font-medium">
                {targetPercentSales}% of monthly forecast reached
              </span>
            </div>

            {/* Target Completion Card */}
            <div className="md:col-span-1 bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-[16px] font-semibold text-[#464652] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00658d] text-[20px]">
                  track_changes
                </span>
                Target Completion
              </h3>
              <div className="relative w-28 h-28 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-[#dce9ff]"
                    cx="56"
                    cy="56"
                    fill="transparent"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="7"
                  ></circle>
                  <circle
                    className="text-[#00658d] transition-all duration-1000"
                    cx="56"
                    cy="56"
                    fill="transparent"
                    r="48"
                    stroke="currentColor"
                    strokeDasharray="301.6"
                    strokeDashoffset={301.6 - (targetPercentCompletion / 100) * 301.6}
                    strokeWidth="7"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[20px] font-bold text-[#00658d] leading-none">
                    {targetPercentCompletion}%
                  </span>
                  <span className="text-[10px] font-semibold text-[#464652] mt-0.5">
                    Overall
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-between text-[#464652] text-[12px] font-semibold">
                <div className="text-center">
                  <span className="block text-[#0b1c30] text-[14px]">
                    ${(monthlyGoal / 1000000).toFixed(1)}M
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Goal</span>
                </div>
                <div className="text-center border-l border-slate-100 pl-4">
                  <span className="block text-[#0b1c30] text-[14px]">
                    ${(targetCompletionCurrent / 1000000).toFixed(1)}M
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Current</span>
                </div>
              </div>
            </div>

            {/* Best Performing Agent Card */}
            <div className="md:col-span-2 bg-[#15157d] p-6 rounded-xl shadow-xl text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="material-symbols-outlined text-[110px]">workspace_premium</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-[16px] font-semibold mb-5 flex items-center gap-2 text-white">
                  <span className="material-symbols-outlined text-white text-[20px]">
                    stars
                  </span>
                  Best Performing Agent
                </h3>
                <div className="flex items-center gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-[88px] h-[88px] rounded-full border-2 border-white/20 p-0.5 bg-white/5">
                      <img
                        alt="Agent of the month"
                        className="w-full h-full rounded-full object-cover shadow-lg"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFh29ZXb3ZcJRMYoLMT1XZ043G0Jfhbk6xMAq3E_ua9r675AJQ5oU_RHjefg8-251E-Po1sHDM3cagid0vtwM_w9v2Pxr7vyYCwifI9FLAFybvHCq8DMROlxfD3swEX_WyFyQd_aZrCr6_cgSP5u05cpLNlhJjhjp-0qg1OcvgGLGAxhHLWEszP11RAufrTHgZ0lMy8n6UNI1ASjObUm1ostGPi1HHVLU6BSfWKlEv-Le5mPSmeoJzTzWp1ykQnI2YedC4kFHpFg"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white text-[#15157d] p-1 rounded-full shadow-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px] font-bold">
                        workspace_premium
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[24px] text-white font-bold mb-0.5 tracking-tight">
                      Sarah Jenkins
                    </h4>
                    <p className="text-white/70 text-[13px] font-medium mb-3">
                      Senior Sales Consultant
                    </p>
                    <div className="grid grid-cols-2 gap-3 max-w-[280px]">
                      <div className="bg-white/10 rounded-lg p-2.5">
                        <span className="block text-[9px] uppercase font-bold text-white/50 tracking-wider">
                          Revenue
                        </span>
                        <span className="text-[16px] text-white font-bold leading-tight">
                          ${agents.find((a) => a.id === "sj")?.totalValue.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2.5">
                        <span className="block text-[9px] uppercase font-bold text-white/50 tracking-wider">
                          Deals Closed
                        </span>
                        <span className="text-[16px] text-white font-bold leading-tight">
                          {agents.find((a) => a.id === "sj")?.deals}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Team Performance & Sales Log Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Team Performance Leaderboard */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-fit">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="text-[18px] font-bold text-[#0b1c30]">
                  Team Performance
                </h3>
                <div className="flex gap-2">
                  <span className="bg-[#d1fae5] text-[#065f46] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                    Active Team
                  </span>
                  <span className="bg-slate-100 text-[#464652] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                    12 Agents
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[#464652] font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                      <th className="px-6 py-3.5 font-bold">Agent</th>
                      <th className="px-6 py-3.5 font-bold">Status</th>
                      <th className="px-6 py-3.5 font-bold">Deals</th>
                      <th className="px-6 py-3.5 font-bold">Total Value</th>
                      <th className="px-6 py-3.5 font-bold">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {agents.map((agent) => (
                      <tr
                        key={agent.id}
                        className="hover:bg-slate-50/85 transition-colors group cursor-pointer"
                        onClick={() => setSelectedAgentForView(agent)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[13px] shadow-sm ${agent.colorClass} ${agent.textColorClass}`}
                            >
                              {agent.initials}
                            </div>
                            <div>
                              <span className="block text-[14px] text-[#0b1c30] font-semibold leading-tight">
                                {agent.name}
                              </span>
                              <span className="text-[11px] text-[#464652] font-medium">
                                {agent.id === "sj" ? "Top Tier" : agent.id === "lw" ? "Senior" : agent.id === "mc" ? "Associate" : "Junior"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              agent.status === "Online"
                                ? "bg-[#d1fae5] text-[#065f46]"
                                : agent.status === "In Meeting"
                                ? "bg-[#fef3c7] text-[#92400e]"
                                : "bg-[#f1f5f9] text-[#374151]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                agent.status === "Online"
                                  ? "bg-[#34d399]"
                                  : agent.status === "In Meeting"
                                  ? "bg-[#fbbf24]"
                                  : "bg-[#9ca3af]"
                              }`}
                            ></span>
                            {agent.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[13px] font-semibold text-[#0b1c30]">
                          {agent.deals}
                        </td>
                        <td className="px-6 py-4 text-[13px] font-semibold text-[#0b1c30]">
                          ${(agent.totalValue / 1000).toFixed(0)}k
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  agent.id === "lw" ? "bg-[#10b981]" : agent.id === "dk" ? "bg-[#3b82f6]" : "bg-[#15157d]"
                                }`}
                                style={{ width: `${agent.efficiency}%` }}
                              ></div>
                            </div>
                            <span className="text-[11px] font-bold text-[#0b1c30]">
                              {agent.efficiency}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Branch Sales Log */}
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[500px]">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="text-[18px] font-bold text-[#0b1c30]">
                  Branch Sales Log
                </h3>
                <button
                  className="material-symbols-outlined text-[#464652] cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors text-[20px]"
                >
                  history
                </button>
              </div>

              {/* Transaction list scroller */}
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-4">
                {filteredTransactions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <span className="material-symbols-outlined text-[40px] text-slate-300 mb-2">
                      receipt_long
                    </span>
                    <p className="text-sm font-semibold text-[#464652]">
                      No deals match the filter
                    </p>
                  </div>
                ) : (
                  filteredTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex gap-4 p-3 rounded-lg border border-transparent hover:border-[#e2e8f0] hover:bg-slate-50/50 transition-all"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#d1fae5] flex items-center justify-center flex-shrink-0 shadow-inner">
                        <span className="material-symbols-outlined text-[#047857] text-[18px]">
                          receipt_long
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-[13px] font-bold text-[#0b1c30]">
                            {tx.agentName}
                          </span>
                          <span className="text-[13px] font-bold text-[#15157d]">
                            +${tx.value.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[#464652] text-[11px] font-semibold leading-tight mb-1.5">
                          {tx.client}
                        </p>
                        <span className="text-[9px] text-[#464652] uppercase font-bold tracking-wider">
                          {tx.timeString}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 bg-slate-50 text-center border-t border-slate-100 rounded-b-xl">
                <button
                  className="text-[#15157d] text-[12px] hover:underline font-bold"
                >
                  View All Transactions
                </button>
              </div>
            </div>

          </div>

        </main>
    )
}