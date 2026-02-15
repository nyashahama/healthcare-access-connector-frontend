import { FaBaby, FaUser, FaHeartbeat } from "react-icons/fa";
import { MdCheckCircle, MdWarning, MdLocalHospital } from "react-icons/md";

export const questions = [
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

export const results = {
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

export const calculateSeverity = (responses) => {
  const mainSymptom = responses[2];
  const fever = responses[4];
  const otherSymptoms = responses[5] || [];

  if (mainSymptom === "breathing" || mainSymptom === "pain") {
    return "high";
  }

  if (fever === "high" || otherSymptoms.includes("breathing")) {
    return "high";
  }

  if (fever === "moderate" || otherSymptoms.length > 1) {
    return "medium";
  }

  return "low";
};
