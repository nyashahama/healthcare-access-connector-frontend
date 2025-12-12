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
} from "react-icons/md";
import { FaUserMd, FaUserInjured, FaStethoscope } from "react-icons/fa";
import Card from "components/card";

const ProviderTelemedicine = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [waitingRoom, setWaitingRoom] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [consultationNotes, setConsultationNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

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

    alert(`Consultation ended. Summary prepared for ${patient?.name}`);

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
    alert(`Medication prescribed for ${selectedPatient.name}`);
  };

  const handleScheduleFollowUp = () => {
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
    alert(`Follow-up scheduled for ${selectedPatient.name}`);
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
