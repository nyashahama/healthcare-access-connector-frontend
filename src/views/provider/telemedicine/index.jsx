import React, { useState, useEffect, useRef } from "react";
import Card from "components/card";
import { useToast } from "hooks/useToast";

// Component imports
import ProviderChatHeader from "./components/ProviderChatHeader";
import PatientQueue from "./components/PatientQueue";
import ProviderMessagesContainer from "./components/ProviderMessagesContainer";
import ProviderMessageInput from "./components/ProviderMessageInput";
import PatientInfo from "./components/PatientInfo";
import {
  ProviderQuickActionsCard,
  PrescriptionPadCard,
} from "./components/ProviderSidebarComponents";
import {
  EndConsultationModal,
  PrescriptionModal,
  ReferralModal,
  LabOrderModal,
} from "./components/ProviderChatModals";

const ProviderTelemedicineChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activePatient, setActivePatient] = useState(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const messagesEndRef = useRef(null);
  const { showToast } = useToast();

  // Modal states
  const [endConsultationModalOpen, setEndConsultationModalOpen] =
    useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [labOrderModalOpen, setLabOrderModalOpen] = useState(false);

  // Patient queue data
  const patientQueue = [
    {
      id: 1,
      name: "Sarah Dlamini",
      age: 32,
      avatar: "👩",
      status: "waiting",
      waitTime: "5 min",
      chiefComplaint: "Fever and headache",
      priority: "normal",
      medaidScheme: "Discovery Health",
    },
    {
      id: 2,
      name: "James Khumalo",
      age: 47,
      avatar: "👨",
      status: "waiting",
      waitTime: "12 min",
      chiefComplaint: "Chest pain",
      priority: "urgent",
      medaidScheme: "Momentum",
    },
    {
      id: 3,
      name: "Aisha Patel",
      age: 8,
      avatar: "👧",
      status: "waiting",
      waitTime: "18 min",
      chiefComplaint: "Rash on arms",
      priority: "normal",
      medaidScheme: "Bonitas",
    },
  ];

  // Mock initial messages when consulting
  useEffect(() => {
    if (activePatient) {
      setMessages([
        {
          id: 1,
          text: `Hi Doctor, I've been experiencing ${activePatient.chiefComplaint.toLowerCase()} for the past 2 days.`,
          sender: "patient",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          patient: activePatient.name,
        },
      ]);
    }
  }, [activePatient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handler functions
  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      showToast("Please enter a message", "warning");
      return;
    }

    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "provider",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, message]);
    setNewMessage("");
    showToast("Message sent", "success");
  };

  const handleAcceptPatient = (patient) => {
    setActivePatient(patient);
    setIsConsulting(true);

    const systemMsg = {
      id: 1,
      text: `Consultation started with ${patient.name} (Age: ${patient.age}) — ${patient.chiefComplaint}`,
      sender: "system",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([systemMsg]);
    showToast(`Accepted consultation with ${patient.name}`, "success");
  };

  const handleEndConsultation = () => setEndConsultationModalOpen(true);

  const confirmEndConsultation = () => {
    setIsConsulting(false);
    setActivePatient(null);

    const endMsg = {
      id: messages.length + 1,
      text: "Consultation ended. Summary has been saved to patient records.",
      sender: "system",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, endMsg]);
    setEndConsultationModalOpen(false);
    showToast("Consultation ended. Records updated.", "info");
  };

  const handleIssuePrescription = () => setPrescriptionModalOpen(true);

  const confirmPrescription = (prescriptionData) => {
    setPrescriptionModalOpen(false);
    const prescMsg = {
      id: messages.length + 1,
      text: `Prescription issued: ${prescriptionData.medication} ${prescriptionData.dosage} — ${prescriptionData.instructions}`,
      sender: "system",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, prescMsg]);
    showToast("Prescription sent to patient", "success");
  };

  const handleReferPatient = () => setReferralModalOpen(true);

  const confirmReferral = (referralData) => {
    setReferralModalOpen(false);
    const refMsg = {
      id: messages.length + 1,
      text: `Referral issued to ${referralData.specialist} at ${referralData.facility}`,
      sender: "system",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, refMsg]);
    showToast("Referral sent successfully", "success");
  };

  const handleOrderLab = () => setLabOrderModalOpen(true);

  const confirmLabOrder = (labData) => {
    setLabOrderModalOpen(false);
    const labMsg = {
      id: messages.length + 1,
      text: `Lab order placed: ${labData.tests.join(", ")} — Urgency: ${
        labData.urgency
      }`,
      sender: "system",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, labMsg]);
    showToast("Lab order submitted", "success");
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
          Provider Consultation Dashboard
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage patient consultations, issue prescriptions, and coordinate care
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card extra="overflow-hidden">
            <ProviderChatHeader
              isConsulting={isConsulting}
              activePatient={activePatient}
            />

            <ProviderMessagesContainer
              messages={messages}
              messagesEndRef={messagesEndRef}
            />

            <ProviderMessageInput
              isConsulting={isConsulting}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={handleSendMessage}
              onIssuePrescription={handleIssuePrescription}
              onReferPatient={handleReferPatient}
              onOrderLab={handleOrderLab}
              onEndConsultation={handleEndConsultation}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PatientQueue
            patients={patientQueue}
            activePatient={activePatient}
            onAcceptPatient={handleAcceptPatient}
          />

          {activePatient && <PatientInfo patient={activePatient} />}

          <ProviderQuickActionsCard />

          <PrescriptionPadCard onIssuePrescription={handleIssuePrescription} />
        </div>
      </div>

      {/* Modals */}
      <EndConsultationModal
        isOpen={endConsultationModalOpen}
        onClose={() => setEndConsultationModalOpen(false)}
        onConfirm={confirmEndConsultation}
        patient={activePatient}
      />

      <PrescriptionModal
        isOpen={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
        patient={activePatient}
        onConfirm={confirmPrescription}
      />

      <ReferralModal
        isOpen={referralModalOpen}
        onClose={() => setReferralModalOpen(false)}
        patient={activePatient}
        onConfirm={confirmReferral}
      />

      <LabOrderModal
        isOpen={labOrderModalOpen}
        onClose={() => setLabOrderModalOpen(false)}
        patient={activePatient}
        onConfirm={confirmLabOrder}
      />
    </div>
  );
};

export default ProviderTelemedicineChat;
