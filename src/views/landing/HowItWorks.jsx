import React from "react";

const steps = [
  {
    number: "01",
    title: "Choose Your Role",
    description:
      "Patient, caregiver, or healthcare provider? Select your path to personalized healthcare access.",
    icon: "👤",
  },
  {
    number: "02",
    title: "Access Services",
    description:
      "Use symptom checker, find clinics, book appointments, or access health resources—all in one place.",
    icon: "🏥",
  },
  {
    number: "03",
    title: "Get Connected",
    description:
      "Connect with healthcare professionals via secure chat or find immediate care options near you.",
    icon: "💬",
  },
  {
    number: "04",
    title: "Follow Up",
    description:
      "Track your health journey, save resources, and manage appointments with our intuitive dashboard.",
    icon: "📱",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            How HealthConnect Works
          </h2>
          <p className="mt-3 text-base text-gray-600 sm:mt-4 sm:text-lg">
            Simple steps to better healthcare access for everyone
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="h-full rounded-xl bg-gradient-to-b from-blue-50 to-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-3xl sm:text-4xl">{step.icon}</div>
                  <div className="text-2xl font-bold text-blue-600 sm:text-3xl">
                    {step.number}
                  </div>
                </div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 sm:text-base">
                  {step.description}
                </p>
              </div>

              {/* Connector line (except for last item, hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden h-0.5 w-8 translate-x-4 transform bg-blue-200 lg:block"></div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid gap-6 sm:gap-8 md:mt-16 md:grid-cols-2">
          <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-white p-6 sm:p-8">
            <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">
              Secure & Private
            </h3>
            <p className="text-sm text-gray-600 sm:text-base">
              Your health data is encrypted and protected. We comply with all
              healthcare privacy regulations to keep your information safe.
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-white p-6 sm:p-8">
            <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">
              Community Driven
            </h3>
            <p className="text-sm text-gray-600 sm:text-base">
              Join thousands of patients and providers in our community forums.
              Share experiences and get support from others on similar journeys.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
