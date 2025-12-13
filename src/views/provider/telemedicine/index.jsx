import React, { useState, useEffect, useRef } from "react";
import {
  MdSend,
  MdAttachFile,
  MdVideoCall,
  MdPhone,
  MdPerson,
  MdAccessTime,
  MdMedicalServices,
  MdNoteAdd,
  MdSchedule,
  MdHistory,
  MdMessage,
  MdInfo,
  MdCheckCircle,
} from "react-icons/md";
import { FaUserMd, FaUserInjured, FaStethoscope } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const ProviderTelemedicine = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [waitingRoom, setWaitingRoom] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [consultationNotes, setConsultationNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  const { showToast } = useToast();

  // modal states
  const [endConsultationModalOpen, setEndConsultationModalOpen] =
    useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [sendSummaryModalOpen, setSendSummaryModalOpen] = useState(false);

  const [prescriptionForm, setPrescriptionForm] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  });

  const [followUpForm, setFollowUpForm] = useState({
    date: "",
    time: "",
    type: "telemedicine",
    reason: "",
  });

  // Mock data - in production, this would come from WebSocket/Socket.io
  useEffect(() => {
    // Simulate initial data
    const mockWaitingRoom = [
      {
        id: 1,
        name: "Emma Wilson",
        age: "28",
        reason: "Fever and cough for 3 days",
        waitTime: "5 min",
        priority: "medium",
        symptomCheckResult: "Likely viral infection",
        enteredQueue: "10:15 AM",
      },
      {
        id: 2,
        name: "David Miller",
        age: "45",
        reason: "Follow-up for blood pressure",
        waitTime: "10 min",
        priority: "low",
        symptomCheckResult: "Stable condition",
        enteredQueue: "10:05 AM",
      },
    ];

    const mockActiveChats = [
      {
        id: 101,
        patient: {
          id: 3,
          name: "Sarah Johnson",
          age: "32",
          reason: "Child health consultation",
          startTime: "10:00 AM",
          status: "in-progress",
        },
        messages: [
          {
            id: 1,
            text: "Hello Doctor, my 5-year-old has had a fever since yesterday",
            sender: "patient",
            time: "10:00 AM",
          },
          {
            id: 2,
            text: "Hello Sarah, I'm Dr. Smith. Can you tell me more about the symptoms?",
            sender: "provider",
            time: "10:01 AM",
          },
        ],
      },
    ];

    setWaitingRoom(mockWaitingRoom);
    setActiveChats(mockActiveChats);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAcceptPatient = (patient) => {
    // Move patient from waiting room to active chats
    setWaitingRoom((prev) => prev.filter((p) => p.id !== patient.id));

    const newChat = {
      id: Date.now(),
      patient: {
        ...patient,
        startTime: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "in-progress",
      },
      messages: [
        {
          id: 1,
          text: `Hello ${patient.name}, I'm Dr. Smith. How can I help you today?`,
          sender: "provider",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    };

    setActiveChats([...activeChats, newChat]);
    setSelectedPatient(newChat.patient);
    setMessages(newChat.messages);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedPatient) return;

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

    // Update active chat
    const updatedChats = activeChats.map((chat) => {
      if (chat.patient.id === selectedPatient.id) {
        return {
          ...chat,
          messages: [...chat.messages, message],
        };
      }
      return chat;
    });
    setActiveChats(updatedChats);
  };

  const handleEndConsultation = (patientId) => {
    const patient = activeChats.find(
      (chat) => chat.patient.id === patientId
    )?.patient;

    // Generate consultation summary
    const summary = {
      patientId: patientId,
      patientName: patient?.name,
      date: new Date().toISOString(),
      reason: patient?.reason,
      notes: consultationNotes,
      recommendations: "Follow up in 3 days if symptoms persist",
      medications: [],
    };

    showToast(`Consultation ended. Summary prepared for ${patient?.name}`);

    // Move to completed consultations
    setActiveChats((prev) =>
      prev.filter((chat) => chat.patient.id !== patientId)
    );
    if (selectedPatient?.id === patientId) {
      setSelectedPatient(null);
      setMessages([]);
    }

    setConsultationNotes("");
  };

  const handlePrescribeMedication = () => {
    setPrescriptionModalOpen(true);
    if (!selectedPatient) return;

    const medication = {
      name: "Paracetamol",
      dosage: "500mg",
      frequency: "Every 6 hours as needed",
      duration: "3 days",
    };

    const message = {
      id: messages.length + 1,
      text: `Prescribed: ${medication.name} ${medication.dosage}, ${medication.frequency} for ${medication.duration}`,
      sender: "system",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, message]);
    showToast(`Medication prescribed for ${selectedPatient.name}`);
  };

  const handleScheduleFollowUp = () => {
    setFollowUpModalOpen(true);
    if (!selectedPatient) return;

    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 3);

    const message = {
      id: messages.length + 1,
      text: `Follow-up scheduled for ${followUpDate.toLocaleDateString()}. Patient will receive SMS reminder.`,
      sender: "system",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, message]);
    //showToast(`Follow-up scheduled for ${selectedPatient.name}`);
  };

  const handleEndConsultationModal = () => {
    if (!consultationNotes.trim()) {
      showToast("Please add consultation notes before ending", "warning");
      return;
    }
    setEndConsultationModalOpen(true);
  };

  const confirmEndConsultation = () => {
    console.log(`Ending consultation for ${selectedPatient?.name}`);
    const summary = {
      patientId: selectedPatient?.id,
      patientName: selectedPatient?.name,
      notes: consultationNotes,
      endTime: new Date().toLocaleTimeString(),
    };

    // Move to completed consultations
    setActiveChats((prev) =>
      prev.filter((chat) => chat.patient.id !== selectedPatient?.id)
    );

    setSelectedPatient(null);
    setMessages([]);
    setConsultationNotes("");
    setIsRecording(false);

    setEndConsultationModalOpen(false);
    showToast(`Consultation with ${summary.patientName} completed!`, "success");
  };

  const confirmPrescription = () => {
    if (!prescriptionForm.medication || !prescriptionForm.dosage) {
      showToast("Please fill in medication and dosage", "error");
      return;
    }

    const prescriptionMsg = {
      id: messages.length + 1,
      text: `Prescribed: ${prescriptionForm.medication} ${prescriptionForm.dosage}, ${prescriptionForm.frequency} for ${prescriptionForm.duration}. Instructions: ${prescriptionForm.instructions}`,
      sender: "system",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, prescriptionMsg]);

    // Update active chat
    const updatedChats = activeChats.map((chat) => {
      if (chat.patient.id === selectedPatient.id) {
        return {
          ...chat,
          messages: [...chat.messages, prescriptionMsg],
        };
      }
      return chat;
    });
    setActiveChats(updatedChats);

    setPrescriptionModalOpen(false);
    showToast("Medication prescribed successfully!", "success");

    // Reset form
    setPrescriptionForm({
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    });
  };

  const confirmFollowUp = () => {
    if (!followUpForm.date || !followUpForm.time) {
      showToast("Please select date and time", "error");
      return;
    }

    const followUpMsg = {
      id: messages.length + 1,
      text: `Follow-up scheduled for ${followUpForm.date} at ${
        followUpForm.time
      } (${followUpForm.type}). Reason: ${
        followUpForm.reason || "Routine check"
      }`,
      sender: "system",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, followUpMsg]);

    const updatedChats = activeChats.map((chat) => {
      if (chat.patient.id === selectedPatient.id) {
        return {
          ...chat,
          messages: [...chat.messages, followUpMsg],
        };
      }
      return chat;
    });
    setActiveChats(updatedChats);

    setFollowUpModalOpen(false);
    showToast("Follow-up scheduled successfully!", "success");

    // Reset form
    setFollowUpForm({
      date: "",
      time: "",
      type: "telemedicine",
      reason: "",
    });
  };

  const handleSendSummary = () => {
    if (!consultationNotes.trim()) {
      showToast("Please add consultation notes before sending", "warning");
      return;
    }
    setSendSummaryModalOpen(true);
  };

  const confirmSendSummary = () => {
    console.log(`Sending summary to ${selectedPatient?.name}`);
    setSendSummaryModalOpen(false);
    showToast("Consultation summary sent to patient!", "success");
  };

  const MessageBubble = ({ message }) => {
    const isProvider = message.sender === "provider";
    const isSystem = message.sender === "system";

    if (isSystem) {
      return (
        <div className="my-4 flex justify-center">
          <div className="rounded-lg bg-blue-100 px-4 py-2 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {message.text}
          </div>
        </div>
      );
    }

    return (
      <div className={`flex ${isProvider ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[70%] rounded-2xl px-4 py-3 ${
            isProvider
              ? "bg-brand-500 text-white"
              : "bg-gray-100 dark:bg-navy-700"
          }`}
        >
          <p>{message.text}</p>
          <div
            className={`mt-1 text-xs opacity-70 ${
              isProvider ? "text-right" : "text-left"
            }`}
          >
            {message.time}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {/* End Consultation Modal */}
      <Modal
        isOpen={endConsultationModalOpen}
        onClose={() => setEndConsultationModalOpen(false)}
        title="End Consultation"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <MdInfo className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                End consultation with {selectedPatient?.name}?
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                This will complete the consultation and save all notes and
                prescriptions.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <div className="flex items-start">
              <MdCheckCircle className="mr-2 mt-0.5 h-5 w-5 text-green-500" />
              <p className="text-sm text-green-700 dark:text-green-300">
                Consultation notes will be saved to patient's medical record.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEndConsultationModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmEndConsultation}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              End Consultation
            </button>
          </div>
        </div>
      </Modal>

      {/* Prescription Modal */}
      <Modal
        isOpen={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
        title="Prescribe Medication"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Medication Name *
              </label>
              <input
                type="text"
                value={prescriptionForm.medication}
                onChange={(e) =>
                  setPrescriptionForm((prev) => ({
                    ...prev,
                    medication: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., Paracetamol, Amoxicillin"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Dosage *
              </label>
              <input
                type="text"
                value={prescriptionForm.dosage}
                onChange={(e) =>
                  setPrescriptionForm((prev) => ({
                    ...prev,
                    dosage: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., 500mg, 250mg/5ml"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Frequency *
              </label>
              <select
                value={prescriptionForm.frequency}
                onChange={(e) =>
                  setPrescriptionForm((prev) => ({
                    ...prev,
                    frequency: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="">Select frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Every 6 hours">Every 6 hours</option>
                <option value="As needed">As needed</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Duration *
              </label>
              <input
                type="text"
                value={prescriptionForm.duration}
                onChange={(e) =>
                  setPrescriptionForm((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., 7 days, 2 weeks"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Additional Instructions
            </label>
            <textarea
              value={prescriptionForm.instructions}
              onChange={(e) =>
                setPrescriptionForm((prev) => ({
                  ...prev,
                  instructions: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="e.g., Take with food, Avoid alcohol"
              rows="3"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setPrescriptionModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmPrescription}
              className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
            >
              Prescribe Medication
            </button>
          </div>
        </div>
      </Modal>

      {/* Schedule Follow-up Modal */}
      <Modal
        isOpen={followUpModalOpen}
        onClose={() => setFollowUpModalOpen(false)}
        title="Schedule Follow-up"
        size="md"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date *
              </label>
              <input
                type="date"
                value={followUpForm.date}
                onChange={(e) =>
                  setFollowUpForm((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Time *
              </label>
              <select
                value={followUpForm.time}
                onChange={(e) =>
                  setFollowUpForm((prev) => ({ ...prev, time: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="">Select time</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type *
              </label>
              <select
                value={followUpForm.type}
                onChange={(e) =>
                  setFollowUpForm((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="telemedicine">Telemedicine</option>
                <option value="in-person">In-person</option>
                <option value="phone">Phone Call</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reason for Follow-up
            </label>
            <textarea
              value={followUpForm.reason}
              onChange={(e) =>
                setFollowUpForm((prev) => ({ ...prev, reason: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="e.g., Review lab results, Check progress"
              rows="3"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setFollowUpModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmFollowUp}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Schedule Follow-up
            </button>
          </div>
        </div>
      </Modal>

      {/* Send Summary Modal */}
      <Modal
        isOpen={sendSummaryModalOpen}
        onClose={() => setSendSummaryModalOpen(false)}
        title="Send Consultation Summary"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <MdMessage className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Send summary to {selectedPatient?.name}?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              A summary of this consultation will be sent to the patient's email
              and SMS.
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  The summary will include:
                </p>
                <ul className="mt-1 list-inside list-disc text-xs text-blue-600 dark:text-blue-400">
                  <li>Consultation notes</li>
                  <li>Prescribed medications</li>
                  <li>Follow-up instructions</li>
                  <li>Next steps</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSendSummaryModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmSendSummary}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Send Summary
            </button>
          </div>
        </div>
      </Modal>

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          Telemedicine Consultations
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Manage real-time consultations with patients
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Waiting Room */}
        <div className="lg:col-span-1">
          <Card extra="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                Waiting Room
              </h4>
              <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-600 dark:bg-brand-900/30">
                {waitingRoom.length}
              </span>
            </div>

            <div className="space-y-3">
              {waitingRoom.map((patient) => (
                <div
                  key={patient.id}
                  className="rounded-lg border border-gray-200 p-3 dark:border-navy-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <FaUserInjured className="mr-3 h-5 w-5 text-brand-500" />
                      <div>
                        <h5 className="font-medium text-navy-700 dark:text-white">
                          {patient.name}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {patient.age} years
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center text-sm text-gray-600">
                      <MdAccessTime className="mr-1 h-4 w-4" />
                      {patient.waitTime}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{patient.reason}</p>
                  <button
                    onClick={() => handleAcceptPatient(patient)}
                    className="linear mt-3 w-full rounded-lg bg-brand-500 py-2 text-sm font-medium text-white hover:bg-brand-600"
                  >
                    Accept Consultation
                  </button>
                </div>
              ))}

              {waitingRoom.length === 0 && (
                <div className="py-8 text-center">
                  <MdMessage className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-600">
                    No patients in waiting room
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Active Consultations */}
          <Card extra="p-6 mt-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Active Consultations
            </h4>
            <div className="space-y-3">
              {activeChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setSelectedPatient(chat.patient);
                    setMessages(chat.messages);
                  }}
                  className={`cursor-pointer rounded-lg border p-3 transition ${
                    selectedPatient?.id === chat.patient.id
                      ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20"
                      : "border-gray-200 hover:bg-gray-50 dark:border-navy-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <FaUserInjured className="h-4 w-4 text-green-600 dark:text-green-300" />
                      </div>
                      <div>
                        <h5 className="font-medium text-navy-700 dark:text-white">
                          {chat.patient.name}
                        </h5>
                        <p className="text-xs text-gray-600">
                          Started: {chat.patient.startTime}
                        </p>
                      </div>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card extra="p-0 overflow-hidden">
            {/* Chat Header */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-brand-500 to-brand-600 p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {selectedPatient ? (
                    <>
                      <FaUserInjured className="mr-3 h-8 w-8 text-white" />
                      <div>
                        <h4 className="font-bold text-white">
                          Consultation with {selectedPatient.name}
                        </h4>
                        <div className="flex items-center text-sm text-white/90">
                          <span className="mr-3">
                            Age: {selectedPatient.age}
                          </span>
                          <span>Reason: {selectedPatient.reason}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <FaStethoscope className="mr-3 h-8 w-8 text-white" />
                      <div>
                        <h4 className="font-bold text-white">
                          Telemedicine Console
                        </h4>
                        <p className="text-sm text-white/90">
                          Select a patient to start consultation
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {selectedPatient && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleScheduleFollowUp()}
                      className="rounded-lg bg-white/20 p-2 text-white hover:bg-white/30"
                      title="Schedule Follow-up"
                    >
                      <MdSchedule className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handlePrescribeMedication()}
                      className="rounded-lg bg-white/20 p-2 text-white hover:bg-white/30"
                      title="Prescribe Medication"
                    >
                      <MdMedicalServices className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Container */}
            <div className="h-[400px] overflow-y-auto p-4">
              {selectedPatient ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <div className="flex items-center">
                      <FaStethoscope className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-blue-800 dark:text-blue-300">
                        Consultation started at {selectedPatient.startTime}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                      Patient reason: {selectedPatient.reason}
                    </p>
                  </div>

                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <MdMessage className="mb-4 h-16 w-16 text-gray-400" />
                  <h4 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
                    No Active Consultation
                  </h4>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    Select a patient from the waiting room to start a
                    consultation
                  </p>
                </div>
              )}
            </div>

            {/* Message Input and Actions */}
            {selectedPatient && (
              <>
                {/* Notes Input */}
                <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-3">
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                      Consultation Notes
                    </label>
                    <textarea
                      value={consultationNotes}
                      onChange={(e) => setConsultationNotes(e.target.value)}
                      placeholder="Add clinical notes, observations, and recommendations..."
                      className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-navy-600 dark:bg-navy-800"
                      rows="3"
                    />
                  </div>

                  <div className="flex items-center">
                    <button className="mr-3 rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300">
                      <MdAttachFile className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Type your message..."
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-navy-800"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="linear ml-3 flex items-center rounded-lg bg-brand-500 px-4 py-3 text-white hover:bg-brand-600"
                    >
                      <MdSend className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-navy-800">
                  <div className="flex justify-between">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`flex items-center rounded-lg px-4 py-2 ${
                        isRecording
                          ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20"
                          : "border border-gray-300 bg-white hover:bg-gray-50 dark:border-navy-600"
                      }`}
                    >
                      <MdNoteAdd className="mr-2 h-4 w-4" />
                      {isRecording ? "Stop Recording" : "Record Notes"}
                    </button>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleScheduleFollowUp()}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 dark:border-navy-600"
                      >
                        Schedule Follow-up
                      </button>
                      <button
                        onClick={() =>
                          handleEndConsultation(selectedPatient.id)
                        }
                        className="linear rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                      >
                        End Consultation
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderTelemedicine;
