"use client";

import BranchDashboardNavBar from "@/app/components/branch/dashboard/navbar";
import BranchDashboardSideBar from "@/app/components/branch/dashboard/sidebar";
import React, { useState, useEffect } from "react";


// Define TypeScript interfaces for our data structures


export default function BranchDashboardLayout({children}: {children: React.ReactNode}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return(
        <div className="bg-[#fcfcff] text-[#0b1c30] min-h-screen flex flex-col font-sans transition-all duration-300">
          {/* Top Navbar */}
          <BranchDashboardNavBar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
    
          <div className="flex flex-1">
            {/* Left Sidebar */}
            <BranchDashboardSideBar isCollapsed={isCollapsed} />
    
            {/* Executive Dashboard Main Contents */}
            <main className={`flex-1 p-8 bg-[#f8f9ff] min-h-screen text-[#0b1c30] font-sans transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
              {children}
            </main>
          </div>
        </div>
  )
}
