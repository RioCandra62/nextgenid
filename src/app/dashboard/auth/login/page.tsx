"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";



export default function LoginPage() {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const emailLower = email.toLowerCase();
    // Enforce @nextgen.id domain (or allow admin override for convenience)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@nextgen\.id$/;
    if (!emailRegex.test(emailLower) && emailLower !== "admin") {
      alert("Format email tidak valid. Gunakan email formal @nextgen.id (contoh: owner@nextgen.id)");
      return;
    }

    setIsLoading(true);

    // Determine dashboard path based on role in email
    let targetPath = "/dashboard/branch";
    if (emailLower.includes("owner")) {
      targetPath = "/owner/dashboard";
    } else if (emailLower.includes("sales") || emailLower.includes("agent")) {
      targetPath = "/sales/dashboard";
    } else {
      targetPath = "/dashboard/branch";
    }

    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate saving a session
      if (typeof window !== "undefined") {
        localStorage.setItem("userSession", JSON.stringify({ email, isLoggedIn: true }));
      }

      // Redirect to home/branch route
      setTimeout(() => {
        router.push(targetPath);
      }, 800);
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("userSession", JSON.stringify({ email: "google.user@nextgen.id", isLoggedIn: true }));
      }
      setTimeout(() => {
        router.push("/branch/dashboard");
      }, 800);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-[#0b1c30]">


      {/* LEFT COLUMN: Visual branding & illustration (Hidden on mobile) */}
      <div className="hidden lg:flex w-[45%] bg-[#0d0d52] bg-gradient-to-br from-[#0c0c3b] to-[#15157d] p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2dbcfe]/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#373a9b]/20 rounded-full blur-[120px]"></div>

        {/* Top Logo */}
        <div className="flex items-center gap-2 z-10">
          <span className="material-symbols-outlined text-white text-[28px] font-bold rotate-45">
            rocket_launch
          </span>
          <span className="text-[20px] font-bold tracking-tight">NextGenID</span>
        </div>

        {/* Tablet Mockup and Headline */}
        <div className="my-auto space-y-8 z-10 flex flex-col w-full">
          <div className="w-full text-left">
            <h2 className="text-[44px] font-extrabold leading-[1.15] mb-4 tracking-tight">
              Empowering Your <span className="text-[#2dbcfe]">Sales</span> <br />
              Journey
            </h2>
            <p className="text-white/70 text-[14px] leading-relaxed max-w-[440px] mb-8">
              Access the next generation of sales management. Leverage real-time KPIs, 
              automated tracking, and advanced analytics to scale your performance with 
              surgical precision.
            </p>
          </div>

          {/* Tablet Wireframe Container */}
   

          {/* Core Feature Checkmarks */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 w-full pt-6 border-t border-white/10 text-[12px] font-semibold text-white/95 leading-normal">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2dbcfe] text-[18px]">
                check_circle
              </span>
              <span>Real-time QRIS Settlements</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2dbcfe] text-[18px]">
                check_circle
              </span>
              <span>Smart Bonus Calculations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2dbcfe] text-[18px]">
                check_circle
              </span>
              <span>AI-Driven Sales Forecasting</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2dbcfe] text-[18px]">
                check_circle
              </span>
              <span>Global Team Management</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-white/40 text-[11px] font-medium z-10">
          &copy; 2026 NextGenID Systems Inc. All rights reserved.
        </div>
      </div>

      {/* RIGHT COLUMN: Login Form Form container */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 bg-[#f8f9ff]">
        <div className="w-full max-w-[440px] space-y-8 bg-white border border-[#e2e8f0] rounded-2xl p-10 shadow-lg shadow-slate-100/50">
          {/* Header */}
          <div className="text-left space-y-2">
            <h1 className="text-[32px] font-extrabold text-[#0b1c30] tracking-tight">
              Welcome Back
            </h1>
            <p className="text-[14px] text-[#464652] font-medium leading-relaxed">
              Please enter your credentials to access your sales dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-[#0b1c30] tracking-wide">
                Email Address / Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#464652] text-[20px]">
                  alternate_email
                </span>
                <input
                  type="text"
                  required
                  placeholder="name@nextgen.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8f9ff] hover:bg-slate-50 border border-[#e2e8f0] focus:border-[#15157d] rounded-xl pl-11 pr-4 py-3 text-[14px] text-[#0b1c30] placeholder-[#777683] transition-all outline-none"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[13px] font-semibold text-[#0b1c30] tracking-wide">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[13px] font-bold text-[#15157d] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#464652] text-[20px]">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f8f9ff] hover:bg-slate-50 border border-[#e2e8f0] focus:border-[#15157d] rounded-xl pl-11 pr-11 py-3 text-[14px] text-[#0b1c30] placeholder-[#777683] transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#464652] hover:text-[#0b1c30] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] select-none">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember device checkbox */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4.5 h-4.5 border-[#e2e8f0] rounded text-[#15157d] focus:ring-[#15157d] accent-[#15157d] cursor-pointer"
              />
              <label htmlFor="remember" className="text-[13px] font-semibold text-[#464652] cursor-pointer select-none">
                Remember this device for 30 days
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#15157d] text-white py-3.5 rounded-xl text-[14px] font-bold hover:bg-[#2e3192] active:scale-98 transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Separator line */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#e2e8f0]"></div>
            <span className="flex-shrink mx-4 text-[#777683] text-[12px] font-bold bg-white px-1 uppercase tracking-wider">
              Or continue with
            </span>
            <div className="flex-grow border-t border-[#e2e8f0]"></div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-slate-50 border border-[#e2e8f0] text-[#0b1c30] py-3 rounded-xl text-[14px] font-bold flex items-center justify-center gap-3 transition-all active:scale-98"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#ea4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 15 0 12 0 7.35 0 3.37 2.67 1.42 6.56l3.86 3c.9-2.69 3.42-4.52 6.72-4.52z"
              />
              <path
                fill="#4285f4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z"
              />
              <path fill="#fbbc05" d="M5.28 14.78a7.18 7.18 0 0 1 0-4.56L1.42 7.22a11.96 11.96 0 0 0 0 9.56l3.86-3z" />
              <path
                fill="#34a853"
                d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.03.69-2.35 1.1-3.83 1.1-3.3 0-6.1-2.2-7.1-5.18l-3.86 3A11.97 11.97 0 0 0 12 24z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer admin info */}
          <div className="text-center text-[13px] font-semibold text-[#464652]">
            Don't have an account?{" "}
            <button
              className="text-[#15157d] hover:underline font-bold"
            >
              Contact your administrator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}