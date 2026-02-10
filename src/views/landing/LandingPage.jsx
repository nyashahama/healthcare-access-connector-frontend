import React, { useState } from "react";
import Hero from "./Hero";
import FeaturesPlanet from "./FeaturesPlanet";
import HowItWorks from "./HowItWorks";
import LargeTestimonial from "./LargeTestimonial";
import Cta from "./Cta";
import Accordion from "components/landing/Accordion";

const faqs = [
  {
    id: "1",
    title: "Is HealthConnect really free to use?",
    content:
      "Yes, HealthConnect is completely free for patients. We believe healthcare should be accessible to everyone. Some advanced features for healthcare providers may have associated costs, but all patient-facing features are free.",
  },
  {
    id: "2",
    title: "How does the SMS service work?",
    content:
      "Simply text 'HELP' to 12345 from any mobile phone (no internet required). You'll receive menu options to find clinics, get health tips, request a callback, or access emergency information.",
  },
  {
    id: "3",
    title: "Is my health information secure?",
    content:
      "Absolutely. We use bank-level encryption and comply with all healthcare privacy regulations. Your data is never shared without your explicit consent, and you control what information is shared with healthcare providers.",
  },
  {
    id: "4",
    title: "Can I use HealthConnect for my children?",
    content:
      "Yes! HealthConnect has special features for pediatric care including age-appropriate symptom checking, nutrition guidance for different age groups, and resources for common childhood conditions.",
  },
  {
    id: "5",
    title: "How quickly can I get medical advice?",
    content:
      "Our AI symptom checker provides instant guidance. For telemedicine consultations, typical wait times are under 30 minutes during business hours. SMS responses are typically within 5-10 minutes.",
  },
  {
    id: "6",
    title: "Do I need a smartphone to use HealthConnect?",
    content:
      "No! While we have mobile apps for iOS and Android, you can access all features through any web browser on any device. For those without internet access, our SMS service provides essential healthcare information.",
  },
];

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div className="overflow-hidden">
      <Hero />
      <FeaturesPlanet />
      <HowItWorks />
      <LargeTestimonial />

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-12 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-base text-gray-600 sm:mt-4 sm:text-lg">
              Get answers to common questions about HealthConnect
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <Accordion
                key={faq.id}
                title={faq.title}
                id={faq.id}
                active={activeFaq === faq.id}
              >
                <p className="text-sm sm:text-base">{faq.content}</p>
              </Accordion>
            ))}
          </div>

          <div className="mt-8 text-center sm:mt-12">
            <p className="text-sm text-gray-600 sm:text-base">
              Still have questions?{" "}
              <a
                href="mailto:support@healthconnect.org"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </section>

      <Cta />
    </div>
  );
}
