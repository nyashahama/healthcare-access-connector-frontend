import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="fixed top-2 z-50 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-white/95 px-4 shadow-lg backdrop-blur-sm">
          {/* Logo */}
          <div className="flex flex-1 items-center">
            <Link
              to="/"
              className="inline-flex items-center"
              aria-label="HealthConnect"
            >
              <Logo />
              <span className="ml-2 text-lg font-bold text-blue-700 sm:text-xl">
                HealthConnect
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden flex-1 items-center justify-center gap-6 md:flex lg:gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
            >
              FAQ
            </button>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
            <Link
              to="/auth/sign-in"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm hover:bg-gray-50"
            >
              Sign In
            </Link>
            <Link
              to="/auth/sign-up/patient"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-blue-700"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-2 rounded-2xl border border-blue-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm md:hidden">
            <nav className="mb-4 flex flex-col space-y-3">
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-sm font-medium text-gray-600 transition hover:text-blue-600"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-left text-sm font-medium text-gray-600 transition hover:text-blue-600"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-left text-sm font-medium text-gray-600 transition hover:text-blue-600"
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-left text-sm font-medium text-gray-600 transition hover:text-blue-600"
              >
                FAQ
              </button>
            </nav>
            <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
              <Link
                to="/auth/sign-in"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm text-gray-800 shadow-sm hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/auth/sign-up/patient"
                className="rounded-md bg-blue-600 px-4 py-2 text-center text-sm text-white shadow-sm hover:bg-blue-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
