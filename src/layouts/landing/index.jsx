import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

// Landing page components
import LandingHeader from "components/landing/LandingHeader";
import LandingFooter from "components/landing/LandingFooter";
import Banner from "components/landing/Banner";
import ToastContainer from "components/toast/ToastContainer";
import { useToast } from "hooks/useToast";

export default function LandingLayout() {
  const { showToast } = useToast();

  useEffect(() => {
    // Initialize any landing page specific functionality
    // You can add AOS or other animations here if needed
  }, []);

  return (
    <div className="font-inter flex min-h-screen flex-col bg-gray-50 tracking-tight text-gray-900 antialiased">
      <ToastContainer />
      <Banner />
      <LandingHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
}
