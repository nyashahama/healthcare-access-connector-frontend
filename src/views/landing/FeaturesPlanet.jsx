import React from "react";

const features = [
  {
    icon: (
      <svg className="fill-current h-6 w-6 text-blue-600" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    title: "AI Symptom Checker",
    description:
      "Get instant, AI-powered insights on symptoms for you or your child. Triage advice and next steps in seconds.",
  },
  {
    icon: (
      <svg className="fill-current h-6 w-6 text-blue-600" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
    title: "Find Free Clinics",
    description:
      "Locate nearby clinics with real-time availability, services, and directions—filtered for your needs.",
  },
  {
    icon: (
      <svg className="fill-current h-6 w-6 text-blue-600" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
      </svg>
    ),
    title: "Telemedicine Chat",
    description:
      "Secure, real-time chats with verified healthcare providers. Upload photos and get advice from anywhere.",
  },
  {
    icon: (
      <svg className="fill-current h-6 w-6 text-blue-600" viewBox="0 0 24 24">
        <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z" />
      </svg>
    ),
    title: "Nutrition Resources",
    description:
      "Personalized nutrition tips, recipes, and tools for child health—tailored to age and location.",
  },
  {
    icon: (
      <svg className="fill-current h-6 w-6 text-blue-600" viewBox="0 0 24 24">
        <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z" />
      </svg>
    ),
    title: "SMS Access",
    description:
      "No internet? Text HELP to 12345 for clinic info, tips, and callbacks—healthcare for all.",
  },
  {
    icon: (
      <svg className="fill-current h-6 w-6 text-blue-600" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.5-6c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM12 9c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
      </svg>
    ),
    title: "Secure Dashboard",
    description:
      "Track appointments, chat history, and health progress in one secure place.",
  },
];

export default function FeaturesPlanet() {
  return (
    <section
      id="features"
      className="bg-gradient-to-b from-white to-blue-50 py-12 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            HealthConnect Empowers Everyone to Access Quality Care
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            All the tools you need for better health, accessible to everyone
            regardless of device or internet access
          </p>
        </div>

        {/* Planet visualization */}
        <div className="relative mb-16 flex justify-center">
          <div className="relative h-64 w-64 md:h-80 md:w-80">
            {/* Planet core */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-2xl">
              {/* Planet rings/features */}
              <div className="absolute -right-8 top-8 animate-pulse rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                <div className="h-2 w-16 rounded bg-white"></div>
              </div>
              <div className="absolute -left-8 top-16 animate-pulse rounded-lg bg-white/10 p-3 backdrop-blur-sm delay-300">
                <div className="h-2 w-12 rounded bg-white"></div>
              </div>
              <div className="absolute bottom-12 left-12 animate-pulse rounded-lg bg-white/10 p-3 backdrop-blur-sm delay-500">
                <div className="h-2 w-20 rounded bg-white"></div>
              </div>
              <div className="absolute -bottom-4 right-12 animate-pulse rounded-lg bg-white/10 p-3 backdrop-blur-sm delay-700">
                <div className="h-2 w-14 rounded bg-white"></div>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-blue-600/20 blur-xl"></div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
            >
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* SMS Access Highlight */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-white/20 p-4">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z" />
              </svg>
            </div>
            <h3 className="mb-4 text-2xl font-bold">
              No Smartphone? No Problem!
            </h3>
            <p className="mx-auto mb-6 max-w-2xl text-lg">
              HealthConnect works with any basic phone. Simply text{" "}
              <span className="font-bold">HELP</span> to{" "}
              <span className="font-bold">12345</span> for immediate access to:
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                "Find Clinics",
                "Health Tips",
                "Callback",
                "Emergency Info",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-white/10 p-4 text-center backdrop-blur-sm"
                >
                  <div className="text-2xl font-bold">{idx + 1}</div>
                  <div className="text-sm">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
