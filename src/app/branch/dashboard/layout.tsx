"use client";

import React, { useState, useEffect } from "react";
import BranchDashboardNavBar from "@/app/components/branch/dashboard/navbar";
import BranchDashboardSideBar from "@/app/components/branch/dashboard/sidebar";
import BranchDashboardContent from "./page";

// Define TypeScript interfaces for our data structures
export interface Transaction {
  id: string;
  agentName: string;
  agentInitials: string;
  value: number;
  client: string;
  timeString: string;
  timestamp: Date;
}

export interface Agent {
  id: string;
  name: string;
  initials: string;
  role: string;
  status: "Online" | "In Meeting" | "Offline";
  deals: number;
  totalValue: number;
  efficiency: number;
  colorClass: string;
  textColorClass: string;
  avatarUrl?: string;
}


export default function BranchDashboardLayout() {
  // Active Tab state
  const [activeTab, setActiveTab] = useState<"dashboard" | "leads" | "opportunities" | "accounts" | "reports" | "team">("dashboard");

  // Filter & Export States
  const [activeFilter, setActiveFilter] = useState<"all" | "high" | "recent">("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);



  // Initial Agents Data
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "sj",
      name: "Sarah Jenkins",
      initials: "SJ",
      role: "Senior Sales Consultant",
      status: "Online",
      deals: 24,
      totalValue: 452000,
      efficiency: 94,
      colorClass: "bg-[#e8e2f8]",
      textColorClass: "text-[#5b3bb3]",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFh29ZXb3ZcJRMYoLMT1XZ043G0Jfhbk6xMAq3E_ua9r675AJQ5oU_RHjefg8-251E-Po1sHDM3cagid0vtwM_w9v2Pxr7vyYCwifI9FLAFybvHCq8DMROlxfD3swEX_WyFyQd_aZrCr6_cgSP5u05cpLNlhJjhjp-0qg1OcvgGLGAxhHLWEszP11RAufrTHgZ0lMy8n6UNI1ASjObUm1ostGPi1HHVLU6BSfWKlEv-Le5mPSmeoJzTzWp1ykQnI2YedC4kFHpFg"
    },
    {
      id: "mc",
      name: "Marcus Chen",
      initials: "MC",
      role: "Associate Consultant",
      status: "In Meeting",
      deals: 18,
      totalValue: 312000,
      efficiency: 72,
      colorClass: "bg-[#e0f2fe]",
      textColorClass: "text-[#0369a1]"
    },
    {
      id: "lw",
      name: "Linda Wright",
      initials: "LW",
      role: "Senior Sales Director",
      status: "Online",
      deals: 21,
      totalValue: 298000,
      efficiency: 65,
      colorClass: "bg-[#d1fae5]",
      textColorClass: "text-[#047857]"
    },
    {
      id: "dk",
      name: "David Kim",
      initials: "DK",
      role: "Junior Associate",
      status: "Offline",
      deals: 12,
      totalValue: 124000,
      efficiency: 45,
      colorClass: "bg-[#f1f5f9]",
      textColorClass: "text-[#475569]"
    }
  ]);

  // Initial Transactions List (Initial state set to match the user's design image)
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "t1",
      agentName: "Sarah J.",
      agentInitials: "SJ",
      value: 12400,
      client: "Acme Corp - Enterprise License",
      timeString: "2 mins ago",
      timestamp: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      id: "t2",
      agentName: "Marcus C.",
      agentInitials: "MC",
      value: 4250,
      client: "TechStart Inc - Pro Tier (3 Seats)",
      timeString: "15 mins ago",
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: "t3",
      agentName: "Linda W.",
      agentInitials: "LW",
      value: 28000,
      client: "Global Logistics - Annual Contract",
      timeString: "1 hour ago",
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    },
    {
      id: "t4",
      agentName: "Sarah J.",
      agentInitials: "SJ",
      value: 1500,
      client: "Individual - Monthly Sub",
      timeString: "2 hours ago",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: "t5",
      agentName: "David K.",
      agentInitials: "DK",
      value: 850,
      client: "Creative Studio - Basic Plan",
      timeString: "3 hours ago",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
  ]);

  // Quick Add Deal Modal State
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("sj");
  const [dealDetails, setDealDetails] = useState("");

  // Agent Detail Modal State
  const [selectedAgentForView, setSelectedAgentForView] = useState<Agent | null>(null);

  // Set standard numbers matching target design:
  // Total Sales text: $1.24M
  // Target Completion: 85%
  // Goal: $2.1M, Current: $1.8M
  const monthlyGoal = 2100000; // $2.1M
  const forecastTarget = 1590000; // Target to get exactly 78% with $1.24M sales

  // Total sales calculation base (set base to $1,193,000 + transactions total value of $47,000 = $1,240,000 / $1.24M)
  const totalSales = transactions.reduce((acc, curr) => acc + curr.value, 1193000); 
  const targetPercentSales = Math.min(Math.round((totalSales / forecastTarget) * 100), 100);

  // Target Completion Card Values
  // Current target completion base ($1,737,000 + transactions = ~$1.8M)
  const targetCompletionCurrent = transactions.reduce((acc, curr) => acc + curr.value, 1738000); 
  const targetPercentCompletion = Math.min(Math.round((targetCompletionCurrent / monthlyGoal) * 100), 100);

  // SVG Circle Stroke calculation (r = 56, circumference = 351.85)
  const circleCircumference = 351.85;
  const strokeOffset = circleCircumference - (targetPercentCompletion / 100) * circleCircumference;



  // Update time strings dynamically for transactions
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions((prev) =>
        prev.map((t) => {
          const diffMs = Date.now() - t.timestamp.getTime();
          const diffMins = Math.floor(diffMs / (60 * 1000));
          let timeString = t.timeString;
          if (diffMins < 1) {
            timeString = "Just now";
          } else if (diffMins < 60) {
            timeString = `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
          } else {
            const diffHours = Math.floor(diffMins / 60);
            timeString = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
          }
          return { ...t, timeString };
        })
      );
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Simulate real-time deals arriving
  useEffect(() => {
    const clientTemplates = [
      { client: "Starlight Media - Enterprise Plan", value: 14500, desc: "Enterprise License Expansion" },
      { client: "NexaCorp - Pro Tier (10 Seats)", value: 6800, desc: "Pro Package onboarding" },
      { client: "Lumina Logistics - Custom Contract", value: 34000, desc: "Annual Supply Chain logistics deal" },
      { client: "Dr. Rachel Green - Medical Suite Plan", value: 3200, desc: "Consultancy license renewal" },
      { client: "Octane Energy - Team Pack", value: 9200, desc: "Fuel Sales Expansion" }
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const randomTemplate = clientTemplates[Math.floor(Math.random() * clientTemplates.length)];
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];

        const shortAgentName = randomAgent.name.split(" ")[0] + " " + randomAgent.name.split(" ")[1][0] + ".";

        const newTx: Transaction = {
          id: `sim-${Math.random().toString(36).substring(2, 9)}`,
          agentName: shortAgentName,
          agentInitials: randomAgent.initials,
          value: randomTemplate.value,
          client: randomTemplate.client,
          timeString: "Just now",
          timestamp: new Date()
        };

        // Update Transactions
        setTransactions((prev) => [newTx, ...prev]);

        // Update Agent closed deals and revenue
        setAgents((prevAgents) =>
          prevAgents.map((a) => {
            if (a.id === randomAgent.id) {
              const updatedDeals = a.deals + 1;
              const updatedValue = a.totalValue + randomTemplate.value;
              const updatedEff = Math.min(a.efficiency + 1, 98);
              return {
                ...a,
                deals: updatedDeals,
                totalValue: updatedValue,
                efficiency: updatedEff
              };
            }
            return a;
          })
        );


      }
    }, 25000);

    return () => clearInterval(interval);
  }, [agents]);

  // Handle custom deal submission
  const handleAddDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName || !dealValue || isNaN(Number(dealValue)) || Number(dealValue) <= 0) {
      return;
    }

    const valueNum = Number(dealValue);
    const selectedAgent = agents.find((a) => a.id === selectedAgentId);
    if (!selectedAgent) return;

    const shortAgentName = selectedAgent.name.split(" ")[0] + " " + selectedAgent.name.split(" ")[1][0] + ".";

    const newTx: Transaction = {
      id: `custom-${Math.random().toString(36).substring(2, 9)}`,
      agentName: shortAgentName,
      agentInitials: selectedAgent.initials,
      value: valueNum,
      client: `${clientName}${dealDetails ? ` - ${dealDetails}` : ""}`,
      timeString: "Just now",
      timestamp: new Date()
    };

    setTransactions((prev) => [newTx, ...prev]);

    setAgents((prevAgents) =>
      prevAgents.map((a) => {
        if (a.id === selectedAgentId) {
          return {
            ...a,
            deals: a.deals + 1,
            totalValue: a.totalValue + valueNum,
            efficiency: Math.min(a.efficiency + 2, 99)
          };
        }
        return a;
      })
    );

    setClientName("");
    setDealValue("");
    setDealDetails("");
    setIsQuickAddOpen(false);


  };

  // Filtered transactions computed state
  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilter === "high") return tx.value >= 10000;
    if (activeFilter === "recent") {
      const diffMs = Date.now() - tx.timestamp.getTime();
      return diffMs <= 30 * 60 * 1000; // within last 30 mins
    }
    return true; // "all"
  });

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen flex flex-col font-sans transition-all duration-300">
      {/* TopNavBar */}
      <BranchDashboardNavBar activeTab={activeTab} setActiveTab={setActiveTab} />


      <div className="flex flex-1">
        {/* SideNavBar */}
        <BranchDashboardSideBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <BranchDashboardContent
          showFilterDropdown={showFilterDropdown}
          setShowFilterDropdown={setShowFilterDropdown}
          setActiveFilter={setActiveFilter}
          totalSales={totalSales}
          targetPercentSales={targetPercentSales}
          targetPercentCompletion={targetPercentCompletion}
          monthlyGoal={monthlyGoal}
          targetCompletionCurrent={targetCompletionCurrent}
          agents={agents}
          filteredTransactions={filteredTransactions}
          setSelectedAgentForView={setSelectedAgentForView}
        />
      </div>

      {/* Floating Action Button for Quick Add Deal */}
      <button
        onClick={() => setIsQuickAddOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#15157d] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group cursor-pointer"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
        <span className="absolute right-full mr-4 bg-[#213145] text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-md">
          Quick Add Deal
        </span>
      </button>

      {/* QUICK ADD DEAL MODAL */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl border border-slate-200 animate-fade-in overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-[16px] font-bold text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#15157d]">
                  add_shopping_cart
                </span>
                Quick Add Deal
              </h3>
              <button
                onClick={() => setIsQuickAddOpen(false)}
                className="p-1 hover:bg-slate-200 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[#464652]">
                  close
                </span>
              </button>
            </div>
            <form onSubmit={handleAddDealSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#15157d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                    Deal Value (USD)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15000"
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#15157d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                    Agent Representative
                  </label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#15157d]"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Deal Description / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Enterprise License (100 seats)"
                  value={dealDetails}
                  onChange={(e) => setDealDetails(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#15157d]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 text-[#464652]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-[#15157d] text-white rounded-lg hover:bg-[#2e3192] active:scale-95 transition-all shadow-md"
                >
                  Add Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AGENT DETAIL VIEWER MODAL */}
      {selectedAgentForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl border border-slate-200 animate-fade-in overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#2e3192] to-[#15157d] text-white relative">
              <button
                onClick={() => setSelectedAgentForView(null)}
                className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="flex items-center gap-4">
                {selectedAgentForView.id === "sj" && selectedAgentForView.avatarUrl ? (
                  <img
                    alt={selectedAgentForView.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-md"
                    src={selectedAgentForView.avatarUrl}
                  />
                ) : (
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl border-2 border-white/20 shadow-md ${selectedAgentForView.colorClass} ${selectedAgentForView.textColorClass}`}
                  >
                    {selectedAgentForView.initials}
                  </div>
                )}
                <div>
                  <h3 className="text-[20px] text-white font-bold leading-none mb-1">
                    {selectedAgentForView.name}
                  </h3>
                  <p className="text-white/80 text-[12px] font-medium">{selectedAgentForView.role}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="block text-[9px] uppercase font-bold text-[#464652] tracking-wide">
                    Total Revenue
                  </span>
                  <span className="text-[16px] text-[#15157d] font-bold">
                    ${selectedAgentForView.totalValue.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="block text-[9px] uppercase font-bold text-[#464652] tracking-wide">
                    Deals Closed
                  </span>
                  <span className="text-[16px] text-[#0b1c30] font-bold">
                    {selectedAgentForView.deals}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="block text-[9px] uppercase font-bold text-[#464652] tracking-wide">
                    Avg Deal Size
                  </span>
                  <span className="text-[16px] text-[#00658d] font-bold">
                    ${selectedAgentForView.deals > 0 ? Math.round(selectedAgentForView.totalValue / selectedAgentForView.deals).toLocaleString() : 0}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-[#464652]">Agent Health / Status:</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      selectedAgentForView.status === "Online"
                        ? "bg-[#d1fae5] text-[#065f46]"
                        : selectedAgentForView.status === "In Meeting"
                        ? "bg-[#fef3c7] text-[#92400e]"
                        : "bg-[#f1f5f9] text-[#374151]"
                    }`}
                  >
                    {selectedAgentForView.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-[#464652]">Target Efficiency:</span>
                  <span className="text-[#0b1c30]">{selectedAgentForView.efficiency}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#15157d] h-full"
                    style={{ width: `${selectedAgentForView.efficiency}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-[#e2e8f0] hover:bg-slate-50 text-[#0b1c30] active:scale-95 transition-all"
                >
                  Ping Agent
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAgentForView(null)}
                  className="px-4 py-2 text-sm font-semibold bg-[#15157d] text-white rounded-lg hover:bg-[#2e3192] active:scale-95 transition-all shadow-md"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}