import React, { useState } from "react";
import { MdTimer, MdPerson, MdChatBubble, MdInfo } from "react-icons/md";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const PatientQueue = () => {
  const { showToast } = useToast();
  const [startConsultationModalOpen, setStartConsultationModalOpen] =
    useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewHistoryModalOpen, setViewHistoryModalOpen] = useState(false);
  const waitingPatients = [
    {
      id: 1,
      name: "Emma Wilson",
      waitTime: "15 min",
      reason: "Telemedicine Consultation",
      priority: "high",
    },
    {
      id: 2,
      name: "David Miller",
      waitTime: "25 min",
      reason: "Prescription Refill",
      priority: "medium",
    },
    {
      id: 3,
      name: "Sophia Chen",
      waitTime: "5 min",
      reason: "Follow-up Questions",
      priority: "low",
    },
  ];

  const handleStartConsultation = (patient) => {
    setSelectedPatient(patient);
    setStartConsultationModalOpen(true);
  };

  const confirmStartConsultation = () => {
    console.log(`Starting consultation with ${selectedPatient.name}`);
    setStartConsultationModalOpen(false);
    showToast(`Consultation started with ${selectedPatient.name}!`, "success");
  };

  const handleViewHistory = (patient) => {
    setSelectedPatient(patient);
    setViewHistoryModalOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      {/* Start Consultation Modal */}
      <Modal
        isOpen={startConsultationModalOpen}
        onClose={() => setStartConsultationModalOpen(false)}
        title="Start Consultation"
        size="md"
      >
        {selectedPatient && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
                <MdPerson className="h-8 w-8 text-brand-600" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Start consultation with {selectedPatient.name}?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Reason: {selectedPatient.reason}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={confirmStartConsultation}
                className="rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
              >
                In-person
              </button>
              <button
                onClick={() => {
                  setStartConsultationModalOpen(false);
                  showToast(
                    `Telemedicine consultation started with ${selectedPatient.name}!`,
                    "success"
                  );
                }}
                className="rounded-lg border border-gray-300 bg-white py-2.5 text-sm hover:bg-gray-50 dark:border-navy-600"
              >
                Telemedicine
              </button>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex items-start">
                <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Patient will be notified and their status updated in the
                  system.
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* View History Modal */}
      <Modal
        isOpen={viewHistoryModalOpen}
        onClose={() => setViewHistoryModalOpen(false)}
        title="Patient History"
        size="lg"
      >
        {selectedPatient && (
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white">
                <MdPerson className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                  {selectedPatient.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Last visit: 2 weeks ago
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-4 dark:border-navy-700">
                <h5 className="mb-2 font-medium">Recent Visits</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Jan 15, 2024</span>
                    <span className="font-medium">Routine Check-up</span>
                    <span className="text-green-600">Completed</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Dec 20, 2023</span>
                    <span className="font-medium">Vaccination</span>
                    <span className="text-green-600">Completed</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4 dark:border-navy-700">
                <h5 className="mb-2 font-medium">Current Medications</h5>
                <p className="text-sm text-gray-600">None prescribed</p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4 dark:border-navy-700">
                <h5 className="mb-2 font-medium">Allergies</h5>
                <p className="text-sm text-gray-600">No known allergies</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-lg font-bold text-navy-700 dark:text-white">
          Patient Queue
        </h5>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <MdTimer className="mr-2 h-4 w-4" />
          Avg wait: 15 min
        </div>
      </div>

      <div className="space-y-4">
        {waitingPatients.map((patient) => (
          <div
            key={patient.id}
            className="rounded-xl border border-gray-200 p-4 dark:border-navy-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white">
                  <MdPerson className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h6 className="font-bold text-navy-700 dark:text-white">
                    {patient.name}
                  </h6>
                  <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MdTimer className="mr-1 h-3 w-3" />
                    Waiting: {patient.waitTime}
                  </div>
                </div>
              </div>

              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(
                    patient.priority
                  )}`}
                >
                  {patient.priority}
                </span>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              <MdChatBubble className="mr-2 inline h-4 w-4" />
              {patient.reason}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleStartConsultation(patient)}
                className="rounded-lg bg-brand-500 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600"
              >
                Start Consultation
              </button>
              <button
                onClick={() => handleViewHistory(patient)}
                className="rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-100 dark:border-navy-600 dark:text-gray-300"
              >
                View History
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientQueue;
