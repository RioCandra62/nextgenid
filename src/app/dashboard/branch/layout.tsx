"use client";

import BranchDashboardNavBar from "@/app/components/branch/dashboard/navbar";
import BranchDashboardSideBar from "@/app/components/branch/dashboard/sidebar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


// Define TypeScript interfaces for our data structures


export default function BranchDashboardLayout({children}: {children: React.ReactNode}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionStr = localStorage.getItem("userSession");
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          if (session && session.isLoggedIn && session.email === "nextgendepok@179") {
            setIsAuthenticated(true);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      localStorage.removeItem("userSession");
      router.push("/dashboard/auth/login");
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#312e81]/20 border-t-[#312e81] rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Checking authentication...</span>
        </div>
      </div>
    );
  }

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
