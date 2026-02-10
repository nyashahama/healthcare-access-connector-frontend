import React from "react";
import { Link } from "react-router-dom";

const avatars = [
  { id: 1, alt: "Patient 01" },
  { id: 2, alt: "Caregiver 01" },
  { id: 3, alt: "Doctor 01" },
  { id: 4, alt: "Patient 02" },
  { id: 5, alt: "Caregiver 02" },
  { id: 6, alt: "Doctor 02" },
];

export default function Hero() {
  const scrollToFeatures = (e) => {
    e.preventDefault();
    const element = document.getElementById("features");
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
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pb-12 pt-24 md:pb-20 md:pt-32">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 ml-[580px] h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-500 opacity-20 blur-[160px]" />
        <div className="absolute left-1/2 top-[420px] ml-[380px] h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-500 to-blue-900 opacity-20 blur-[160px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-16">
            {/* Avatar group */}
            <div className="mb-6 flex justify-center">
              <div className="flex -space-x-3">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className="box-content h-8 w-8 rounded-full border-2 border-white bg-gradient-to-r from-blue-400 to-blue-600 sm:h-10 sm:w-10"
                    title={avatar.alt}
                  />
                ))}
              </div>
            </div>

            <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
              Connecting You to Better Health <br className="hidden lg:block" />
              in 2025 and Beyond
            </h1>

            <div className="mx-auto max-w-3xl">
              <p className="mb-8 text-base text-gray-600 sm:text-lg">
                HealthConnect is an AI-powered platform that bridges healthcare
                gaps. Find clinics, check symptoms, chat with doctors, and
                access nutrition resources—available on web, app, or even SMS
                for everyone.
              </p>

              <div className="mx-auto flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
                <Link
                  to="/auth/sign-up/patient"
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-center font-medium text-white shadow-lg hover:from-blue-700 hover:to-blue-600"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/auth/sign-up/provider"
                  className="rounded-lg bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 text-center font-medium text-white shadow-lg hover:from-green-700 hover:to-green-600"
                >
                  Register Your Clinic
                </Link>
                <button
                  onClick={scrollToFeatures}
                  className="rounded-lg bg-white px-6 py-3 text-center font-medium text-gray-800 shadow hover:bg-gray-50"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Mockup/Preview */}
          <div className="mx-auto max-w-3xl px-4">
            <div className="relative rounded-2xl bg-gray-900 p-4 shadow-2xl sm:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-gray-700 pb-3 sm:mb-6 sm:pb-4">
                <span className="text-xs font-medium text-white sm:text-sm">
                  healthconnect.org
                </span>
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                </div>
              </div>

              <div className="font-mono text-xs sm:text-sm">
                <div className="mb-2 flex items-start">
                  <div className="mr-2 mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500"></div>
                  <span className="text-green-400">✓ Symptom Check: Fever</span>
                </div>
                <div className="mb-2 ml-4 text-blue-300">
                  AI Analysis: Low Risk - Rest & Hydrate
                </div>
                <div className="ml-4 text-gray-400">
                  Book Clinic if symptoms persist for 48h
                </div>

                <div className="mt-4 flex items-start sm:mt-6">
                  <div className="mr-2 mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500"></div>
                  <span className="text-white">Chat with Doctor</span>
                </div>
                <div className="ml-4 text-green-300">
                  Connected: Dr. Sarah (Online)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
