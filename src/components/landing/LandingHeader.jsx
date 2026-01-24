import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function LandingHeader() {
  return (
    <header className="fixed top-2 z-50 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-white/95 px-4 shadow-lg backdrop-blur-sm">
          {/* Logo */}
          <div className="flex flex-1 items-center">
            <Link to="/" className="inline-flex" aria-label="HealthConnect">
              <Logo />
              <span className="ml-2 text-xl font-bold text-blue-700">
                HealthConnect
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            <Link
              to="/#features"
              className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
            >
              Features
            </Link>
            <Link
              to="/#how-it-works"
              className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
            >
              How It Works
            </Link>
            <Link
              to="/#testimonials"
              className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
            >
              Testimonials
            </Link>
            <Link
              to="/#faq"
              className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
            >
              FAQ
            </Link>
          </nav>

          {/* Buttons */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            <li>
              <Link
                to="/auth/sign-in"
                className="btn-sm rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm hover:bg-gray-50"
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                to="/auth/sign-up"
                className="btn-sm rounded-md bg-blue-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-blue-700"
              >
                Get Started Free
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
