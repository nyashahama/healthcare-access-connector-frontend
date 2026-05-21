import { FaBaby, FaUser, FaBrain, FaLungs } from "react-icons/fa";
import {
  MdWarning,
  MdLocalHospital,
  MdHome,
  MdVideoCall,
} from "react-icons/md";
import React from "react";

interface QuestionOption {
  value: boolean | number | string;
  label: string;
  icon?: React.ReactElement;
  description?: string;
  severity?: string;
}

interface Conditional {
  questionId: string;
  value: boolean | number | string;
}

interface Question {
  id: string;
  question: string;
  type: "single" | "multiple" | "textarea";
  apiField: string;
  options?: QuestionOption[];
  placeholder?: string;
  minLength?: number;
  optional?: boolean;
  conditional?: Conditional;
}

export const questions: Question[] = [
  {
    id: "is_for_dependent",
    question: "Who are you checking symptoms for?",
    type: "single",
    apiField: "is_for_dependent",
    options: [
      {
        value: false,
        label: "Myself",
        icon: <FaUser className="h-6 w-6" />,
        description: "I'm experiencing symptoms",
      },
      {
        value: true,
        label: "A Dependent",
        icon: <FaBaby className="h-6 w-6" />,
        description: "Child or family member under my care",
      },
    ],
  },
  {
    id: "chief_complaint",
    question: "Describe your main concern in your own words",
    type: "textarea",
    apiField: "chief_complaint",
    placeholder:
      "e.g. I have had a persistent headache and high fever for 3 days...",
    minLength: 10,
  },
  {
    id: "symptoms_reported",
    question: "Which symptoms are you experiencing? (select all that apply)",
    type: "multiple",
    apiField: "symptoms_reported",
    options: [
      { value: "headache", label: "Headache" },
      { value: "fever", label: "Fever" },
      { value: "fatigue", label: "Fatigue / Tiredness" },
      { value: "nausea", label: "Nausea" },
      { value: "vomiting", label: "Vomiting" },
      { value: "cough", label: "Cough" },
      {
        value: "shortness_of_breath",
        label: "Shortness of Breath",
        severity: "high",
      },
      { value: "chest_pain", label: "Chest Pain", severity: "high" },
      { value: "dizziness", label: "Dizziness" },
      { value: "diarrhea", label: "Diarrhea" },
      { value: "rash", label: "Skin Rash" },
      { value: "sore_throat", label: "Sore Throat" },
      { value: "loss_of_appetite", label: "Loss of Appetite" },
      { value: "muscle_pain", label: "Muscle / Joint Pain" },
    ],
  },
  {
    id: "body_systems_affected",
    question:
      "Which body systems do you think are affected? (select all that apply)",
    type: "multiple",
    apiField: "body_systems_affected",
    optional: true,
    options: [
      {
        value: "neurological",
        label: "Neurological",
        icon: <FaBrain className="h-5 w-5" />,
        description: "Brain, nerves, headaches",
      },
      {
        value: "respiratory",
        label: "Respiratory",
        icon: <FaLungs className="h-5 w-5" />,
        description: "Lungs, breathing, chest",
      },
      {
        value: "cardiovascular",
        label: "Cardiovascular",
        description: "Heart, circulation",
      },
      {
        value: "gastrointestinal",
        label: "Gastrointestinal",
        description: "Stomach, digestion",
      },
      {
        value: "musculoskeletal",
        label: "Musculoskeletal",
        description: "Muscles, bones, joints",
      },
      {
        value: "dermatological",
        label: "Skin",
        description: "Rashes, lesions",
      },
      { value: "urinary", label: "Urinary", description: "Kidneys, bladder" },
      { value: "not_sure", label: "Not Sure" },
    ],
  },
  {
    id: "symptom_duration",
    question: "How long have you had these symptoms?",
    type: "single",
    apiField: "symptom_duration",
    options: [
      { value: "less than 24 hours", label: "Less than 24 hours" },
      { value: "1-3 days", label: "1–3 days" },
      { value: "4-7 days", label: "4–7 days" },
      { value: "1-2 weeks", label: "1–2 weeks" },
      { value: "more than 2 weeks", label: "More than 2 weeks" },
    ],
  },
  {
    id: "severity_score",
    question: "On a scale of 1–10, how severe are your symptoms overall?",
    type: "single",
    apiField: "severity_score",
    options: [
      { value: 1, label: "1 – Barely noticeable", severity: "low" },
      { value: 2, label: "2 – Very mild", severity: "low" },
      { value: 3, label: "3 – Mild", severity: "low" },
      { value: 4, label: "4 – Mild–Moderate", severity: "low" },
      { value: 5, label: "5 – Moderate", severity: "medium" },
      { value: 6, label: "6 – Moderate–Severe", severity: "medium" },
      { value: 7, label: "7 – Severe", severity: "medium" },
      { value: 8, label: "8 – Very Severe", severity: "high" },
      { value: 9, label: "9 – Extreme", severity: "high" },
      { value: 10, label: "10 – Worst possible", severity: "high" },
    ],
  },
  {
    id: "took_medication",
    question: "Have you taken any medication for these symptoms?",
    type: "single",
    apiField: "raw_answers.took_medication",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  },
  {
    id: "medication_name",
    question: "What medication(s) did you take?",
    type: "textarea",
    apiField: "raw_answers.medication_name",
    placeholder: "e.g. paracetamol, ibuprofen...",
    conditional: { questionId: "took_medication", value: true },
    optional: true,
    minLength: 2,
  },
];

