"use client";

import React, { useState } from "react";
import OwnerDashboardNavBar from "@/app/components/owner/navbar";
import OwnerDashboardSideBar from "@/app/components/owner/sidebar";
import OwnerDashboardContent from "./page";

export interface CompanyBranch {
  id: string;
  name: string;
  region: string;
  revenue: number;
  goal: number;
  agents: number;
  status: "Above Target" | "On Target" | "Needs Review";
  colorClass: string;
  manager: string;
}

export interface CorporateAccount {
  id: string;
  companyName: string;
  contractValue: number;
  representative: string;
  branch: string;
  status: "Active" | "Pending Review" | "Renewal Inbound";
}

export default function OwnerDashboardLayout() {
  const [activeTab, setActiveTab] = useState<"overview" | "branches" | "corporate" | "financials" | "team">("overview");

  // Mock Executive Corporate Data
  const [branches] = useState<CompanyBranch[]>([
    { id: "b1", name: "NYC Downtown Branch", region: "North America", revenue: 1240000, goal: 1500000, agents: 12, status: "Above Target", colorClass: "border-l-4 border-emerald-500", manager: "Alex Miller" },
    { id: "b2", name: "London Financial District", region: "Europe", revenue: 980000, goal: 1200000, agents: 10, status: "On Target", colorClass: "border-l-4 border-blue-500", manager: "Sarah Jenkins" },
    { id: "b3", name: "Tokyo Marunouchi Hub", region: "Asia Pacific", revenue: 1450000, goal: 1600000, agents: 15, status: "Above Target", colorClass: "border-l-4 border-emerald-500", manager: "Kenji Sato" },
    { id: "b4", name: "Singapore Raffles Suite", region: "Asia Pacific", revenue: 720000, goal: 1000000, agents: 8, status: "Needs Review", colorClass: "border-l-4 border-rose-500", manager: "Lin Wei" }
  ]);

  const [corporateAccounts] = useState<CorporateAccount[]>([
    { id: "c1", companyName: "Starlight Media Group", contractValue: 245000, representative: "Sarah J.", branch: "London", status: "Active" },
    { id: "c2", companyName: "NexaCorp International", contractValue: 180000, representative: "Kenji S.", branch: "Tokyo", status: "Renewal Inbound" },
    { id: "c3", companyName: "Lumina Supply Chain Logistics", contractValue: 340000, representative: "Linda W.", branch: "NYC", status: "Active" },
    { id: "c4", companyName: "Apex Financial Systems", contractValue: 95000, representative: "Lin W.", branch: "Singapore", status: "Pending Review" }
  ]);

  // Aggregate numbers
  const totalRevenue = branches.reduce((sum, b) => sum + b.revenue, 0);
  const companyGoal = branches.reduce((sum, b) => sum + b.goal, 0);
  const totalCorporateValue = corporateAccounts.reduce((sum, c) => sum + c.contractValue, 0);
  const totalAgents = branches.reduce((sum, b) => sum + b.agents, 0);

  return (
    <div className="bg-[#fcfcff] text-[#0b1c30] min-h-screen flex flex-col font-sans transition-all duration-300">
      {/* Top Navbar */}
      <OwnerDashboardNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <OwnerDashboardSideBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Executive Dashboard Main Contents */}
        <OwnerDashboardContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          branches={branches}
          corporateAccounts={corporateAccounts}
          totalRevenue={totalRevenue}
          companyGoal={companyGoal}
          totalCorporateValue={totalCorporateValue}
          totalAgents={totalAgents}
        />
      </div>
    </div>
  );
}
