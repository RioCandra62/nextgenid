"use client";

import React, { useState } from "react";
import OwnerDashboardNavBar from "@/app/components/owner/navbar";
import OwnerDashboardSideBar from "@/app/components/owner/sidebar";
import OwnerDashboardContent from "./page";

export default function OwnerDashboardLayout({children}: {children: React.ReactNode}) {

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
