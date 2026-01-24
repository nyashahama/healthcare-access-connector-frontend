import React from "react";
import { Link } from "react-router-dom";

export default function Cta() {
  return (
    <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl text-center">
          {/* Glow effect */}
          <div className="absolute -inset-10 bg-gradient-to-r from-blue-500 to-blue-600 opacity-20 blur-3xl"></div>

          <div className="relative px-4 py-12 md:px-12 md:py-20">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Join HealthConnect Today for Better Tomorrow
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
              Start your health journey today. Access quality healthcare from
              anywhere, with any device. Join thousands who have already
              transformed their healthcare experience.
            </p>
            <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
              <Link
                to="/auth/sign-up"
                className="mb-4 w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 px-8 py-3 text-center text-lg font-semibold text-white shadow-lg hover:from-blue-600 hover:to-blue-500 sm:mb-0 sm:w-auto"
              >
                <span className="inline-flex items-center">
                  Start Your Health Journey
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
              <Link
                to="/auth/sign-in"
                className="w-full rounded-lg bg-white/10 px-8 py-3 text-center text-lg font-semibold text-white backdrop-blur-sm hover:bg-white/20 sm:ml-4 sm:w-auto"
              >
                Already have an account? Sign In
              </Link>
            </div>

            {/* Features list */}
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "AI Symptom Check", value: "Instant" },
                { label: "Clinic Access", value: "24/7" },
                { label: "User Satisfaction", value: "98%" },
                { label: "Response Time", value: "< 2min" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