interface Responses {
  [key: string]: unknown;
}

interface ApiPayload {
  chief_complaint: string;
  symptom_duration: string | undefined;
  symptoms_reported: string[];
  body_systems_affected: string[] | undefined;
  severity_score: number | undefined;
  is_for_dependent: boolean;
  raw_answers: Record<string, unknown> | undefined;
}

export const buildApiPayload = (responses: Responses): ApiPayload => {
  const raw_answers: Record<string, unknown> = {};

  if (responses["took_medication"] !== undefined) {
    raw_answers.took_medication = responses["took_medication"];
  }
  if (responses["medication_name"]) {
    raw_answers.medication_name = responses["medication_name"];
  }

  const bodySystems = (responses["body_systems_affected"] as string[] | undefined || []).filter(
    (s: string) => s !== "not_sure"
  );

  return {
    chief_complaint: responses["chief_complaint"] as string || "",
    symptom_duration: responses["symptom_duration"] as string | undefined,
    symptoms_reported: responses["symptoms_reported"] as string[] || [],
    body_systems_affected: bodySystems.length > 0 ? bodySystems : undefined,
    severity_score: responses["severity_score"] as number | undefined ?? undefined,
    is_for_dependent: responses["is_for_dependent"] === true,
    raw_answers: Object.keys(raw_answers).length > 0 ? raw_answers : undefined,
  };
};

export const getVisibleQuestions = (responses: Responses): Question[] => {
  return questions.filter((q) => {
    if (!q.conditional) return true;
    return responses[q.conditional.questionId] === q.conditional.value;
  });
};

interface ResultAction {
  type: string;
  label: string;
  color: string;
}

interface ResultConfigItem {
  label: string;
  color: string;
  icon: React.ReactElement;
  actions: ResultAction[];
}

export const resultConfig: Record<string, ResultConfigItem> = {
  self_care: {
    label: "Self-Care Recommended",
    color: "green",
    icon: <MdHome className="h-12 w-12 text-green-500" />,
    actions: [
      {
        type: "self-care",
        label: "View Self-Care Tips",
        color: "bg-green-100 text-green-800",
      },
      {
        type: "book",
        label: "Book a Follow-Up",
        color: "bg-blue-100 text-blue-800",
      },
    ],
  },
  telemedicine: {
    label: "Telemedicine Consultation",
    color: "blue",
    icon: <MdVideoCall className="h-12 w-12 text-blue-500" />,
    actions: [
      {
        type: "chat",
        label: "Start Telemedicine Session",
        color: "bg-brand-500 text-white",
      },
      {
        type: "book",
        label: "Book an Appointment",
        color: "bg-purple-100 text-purple-800",
      },
    ],
  },
  visit_clinic: {
    label: "Visit a Clinic Soon",
    color: "yellow",
    icon: <MdWarning className="h-12 w-12 text-yellow-500" />,
    actions: [
      {
        type: "book",
        label: "Book Appointment Now",
        color: "bg-brand-500 text-white",
      },
      {
        type: "clinic",
        label: "Find Nearest Clinic",
        color: "bg-orange-100 text-orange-800",
      },
    ],
  },
  emergency: {
    label: "Seek Emergency Care Immediately",
    color: "red",
    icon: <MdLocalHospital className="h-12 w-12 text-red-500" />,
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

interface TriageBadgeItem {
  label: string;
  color: string;
}

export const triageBadge: Record<string, TriageBadgeItem> = {
  low: {
    label: "Low",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  medium: {
    label: "Medium",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  high: {
    label: "High",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  emergency: {
    label: "Emergency",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
};
