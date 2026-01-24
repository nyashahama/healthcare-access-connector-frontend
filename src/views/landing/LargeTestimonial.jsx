import React from "react";

export default function LargeTestimonial() {
  return (
    <section
      id="testimonials"
      className="bg-gradient-to-b from-blue-50 to-white py-12 md:py-20"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Trusted by Thousands
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See what our users say about their HealthConnect experience
          </p>
        </div>

        <div className="space-y-12">
          {/* Main Testimonial */}
          <div className="relative rounded-2xl bg-white p-8 shadow-xl">
            <div className="absolute -left-3 -top-3 text-6xl text-blue-200">
              "
            </div>
            <div className="mb-6 flex items-center">
              <div className="mr-4 h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <div>
                <h4 className="font-semibold text-gray-900">Thandiwe M.</h4>
                <p className="text-sm text-gray-600">
                  Caregiver in Johannesburg
                </p>
              </div>
            </div>
            <p className="text-xl italic text-gray-700">
              "HealthConnect saved my child's life by guiding me to the nearest
              clinic during an emergency. The symptom checker is a
              game-changer!"
            </p>
            <div className="mt-6 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          {/* Additional testimonials */}
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                name: "Dr. James K.",
                role: "General Practitioner",
                content:
                  "As a healthcare provider, HealthConnect helps me reach more patients in remote areas. The telemedicine tools are excellent.",
                rating: 5,
              },
              {
                name: "Maria S.",
                role: "New Mother",
                content:
                  "The nutrition resources and medication reminders have been invaluable for my newborn's health journey.",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center">
                  <div className="mr-3 h-12 w-12 rounded-full bg-gradient-to-r from-blue-300 to-blue-500"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
                <div className="mt-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
