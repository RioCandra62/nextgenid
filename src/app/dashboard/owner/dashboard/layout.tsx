"use client";

import React, { useState, useEffect } from "react";
import OwnerDashboardNavBar from "@/app/components/owner/navbar";
import OwnerDashboardSideBar from "@/app/components/owner/sidebar";
import OwnerDashboardContent from "./page";
import { useRouter } from "next/navigation";

export default function OwnerDashboardLayout({children}: {children: React.ReactNode}) {
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
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Checking authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcff] text-[#0b1c30] min-h-screen flex flex-col font-sans transition-all duration-300">
      {/* Top Navbar */}
      <OwnerDashboardNavBar />

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <OwnerDashboardSideBar/>

        {/* Executive Dashboard Main Contents */}
        {children}
      </div>
    </div>
  );
}
