import React, { useState } from "react";
import {
  MdArrowBack,
  MdArrowForward,
  MdCheckCircle,
  MdWarning,
  MdLocalHospital,
  MdEmergency,
  MdInfo,
} from "react-icons/md";
import { FaBaby, FaUser, FaHeartbeat } from "react-icons/fa";
import Card from "components/card";
import { useToast } from "hooks/useToast";
import Modal from "components/modal/Modal";

const SymptomChecker = () => {
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);
  const { showToast } = useToast();

  // Modal states
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [saveResultModalOpen, setSaveResultModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selfCareModalOpen, setSelfCareModalOpen] = useState(false);

  const questions = [
    {
      id: 1,
      question: "Who are you checking symptoms for?",
      type: "single",
      options: [
        {
          value: "self",
          label: "Myself",
          icon: <FaUser className="h-6 w-6" />,
          description: "I'm experiencing symptoms",
        },
        {
          value: "child",
          label: "My Child",
          icon: <FaBaby className="h-6 w-6" />,
          description: "Child under 12 years",
        },
        {
          value: "other",
          label: "Someone Else",
          icon: <FaHeartbeat className="h-6 w-6" />,
          description: "Family member or friend",
        },
      ],
    },
    {
      id: 2,
      question: "What is the main symptom?",
      type: "single",
      options: [
        { value: "fever", label: "Fever", severity: "medium" },
        { value: "cough", label: "Cough", severity: "low" },
        { value: "rash", label: "Skin Rash", severity: "medium" },
        { value: "diarrhea", label: "Diarrhea", severity: "medium" },
        { value: "breathing", label: "Difficulty Breathing", severity: "high" },
        { value: "pain", label: "Severe Pain", severity: "high" },
        { value: "vomiting", label: "Vomiting", severity: "medium" },
        { value: "other", label: "Other Symptom", severity: "low" },
      ],
    },
    {
      id: 3,
      question: "How long have symptoms been present?",
      type: "single",
      options: [
        { value: "hours", label: "Less than 24 hours" },
        { value: "days", label: "1-3 days" },
        { value: "week", label: "4-7 days" },
        { value: "weeks", label: "More than 1 week" },
      ],
    },
    {
      id: 4,
      question: "Is there any fever?",
      type: "single",
      options: [
        { value: "high", label: "High fever (>39°C)" },
        { value: "moderate", label: "Moderate fever (38-39°C)" },
        { value: "low", label: "Low fever (<38°C)" },
        { value: "none", label: "No fever" },
      ],
    },
    {
      id: 5,
      question: "Any other concerning symptoms?",
      type: "multiple",
      options: [
        { value: "dehydration", label: "Signs of dehydration" },
        { value: "lethargy", label: "Extreme tiredness/lethargy" },
        { value: "eating", label: "Not eating/drinking" },
        { value: "breathing", label: "Fast or difficult breathing" },
        { value: "pain", label: "Severe headache or pain" },
        { value: "none", label: "None of these" },
      ],
    },
  ];

  const results = {
    low: {
      title: "Likely Mild Condition",
      severity: "low",
      icon: <MdCheckCircle className="h-12 w-12 text-green-500" />,
      color: "green",
      recommendations: [
        "Rest and drink plenty of fluids",
        "Monitor symptoms for 24-48 hours",
        "Use over-the-counter remedies as needed",
        "Maintain good hygiene practices",
      ],
      actions: [
        {
          type: "self-care",
          label: "View Self-Care Tips",
          color: "bg-green-100 text-green-800",
        },
        {
          type: "book",
          label: "Schedule Non-Urgent Visit",
          color: "bg-blue-100 text-blue-800",
        },
      ],
    },
    medium: {
      title: "Moderate Concern",
      severity: "medium",
      icon: <MdWarning className="h-12 w-12 text-yellow-500" />,
      color: "yellow",
      recommendations: [
        "See a healthcare provider within 24-48 hours",
        "Monitor closely for worsening symptoms",
        "Keep well-hydrated",
        "Avoid contact with others if infectious",
      ],
      actions: [
        {
          type: "book",
          label: "Book Appointment Now",
          color: "bg-brand-500 text-white",
        },
        {
          type: "chat",
          label: "Chat with a Nurse",
          color: "bg-purple-100 text-purple-800",
        },
      ],
    },
    high: {
      title: "Seek Care Urgently",
      severity: "high",
      icon: <MdLocalHospital className="h-12 w-12 text-red-500" />,
      color: "red",
      recommendations: [
        "Seek medical attention today",
        "Go to nearest clinic or emergency room",
        "If breathing is difficult, call ambulance immediately",
        "Do not wait for symptoms to worsen",
      ],
      actions: [
        {
          type: "emergency",
          label: "Call Emergency Services",
          color: "bg-red-500 text-white",
        },
        {
          type: "clinic",
          label: "Find Nearest Open Clinic",
          color: "bg-orange-100 text-orange-800",
        },
      ],
    },
  };

  const handleResponse = (questionId, value, isMultiple = false) => {
    if (isMultiple) {
      setResponses((prev) => ({
        ...prev,
        [questionId]: prev[questionId]?.includes(value)
          ? prev[questionId].filter((v) => v !== value)
          : [...(prev[questionId] || []), value],
      }));
    } else {
      setResponses((prev) => ({
        ...prev,
        [questionId]: value,
      }));
      if (step < questions.length) {
        setTimeout(() => setStep(step + 1), 300);
      } else {
        calculateResult();
      }
    }
  };

  const calculateResult = () => {
    // Simple logic for demonstration
    const mainSymptom = responses[2];
    const fever = responses[4];
    const otherSymptoms = responses[5] || [];

    let severity = "low";

    if (mainSymptom === "breathing" || mainSymptom === "pain") {
      severity = "high";
      showToast("⚠️ Urgent symptoms detected!", "warning");
    } else if (fever === "high" || otherSymptoms.includes("breathing")) {
      severity = "high";
      showToast("⚠️ Urgent symptoms detected!", "warning");
    } else if (fever === "moderate" || otherSymptoms.length > 1) {
      severity = "medium";
      showToast("Moderate symptoms detected", "info");
    } else {
      showToast("Mild symptoms detected", "success");
    }

    setResult(results[severity]);
    setStep(questions.length + 1);
  };

  const handleEmergencyCall = () => {
    setEmergencyModalOpen(true);
  };

  const confirmEmergencyCall = () => {
    setEmergencyModalOpen(false);
    window.location.href = "tel:10177";
    showToast("Dialing emergency services...", "error");
  };

  const handleSaveResult = () => {
    setSaveResultModalOpen(true);
  };

  const confirmSaveResult = () => {
    console.log("Saving result to medical history:", result);
    setSaveResultModalOpen(false);
    showToast("Result saved to your medical history", "success");
  };

  const handleShareResult = () => {
    setShareModalOpen(true);
  };

  const confirmShareResult = (method) => {
    setShareModalOpen(false);
    showToast(`Shared via ${method}`, "success");
  };

  const handleShowSelfCareTips = () => {
    setSelfCareModalOpen(true);
  };

  const handleAction = (actionType) => {
    switch (actionType) {
      case "emergency":
        handleEmergencyCall();
        break;
      case "clinic":
        window.location.href = "/patient/find-clinic?emergency=true";
        showToast("Finding nearest clinics...", "info");
        break;
      case "book":
        window.location.href = "/patient/find-clinic";
        showToast("Opening appointment booking...", "info");
        break;
      case "chat":
        window.location.href = "/patient/telemedicine";
        showToast("Opening telemedicine...", "info");
        break;
      case "self-care":
        handleShowSelfCareTips();
        break;
    }
  };

  const currentQuestion = questions[step - 1];

  return (
    <div className="h-full">
      {/* Modals */}
      {/* Emergency Call Modal */}
      <Modal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        title="🚨 Emergency Call"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <MdEmergency className="h-8 w-8 text-red-600 dark:text-red-300" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Call Emergency Services?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Based on your symptoms, immediate medical attention is
              recommended.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
              <MdInfo className="mr-3 h-5 w-5 text-red-600" />
              <div>
                <div className="font-medium text-red-800 dark:text-red-300">
                  Available Emergency Numbers
                </div>
                <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                  • Ambulance: 10177
                  <br />
                  • Police: 10111
                  <br />• Cellphone Emergency: 112
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEmergencyModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmEmergencyCall}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
            >
              Call 10177 Now
            </button>
          </div>
        </div>
      </Modal>

      {/* Save Result Modal */}
      <Modal
        isOpen={saveResultModalOpen}
        onClose={() => setSaveResultModalOpen(false)}
        title="Save Assessment Result"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <MdCheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Save to Medical History?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              This assessment will be saved to your health records for future
              reference.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-3 h-4 w-4 rounded"
                defaultChecked
              />
              <span className="text-sm">Include symptom details</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-3 h-4 w-4 rounded"
                defaultChecked
              />
              <span className="text-sm">Share with my healthcare provider</span>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSaveResultModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmSaveResult}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Save Result
            </button>
          </div>
        </div>
      </Modal>

      {/* Share Result Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Assessment"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Share with Healthcare Provider
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Share your symptom assessment results
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => confirmShareResult("Email")}
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                📧
              </div>
              <span className="font-medium">Email</span>
            </button>
            <button
              onClick={() => confirmShareResult("SMS")}
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                💬
              </div>
              <span className="font-medium">SMS</span>
            </button>
            <button
              onClick={() => confirmShareResult("WhatsApp")}
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                📱
              </div>
              <span className="font-medium">WhatsApp</span>
            </button>
            <button
              onClick={() => confirmShareResult("Print")}
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                🖨️
              </div>
              <span className="font-medium">Print</span>
            </button>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Personal health information will be included. Only share with
                trusted healthcare providers.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShareModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Self-Care Tips Modal */}
      <Modal
        isOpen={selfCareModalOpen}
        onClose={() => setSelfCareModalOpen(false)}
        title="🏥 Self-Care Recommendations"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h5 className="mb-2 font-bold text-blue-800 dark:text-blue-300">
                💊 Fever Management
              </h5>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                <li>• Rest in a cool, comfortable room</li>
                <li>• Drink plenty of fluids (water, broth)</li>
                <li>• Use lukewarm sponge baths if needed</li>
                <li>• Wear lightweight clothing</li>
              </ul>
            </div>
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <h5 className="mb-2 font-bold text-green-800 dark:text-green-300">
                🤒 Symptom Relief
              </h5>
              <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                <li>• Use over-the-counter fever reducers</li>
                <li>• Gargle with salt water for sore throat</li>
                <li>• Use honey for cough (not for infants)</li>
                <li>• Elevate head while sleeping</li>
              </ul>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
              <h5 className="mb-2 font-bold text-purple-800 dark:text-purple-300">
                👶 Child-Specific Care
              </h5>
              <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-400">
                <li>• Monitor temperature every 4 hours</li>
                <li>• Watch for signs of dehydration</li>
                <li>• Offer small, frequent meals</li>
                <li>• Keep up with normal sleep routines</li>
              </ul>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <h5 className="mb-2 font-bold text-yellow-800 dark:text-yellow-300">
                ⚠️ When to Seek Help
              </h5>
              <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
                <li>• Fever above 39°C (102°F)</li>
                <li>• Symptoms worsen after 48 hours</li>
                <li>• Difficulty breathing</li>
                <li>• Refusing fluids for 8+ hours</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSelfCareModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Close
            </button>
            <button
              onClick={() => {
                showToast("Self-care guide saved", "success");
                setSelfCareModalOpen(false);
              }}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Save Guide
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          Symptom Checker
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Answer a few questions to get personalized health advice
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Progress</span>
          <span>
            {step <= questions.length
              ? `Step ${step} of ${questions.length}`
              : "Complete"}
          </span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-2 rounded-full bg-brand-500 transition-all duration-300"
            style={{
              width: `${((step - 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      {step <= questions.length && (
        <Card extra="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => step > 1 && setStep(step - 1)}
                className={`flex items-center text-sm font-medium ${
                  step > 1
                    ? "text-brand-500 hover:text-brand-600"
                    : "text-gray-400"
                }`}
                disabled={step === 1}
              >
                <MdArrowBack className="mr-2 h-4 w-4" />
                Previous
              </button>
              <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-600 dark:bg-brand-900/30">
                Question {step}
              </span>
            </div>
          </div>

          <h4 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">
            {currentQuestion.question}
          </h4>

          <div
            className={`grid gap-3 ${
              currentQuestion.type === "single"
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {currentQuestion.options.map((option, idx) => {
              const isSelected =
                currentQuestion.type === "multiple"
                  ? responses[currentQuestion.id]?.includes(option.value)
                  : responses[currentQuestion.id] === option.value;

              return (
                <button
                  key={idx}
                  onClick={() =>
                    handleResponse(
                      currentQuestion.id,
                      option.value,
                      currentQuestion.type === "multiple"
                    )
                  }
                  className={`flex items-center rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20"
                      : "border-gray-200 hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-brand-700"
                  }`}
                >
                  {option.icon && (
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30">
                      {option.icon}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-navy-700 dark:text-white">
                        {option.label}
                      </span>
                      {option.severity && (
                        <span
                          className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                            option.severity === "high"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : option.severity === "medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          }`}
                        >
                          {option.severity}
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </p>
                    )}
                  </div>
                  {currentQuestion.type === "multiple" && (
                    <div
                      className={`ml-4 flex h-6 w-6 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-brand-500 bg-brand-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <MdCheckCircle className="h-4 w-4 text-white" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Button for Single Choice */}
          {currentQuestion.type === "single" &&
            responses[currentQuestion.id] && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() =>
                    step < questions.length
                      ? setStep(step + 1)
                      : calculateResult()
                  }
                  className="linear flex items-center rounded-lg bg-brand-500 px-6 py-3 font-medium text-white transition duration-200 hover:bg-brand-600"
                >
                  {step === questions.length ? "Get Results" : "Next"}
                  <MdArrowForward className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}

          {/* Submit Button for Multiple Choice */}
          {currentQuestion.type === "multiple" && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() =>
                  step < questions.length
                    ? setStep(step + 1)
                    : calculateResult()
                }
                disabled={!responses[currentQuestion.id]?.length}
                className={`linear flex items-center rounded-lg px-6 py-3 font-medium transition duration-200 ${
                  responses[currentQuestion.id]?.length
                    ? "bg-brand-500 text-white hover:bg-brand-600"
                    : "bg-gray-100 text-gray-400 dark:bg-gray-700"
                }`}
              >
                {step === questions.length ? "Submit" : "Next"}
                <MdArrowForward className="ml-2 h-5 w-5" />
              </button>
            </div>
          )}
        </Card>
      )}

      {/* Result Card */}
      {result && (
        <Card extra="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">{result.icon}</div>
            <h4
              className={`text-2xl font-bold ${
                result.color === "green"
                  ? "text-green-600"
                  : result.color === "yellow"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {result.title}
            </h4>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Based on your symptoms, here's our assessment
            </p>

            {/* Recommendations */}
            <div className="mt-6 w-full">
              <h5 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
                Recommendations
              </h5>
              <div className="space-y-3">
                {result.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start rounded-lg bg-gray-50 p-4 dark:bg-navy-700"
                  >
                    <div
                      className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full ${
                        result.color === "green"
                          ? "bg-green-100 text-green-600"
                          : result.color === "yellow"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <p className="flex-1 text-left text-gray-700 dark:text-gray-300">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              {result.actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAction(action.type)}
                  className={`rounded-xl px-4 py-3 font-medium transition-colors ${action.color}`}
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Restart Button */}
            <button
              onClick={() => {
                setStep(1);
                setResponses({});
                setResult(null);
              }}
              className="linear mt-6 rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-700 dark:text-gray-300"
            >
              Start Over
            </button>
          </div>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="flex items-start">
          <MdWarning className="mr-3 mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Important:</strong> This symptom checker is for
              informational purposes only and is not a substitute for
              professional medical advice. If you have an emergency, please call
              emergency services immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
