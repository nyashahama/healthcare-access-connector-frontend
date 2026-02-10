import React from "react";

// Declare images globally as constants
const IMAGES = {
  PLANET: "/images/planet.png",
  PLANET_OVERLAY: "/images/planet-overlay.svg",
  TAG_01: "/images/planet-tag-01.png",
  TAG_02: "/images/planet-tag-02.png",
  TAG_03: "/images/planet-tag-03.png",
  TAG_04: "/images/planet-tag-04.png",
};

const features = [
  {
    icon: (
      <svg
        className="fill-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
      >
        <path d="M8 0C3.582 0 0 3.582 0 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zm-1-7V5h2v2h2v2h-4v2H7z" />
      </svg>
    ),
    title: "AI Symptom Checker",
    description:
      "Get instant, AI-powered insights on symptoms for you or your child. Triage advice and next steps in seconds.",
  },
  {
    icon: (
      <svg
        className="fill-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
      >
        <path d="M8 0C3.582 0 0 3.582 0 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zm1-7V4H7v3H5v2h4v3h2V9H9z" />
      </svg>
    ),
    title: "Find Free Clinics",
    description:
      "Locate nearby clinics with real-time availability, services, and directions—filtered for your needs.",
  },
  {
    icon: (
      <svg
        className="fill-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
      >
        <path d="M15 4H1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1ZM3 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1a1 1 0 1 1 0 2H3a3 3 0 0 1-3-3V2a3 3 0 0 1 3-3h1a1 1 0 1 1 0 2H3ZM13 1a1 1 0 0 0 0 2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1a1 1 0 1 0 0 2h1a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3h-1Z" />
      </svg>
    ),
    title: "Telemedicine Chat",
    description:
      "Secure, real-time chats with verified healthcare providers. Upload photos and get advice from anywhere.",
  },
  {
    icon: (
      <svg
        className="fill-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
      >
        <path d="M10.284.33a1 1 0 1 0-.574 1.917 6.049 6.049 0 0 1 2.417 1.395A1 1 0 0 0 13.5 2.188 8.034 8.034 0 0 0 10.284.33ZM6.288 2.248A1 1 0 0 0 5.718.33 8.036 8.036 0 0 0 2.5 2.187a1 1 0 0 0 1.372 1.455 6.036 6.036 0 0 1 2.415-1.395ZM1.42 5.401a1 1 0 0 1 .742 1.204 6.025 6.025 0 0 0 0 2.79 1 1 0 0 1-1.946.462 8.026 8.026 0 0 1 0-3.714A1 1 0 0 1 1.421 5.4Zm2.452 6.957A1 1 0 0 0 2.5 13.812a8.036 8.036 0 0 0 3.216 1.857 1 1 0 0 0 .574-1.916 6.044 6.044 0 0 1-2.417-1.395Zm9.668.04a1 1 0 0 1-.041 1.414 8.033 8.033 0 0 1-3.217 1.857 1 1 0 1 1-.571-1.917 6.035 6.035 0 0 0 2.415-1.395 1 1 0 0 1 1.414.042Zm2.242-6.255a1 1 0 1 0-1.946.462 6.03 6.03 0 0 1 0 2.79 1 1 0 1 0 1.946.462 8.022 8.022 0 0 0 0-3.714Z" />
      </svg>
    ),
    title: "Nutrition Resources",
    description:
      "Personalized nutrition tips, recipes, and tools for child health—tailored to age and location.",
  },
  {
    icon: (
      <svg
        className="fill-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
      >
        <path d="M9 1a1 1 0 1 0-2 0v6a1 1 0 0 0 2 0V1ZM4.572 3.08a1 1 0 0 0-1.144-1.64A7.987 7.987 0 0 0 0 8a8 8 0 0 0 16 0c0-2.72-1.36-5.117-3.428-6.56a1 1 0 1 0-1.144 1.64A5.987 5.987 0 0 1 14 8 6 6 0 1 1 2 8a5.987 5.987 0 0 1 2.572-4.92Z" />
      </svg>
    ),
    title: "SMS Access",
    description:
      "No internet? Text HELP to 12345 for clinic info, tips, and callbacks—healthcare for all.",
  },
  {
    icon: (
      <svg
        className="fill-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
      >
        <path d="M15 4H1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1ZM3 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1a1 1 0 1 1 0 2H3a3 3 0 0 1-3-3V2a3 3 0 0 1 3-3h1a1 1 0 1 1 0 2H3ZM13 1a1 1 0 0 0 0 2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1a1 1 0 1 0 0 2h1a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3h-1Z" />
      </svg>
    ),
    title: "Secure Dashboard",
    description:
      "Track appointments, chat history, and health progress in one secure place.",
  },
];

