import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function LandingFooter({ border = false }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top area: Blocks */}
        <div
          className={`grid gap-10 py-8 sm:grid-cols-12 md:py-12 ${
            border ? "border-t border-gray-200" : ""
          }`}
        >
          {/* 1st block */}
          <div className="space-y-2 sm:col-span-12 lg:col-span-4">
            <div className="flex items-center">
              <Logo />
              <span className="ml-2 text-xl font-bold text-blue-700">
                HealthConnect
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Connecting healthcare with those who need it most
            </div>
            <div className="pt-4 text-sm text-gray-600">
              © {currentYear} HealthConnect. All Rights Reserved.
            </div>
          </div>

          {/* 2nd block - For Patients */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium text-gray-900">For Patients</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-gray-600 transition hover:text-blue-600"
                  to="/patient/symptom-checker"
                >
                  Symptom Checker
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-blue-600"
                  to="/patient/find-clinic"
                >
                  Find Clinics
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-blue-600"
                  to="/patient/book-appointment"
                >
                  Book Appointments
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-blue-600"
                  to="/patient/nutrition"
                >
                  Nutrition Resources
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-blue-600"
                  to="/patient/telemedicine"
                >
                  Chat with a Doctor
                </Link>
              </li>
            </ul>
          </div>

          {/* 3rd block - For Providers */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium text-gray-900">For Providers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-gray-600 transition hover:text-blue-600"
                  to="/provider/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-blue-600"
                  to="/provider/appointments"
                >
                  Manage Appointments
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-blue-600"
                  to="/provider/telemedicine"
                >
                  Telemedicine
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-blue-600"
                  to="/provider/clinic-management"
                >
                  Update Clinic Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* 4th block - Company */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium text-gray-900">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-gray-600 transition hover:text-blue-600"
                  to="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-blue-600"
                  to="/blog"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-blue-600"
                  to="/careers"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-blue-600"
                  to="/privacy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-600 transition hover:text-blue-600"
                  to="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* 5th block - Connect */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium text-gray-900">Connect</h3>
            <ul className="flex space-x-4">
              <li>
                <a
                  className="flex items-center justify-center text-blue-500 transition hover:text-blue-600"
                  href="#0"
                  aria-label="Twitter"
                >
                  <svg
                    className="fill-current h-8 w-8"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z"></path>
                  </svg>
                </a>
              </li>
              <li>
                <a
                  className="flex items-center justify-center text-blue-500 transition hover:text-blue-600"
                  href="#0"
                  aria-label="Facebook"
                >
                  <svg
                    className="fill-current h-8 w-8"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  className="flex items-center justify-center text-blue-500 transition hover:text-blue-600"
                  href="#0"
                  aria-label="Instagram"
                >
                  <svg
                    className="fill-current h-8 w-8"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="20.145" cy="11.892" r="1" />
                    <path d="M16 20c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z" />
                    <path d="M20 24h-8c-2.056 0-4-1.944-4-4v-8c0-2.056 1.944-4 4-4h8c2.056 0 4 1.944 4 4v8c0 2.056-1.944 4-4 4zm-8-14c-1.019 0-2 .981-2 2v8c0 1.019.981 2 2 2h8c1.019 0 2-.981 2-2v-8c0-1.019-.981-2-2-2h-8z" />
                    <path d="M16 0C7.164 0 0 7.164 0 16s7.164 16 16 16 16-7.164 16-16S24.836 0 16 0zm0 30c-7.732 0-14-6.268-14-14S8.268 2 16 2s14 6.268 14 14-6.268 14-14 14z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Big text */}
      <div
        className="relative -mt-16 h-60 w-full overflow-hidden"
        aria-hidden="true"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
          <h2
            className="text-transparent select-none bg-gradient-to-b from-blue-200 via-blue-100 to-blue-50 bg-clip-text text-[200px] font-bold leading-none md:text-[280px] lg:text-[348px]"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Health
          </h2>
        </div>
        {/* Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2/3">
          <div className="h-56 w-56 rounded-full bg-blue-500/30 blur-3xl"></div>
        </div>
      </div>
    </footer>
  );
}
