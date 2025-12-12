import React, { useState } from "react";
import {
  MdArrowBack,
  MdArrowForward,
  MdCheckCircle,
  MdWarning,
  MdLocalHospital,
} from "react-icons/md";
import { FaBaby, FaUser, FaHeartbeat } from "react-icons/fa";
import Card from "components/card";

const SymptomChecker = () => {
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);

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
    } else if (fever === "high" || otherSymptoms.includes("breathing")) {
      severity = "high";
    } else if (fever === "moderate" || otherSymptoms.length > 1) {
      severity = "medium";
    }

    setResult(results[severity]);
    setStep(questions.length + 1);
  };

  const handleAction = (actionType) => {
    switch (actionType) {
      case "emergency":
        window.location.href = "tel:10177";
        break;
      case "clinic":
        window.location.href = "/patient/find-clinic?emergency=true";
        break;
      case "book":
        window.location.href = "/patient/find-clinic";
        break;
      case "chat":
        window.location.href = "/patient/telemedicine";
        break;
      case "self-care":
        // Show self-care modal or redirect
        console.log("Show self-care tips");
        break;
    }
  };

  const currentQuestion = questions[step - 1];

  return (
    <div className="h-full">
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