export default function FeaturesPlanet() {
  return (
    <section id="features" className="relative bg-gray-900 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mx-auto max-w-3xl pb-8 text-center sm:pb-12 md:pb-16">
          <h2 className="text-2xl font-bold text-gray-100 sm:text-3xl md:text-4xl">
            HealthConnect Empowers Everyone to Access Quality Care
          </h2>
        </div>

        {/* Planet - Responsive with scaled images */}
        <div className="pb-12 md:pb-16 lg:pb-20">
          <div className="text-center">
            <div className="relative inline-flex rounded-full before:absolute before:inset-0 before:-z-10 before:scale-[.85] before:animate-pulse before:bg-gradient-to-b before:from-blue-600 before:to-blue-800/50 before:blur-3xl after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(closest-side,rgb(59,130,246),transparent)]">
              {/* Main planet image - responsive sizing */}
              <img
                className="rounded-full bg-gray-900"
                src={IMAGES.PLANET}
                width={400}
                height={400}
                alt="Health Planet"
                style={{
                  width: "clamp(250px, 60vw, 400px)",
                  height: "clamp(250px, 60vw, 400px)",
                }}
              />

              {/* Decorative overlays and tags - hidden on small mobile, visible on tablet+ */}
              <div
                className="pointer-events-none hidden sm:block"
                aria-hidden="true"
              >
                <img
                  className="absolute -right-32 -top-10 z-10 max-w-none sm:-right-48 sm:-top-16 lg:-right-64 lg:-top-20"
                  src={IMAGES.PLANET_OVERLAY}
                  width={789}
                  height={755}
                  alt="Health Planet decoration"
                  style={{
                    width: "clamp(400px, 80vw, 789px)",
                    height: "auto",
                  }}
                />
                <div>
                  {/* Tag 1 - Symptom Checker */}
                  <img
                    className="absolute -left-14 top-8 z-10 opacity-80 transition-opacity duration-500 sm:-left-20 sm:top-12 lg:-left-28 lg:top-16"
                    src={IMAGES.TAG_01}
                    width={253}
                    height={56}
                    alt="Symptom Checker Tag"
                    style={{
                      animation: "float 4s ease-in-out infinite both",
                      width: "clamp(150px, 25vw, 253px)",
                      height: "auto",
                    }}
                  />

                  {/* Tag 2 - Find Clinics */}
                  <img
                    className="absolute left-28 top-4 z-10 opacity-30 transition-opacity duration-500 sm:left-40 sm:top-5 lg:left-56 lg:top-7"
                    src={IMAGES.TAG_02}
                    width={241}
                    height={56}
                    alt="Find Clinics Tag"
                    style={{
                      animation: "float 4s ease-in-out infinite 1s both",
                      width: "clamp(140px, 24vw, 241px)",
                      height: "auto",
                    }}
                  />

                  {/* Tag 3 - Telemedicine */}
                  <img
                    className="sm:bottom-18 absolute -left-10 bottom-12 z-10 opacity-25 transition-opacity duration-500 sm:-left-14 lg:-left-20 lg:bottom-24"
                    src={IMAGES.TAG_03}
                    width={253}
                    height={56}
                    alt="Telemedicine Tag"
                    style={{
                      animation: "float 4s ease-in-out infinite 2s both",
                      width: "clamp(150px, 25vw, 253px)",
                      height: "auto",
                    }}
                  />

                  {/* Tag 4 - Nutrition */}
                  <img
                    className="absolute bottom-8 left-32 z-10 opacity-60 transition-opacity duration-500 sm:bottom-12 sm:left-48 lg:bottom-16 lg:left-64"
                    src={IMAGES.TAG_04}
                    width={241}
                    height={56}
                    alt="Nutrition Tag"
                    style={{
                      animation: "float 4s ease-in-out infinite 3s both",
                      width: "clamp(140px, 24vw, 241px)",
                      height: "auto",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={index}
              className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-6 backdrop-blur-sm transition-all hover:border-gray-600/50 hover:bg-gray-800/70"
            >
              <h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
                {feature.icon}
                <span>{feature.title}</span>
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        {/* SMS Access Highlight */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-xl sm:p-8 md:mt-16">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/20 p-3 sm:mb-6 sm:p-4">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z" />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
              No Smartphone? No Problem!
            </h3>
            <p className="mx-auto mb-4 max-w-2xl text-sm sm:mb-6 sm:text-base lg:text-lg">
              HealthConnect works with any basic phone. Simply text{" "}
              <span className="font-bold">HELP</span> to{" "}
              <span className="font-bold">12345</span> for immediate access to:
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {[
                "Find Clinics",
                "Health Tips",
                "Callback",
                "Emergency Info",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-white/10 p-3 text-center backdrop-blur-sm sm:p-4"
                >
                  <div className="text-xl font-bold sm:text-2xl">{idx + 1}</div>
                  <div className="text-xs sm:text-sm">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </section>
  );
}
