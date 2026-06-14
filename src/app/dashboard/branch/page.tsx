"use client";

import PayoutTable from "@/app/components/branch/dashboard/table";
import React, { useState } from "react";
import DataPenjualanPage from "./data_penjualan/page";

interface ActivationRequest {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  requestedAt: string;
}

interface BranchPerformance {
  id: string;
  name: string;
  revenue: number;
  target: number;
  progress: number; // percentage
  status: "Above Target" | "On Target" | "Needs Review";
}

export default function BranchDashboardContent() {
  // Mock requests for account activations
  return(
    <DataPenjualanPage/>
  )
}
