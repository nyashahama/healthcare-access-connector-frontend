import React from "react";
import { Link } from "react-router-dom";

export default function Cta() {
  return (
    <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl text-center">
          {/* Glow effect */}
          <div className="absolute -inset-10 bg-gradient-to-r from-blue-500 to-blue-600 opacity-20 blur-3xl"></div>

          <div className="relative px-4 py-12 sm:px-8 md:px-12 md:py-20">
            <h2 className="mb-4 text-2xl font-bold text-white sm:mb-6 sm:text-3xl md:text-4xl">
              Join HealthConnect Today for Better Tomorrow
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-base text-blue-100 sm:mb-8 sm:text-lg">
              Start your health journey today. Access quality healthcare from
              anywhere, with any device. Join thousands who have already
              transformed their healthcare experience.
            </p>
            <div className="mx-auto flex max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <Link
                to="/auth/sign-up/patient"
                className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 px-6 py-3 text-center text-base font-semibold text-white shadow-lg hover:from-blue-600 hover:to-blue-500 sm:px-8 sm:text-lg"
              >
                <span className="inline-flex items-center">
                  Get Started as Patient
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
              <Link
                to="/auth/sign-up/provider"
                className="rounded-lg bg-gradient-to-r from-green-500 to-green-400 px-6 py-3 text-center text-base font-semibold text-white shadow-lg hover:from-green-600 hover:to-green-500 sm:px-8 sm:text-lg"
              >
                Register Your Clinic
              </Link>
              <Link
                to="/auth/sign-in"
                className="rounded-lg bg-white/10 px-6 py-3 text-center text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 sm:px-8 sm:text-lg"
              >
                <span className="hidden sm:inline">
                  Already have an account?{" "}
                </span>
                Sign In
              </Link>
            </div>

            {/* Features list */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 md:grid-cols-4">
              {[
                { label: "AI Symptom Check", value: "Instant" },
                { label: "Clinic Access", value: "24/7" },
                { label: "User Satisfaction", value: "98%" },
                { label: "Response Time", value: "< 2min" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-xl font-bold text-white sm:text-2xl">
                    {stat.value}
                  </div>
                  <div className="text-xs text-blue-200 sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
