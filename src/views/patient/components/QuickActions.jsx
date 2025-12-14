import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaStethoscope,
  FaCommentMedical,
  FaAppleAlt,
} from "react-icons/fa";
import { MdInfo, MdCheckCircle } from "react-icons/md";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const QuickActions = () => {
  const [modalState, setModalState] = useState({
    findClinic: false,
    checkSymptoms: false,
    chatDoctor: false,
    nutritionTips: false,
  });
  const { showToast } = useToast();

  const actions = [
    {
      icon: <FaMapMarkerAlt />,
      label: "Find Clinic",
      color: "bg-blue-500",
      description: "Search nearby healthcare facilities",
      onClick: () => setModalState((prev) => ({ ...prev, findClinic: true })),
    },
    {
      icon: <FaStethoscope />,
      label: "Check Symptoms",
      color: "bg-green-500",
      description: "Get instant health advice",
      onClick: () =>
        setModalState((prev) => ({ ...prev, checkSymptoms: true })),
    },
    {
      icon: <FaCommentMedical />,
      label: "Chat with Doctor",
      color: "bg-purple-500",
      description: "24/7 telemedicine service",
      onClick: () => setModalState((prev) => ({ ...prev, chatDoctor: true })),
    },
    {
      icon: <FaAppleAlt />,
      label: "Nutrition Tips",
      color: "bg-orange-500",
      description: "Child nutrition guides",
      onClick: () =>
        setModalState((prev) => ({ ...prev, nutritionTips: true })),
    },
  ];

  const handleClinicFind = () => {
    setModalState((prev) => ({ ...prev, findClinic: false }));
    showToast("Opening clinic finder...", "info");
    setTimeout(() => {
      window.location.href = "/patient/clinics";
    }, 1000);
  };

  const handleSymptomStart = () => {
    setModalState((prev) => ({ ...prev, checkSymptoms: false }));
    showToast("Starting symptom checker...", "info");
    setTimeout(() => {
      window.location.href = "/patient/symptom-checker";
    }, 1000);
  };

  const handleChatStart = () => {
    setModalState((prev) => ({ ...prev, chatDoctor: false }));
    showToast("Connecting to doctor...", "info");
    setTimeout(() => {
      window.location.href = "/patient/telemedicine";
    }, 1000);
  };

  const handleNutritionOpen = () => {
    setModalState((prev) => ({ ...prev, nutritionTips: false }));
    showToast("Opening nutrition guide...", "info");
    setTimeout(() => {
      window.location.href = "/patient/nutrition";
    }, 1000);
  };

  return (
    <>
      {/* Find Clinic Modal */}
      <Modal
        isOpen={modalState.findClinic}
        onClose={() =>
          setModalState((prev) => ({ ...prev, findClinic: false }))
        }
        title="Find Nearby Clinics"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <FaMapMarkerAlt className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              Find Healthcare Facilities
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Search clinics by location and services
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <div className="font-medium">Search Options:</div>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>• By current location</li>
                <li>• By suburb/postal code</li>
                <li>• By specialty (Pediatrics, Emergency, etc.)</li>
                <li>• By operating hours</li>
              </ul>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <div className="flex items-start">
                <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Real-time availability and wait times are shown for each
                  clinic.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() =>
                setModalState((prev) => ({ ...prev, findClinic: false }))
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleClinicFind}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Find Clinics
            </button>
          </div>
        </div>
      </Modal>

      {/* Check Symptoms Modal */}
      <Modal
        isOpen={modalState.checkSymptoms}
        onClose={() =>
          setModalState((prev) => ({ ...prev, checkSymptoms: false }))
        }
        title="Symptom Checker"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <FaStethoscope className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              Symptom Checker
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Get preliminary health advice
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <div className="font-medium">How it works:</div>
              <ol className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>1. Select symptoms from the list</li>
                <li>2. Answer follow-up questions</li>
                <li>3. Receive preliminary advice</li>
                <li>4. Get recommendations for next steps</li>
              </ol>
            </div>

            <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <div className="flex items-start">
                <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>Note:</strong> This is not a substitute for
                  professional medical advice.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() =>
                setModalState((prev) => ({ ...prev, checkSymptoms: false }))
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSymptomStart}
              className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
            >
              Start Check
            </button>
          </div>
        </div>
      </Modal>

      {/* Chat with Doctor Modal */}
      <Modal
        isOpen={modalState.chatDoctor}
        onClose={() =>
          setModalState((prev) => ({ ...prev, chatDoctor: false }))
        }
        title="Chat with Doctor"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <FaCommentMedical className="h-8 w-8 text-purple-600 dark:text-purple-300" />
            </div>
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              Telemedicine Service
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              24/7 access to healthcare professionals
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <div className="font-medium">Service Features:</div>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>• Live chat with certified doctors</li>
                <li>• Video consultations available</li>
                <li>• Prescription renewals</li>
                <li>• Medical advice for non-emergencies</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20">
                <div className="font-bold text-green-700 dark:text-green-300">
                  Average Wait
                </div>
                <div className="text-sm">5-10 min</div>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20">
                <div className="font-bold text-blue-700 dark:text-blue-300">
                  Cost
                </div>
                <div className="text-sm">R150 - R350</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() =>
                setModalState((prev) => ({ ...prev, chatDoctor: false }))
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleChatStart}
              className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600"
            >
              Start Chat
            </button>
          </div>
        </div>
      </Modal>

      {/* Nutrition Tips Modal */}
      <Modal
        isOpen={modalState.nutritionTips}
        onClose={() =>
          setModalState((prev) => ({ ...prev, nutritionTips: false }))
        }
        title="Nutrition Tips"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <FaAppleAlt className="h-8 w-8 text-orange-600 dark:text-orange-300" />
            </div>
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              Child Nutrition Guide
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Healthy eating for growing children
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <div className="font-medium">Today's Tip:</div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Include colorful fruits and vegetables in every meal. Try making
                fruit salads or veggie sticks with dip.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-900/20">
                <div className="font-bold text-red-700 dark:text-red-300">
                  Limit
                </div>
                <div className="text-sm">Sugary drinks</div>
              </div>
              <div className="rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20">
                <div className="font-bold text-green-700 dark:text-green-300">
                  Encourage
                </div>
                <div className="text-sm">Water intake</div>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <div className="flex items-start">
                <MdCheckCircle className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Regular mealtimes help establish healthy eating habits.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() =>
                setModalState((prev) => ({ ...prev, nutritionTips: false }))
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleNutritionOpen}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              View Full Guide
            </button>
          </div>
        </div>
      </Modal>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} linear flex flex-col items-center justify-center rounded-xl p-6 text-white transition duration-200 hover:scale-[1.02] hover:opacity-90`}
          >
            <div className="mb-3 text-3xl">{action.icon}</div>
            <span className="mb-2 text-lg font-bold">{action.label}</span>
            <span className="text-center text-sm opacity-90">
              {action.description}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};

export default QuickActions;
