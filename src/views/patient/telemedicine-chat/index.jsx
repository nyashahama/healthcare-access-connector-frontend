import React, { useState, useEffect, useRef } from "react";
import {
  MdSend,
  MdAttachFile,
  MdVideoCall,
  MdPhone,
  MdPerson,
  MdSchedule,
  MdCheckCircle,
  MdWarning,
  MdInfo,
  MdCameraAlt,
} from "react-icons/md";
import { FaUserMd, FaStethoscope, FaRegClock } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const TelemedicineChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [waitTime, setWaitTime] = useState("5-10 minutes");
  const [activeProvider, setActiveProvider] = useState(null);
  const messagesEndRef = useRef(null);
  const { showToast } = useToast();

  // Modal states
  const [endChatModalOpen, setEndChatModalOpen] = useState(false);
  const [videoCallModalOpen, setVideoCallModalOpen] = useState(false);
  const [attachModalOpen, setAttachModalOpen] = useState(false);
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [attachment, setAttachment] = useState(null);

  const providers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Pediatrics",
      avatar: "👩‍⚕️",
      status: "available",
      rating: 4.8,
      responseTime: "2-5 min",
      fee: "R250",
    },
    {
      id: 2,
      name: "Nurse Lerato Molefe",
      specialty: "General Health",
      avatar: "👨‍⚕️",
      status: "available",
      rating: 4.5,
      responseTime: "1-3 min",
      fee: "R150",
    },
    {
      id: 3,
      name: "Dr. Michael Chen",
      specialty: "Family Medicine",
      avatar: "🧑‍⚕️",
      status: "busy",
      rating: 4.9,
      responseTime: "5-10 min",
      fee: "R300",
    },
  ];

  // Mock initial messages
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "Hello Sarah! I'm Dr. Johnson, how can I help you today?",
        sender: "provider",
        time: "10:00 AM",
        provider: "Dr. Sarah Johnson",
      },
      {
        id: 2,
        text: "Hi Doctor, my 5-year-old has had a fever since yesterday",
        sender: "user",
        time: "10:01 AM",
      },
      {
        id: 3,
        text: "I understand. Can you tell me more about the fever? What's the temperature and are there any other symptoms?",
        sender: "provider",
        time: "10:02 AM",
        provider: "Dr. Sarah Johnson",
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      showToast("Please enter a message", "warning");
      return;
    }

    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, message]);
    setNewMessage("");
    showToast("Message sent", "success");

    // Simulate provider response after delay
    setTimeout(() => {
      const responses = [
        "I see. Have you given any medication for the fever?",
        "How is their appetite and hydration?",
        "Let me provide some guidance on managing fever at home.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const providerMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "provider",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        provider: activeProvider?.name || "Healthcare Provider",
      };

      setMessages((prev) => [...prev, providerMessage]);
      showToast(`${activeProvider?.name || "Provider"} replied`, "info");
    }, 2000);
  };

  const handleConnectToProvider = (provider) => {
    setActiveProvider(provider);
    setIsConnected(true);
    setWaitTime("Connected");

    // Add connection message
    const connectionMessage = {
      id: messages.length + 1,
      text: `Connected to ${provider.name} (${provider.specialty})`,
      sender: "system",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([connectionMessage]);
    showToast(`Connected to ${provider.name}`, "success");
  };

  const handleEndChat = () => {
    setEndChatModalOpen(true);
  };

  const confirmEndChat = () => {
    setIsConnected(false);
    setActiveProvider(null);

    const endMessage = {
      id: messages.length + 1,
      text: "Chat ended. Thank you for using our telemedicine service.",
      sender: "system",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, endMessage]);
    setEndChatModalOpen(false);
    setRateModalOpen(true);
    showToast("Chat ended successfully", "info");
  };

  const handleStartVideoCall = () => {
    setVideoCallModalOpen(true);
  };

  const confirmVideoCall = () => {
    setVideoCallModalOpen(false);
    showToast("Video call initiated. Please allow camera access.", "info");

    // Simulate video call starting
    setTimeout(() => {
      const videoMessage = {
        id: messages.length + 1,
        text: `Video call started with ${activeProvider?.name}. Consultation fee: ${activeProvider?.fee}`,
        sender: "system",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, videoMessage]);
    }, 1000);
  };

  const handleAttachFile = () => {
    setAttachModalOpen(true);
  };

  const handleFileSelect = (type) => {
    setAttachment(type);

    // Simulate file upload
    setTimeout(() => {
      const fileMessage = {
        id: messages.length + 1,
        text: `${type} attached: fever_photo.jpg`,
        sender: "user",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        attachment: true,
      };
      setMessages([...messages, fileMessage]);
      setAttachModalOpen(false);
      showToast("File uploaded successfully", "success");
    }, 1500);
  };

  const handleRateConsultation = (rating) => {
    setRateModalOpen(false);
    showToast(`Thank you for your ${rating}-star rating!`, "success");
  };

  const handleBookFollowUp = () => {
    window.location.href = "/patient/find-clinic";
    showToast("Redirecting to appointment booking", "info");
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.sender === "user";
    const isSystem = message.sender === "system";

    if (isSystem) {
      return (
        <div className="my-4 flex justify-center">
          <div className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600 dark:bg-navy-700 dark:text-gray-300">
            {message.text}
          </div>
        </div>
      );
    }

    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[70%] rounded-2xl px-4 py-3 ${
            isUser ? "bg-brand-500 text-white" : "bg-gray-100 dark:bg-navy-700"
          }`}
        >
          {!isUser && message.provider && (
            <div className="mb-1 flex items-center">
              <span className="mr-2 text-sm font-medium text-brand-600 dark:text-brand-300">
                {message.provider}
              </span>
              <span className="text-xs text-gray-500">{message.time}</span>
            </div>
          )}
          <p
            className={
              isUser ? "text-white" : "text-gray-700 dark:text-gray-300"
            }
          >
            {message.text}
          </p>
          {message.attachment && (
            <div className="mt-2 rounded-lg bg-white/20 p-2">
              <div className="flex items-center text-sm">
                <MdAttachFile className="mr-2" />
                <span>fever_photo.jpg (2.4 MB)</span>
              </div>
            </div>
          )}
          {isUser && (
            <div className="mt-1 text-right text-xs opacity-70">
              {message.time}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {/* Modals */}
      {/* End Chat Confirmation Modal */}
      <Modal
        isOpen={endChatModalOpen}
        onClose={() => setEndChatModalOpen(false)}
        title="End Chat Session"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <MdWarning className="h-8 w-8 text-red-600 dark:text-red-300" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              End Chat with {activeProvider?.name}?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              This will end your current consultation. You can save the chat
              history for future reference.
            </p>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                The chat transcript will be saved to your medical records.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEndChatModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmEndChat}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
            >
              End Chat
            </button>
          </div>
        </div>
      </Modal>

      {/* Video Call Confirmation Modal */}
      <Modal
        isOpen={videoCallModalOpen}
        onClose={() => setVideoCallModalOpen(false)}
        title="Start Video Consultation"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <MdVideoCall className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Start Video Call with {activeProvider?.name}?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Consultation fee: {activeProvider?.fee}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <MdCameraAlt className="mr-3 h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium">Camera & Microphone Access</div>
                <div className="text-sm text-gray-500">
                  Required for video consultation
                </div>
              </div>
            </div>
            <div className="flex items-center rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <MdInfo className="mr-3 h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Secure Connection</div>
                <div className="text-sm text-gray-500">
                  End-to-end encrypted
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setVideoCallModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmVideoCall}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Start Video Call
            </button>
          </div>
        </div>
      </Modal>

      {/* Attach File Modal */}
      <Modal
        isOpen={attachModalOpen}
        onClose={() => setAttachModalOpen(false)}
        title="Attach File"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <MdAttachFile className="mx-auto mb-4 h-12 w-12 text-brand-500" />
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Share with Healthcare Provider
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Select the type of file you want to share
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleFileSelect("Photo")}
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                📷
              </div>
              <span className="font-medium">Photo</span>
              <span className="text-xs text-gray-500">
                Symptoms, rash, etc.
              </span>
            </button>
            <button
              onClick={() => handleFileSelect("Document")}
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                📄
              </div>
              <span className="font-medium">Document</span>
              <span className="text-xs text-gray-500">
                Lab results, prescriptions
              </span>
            </button>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Maximum file size: 10MB. Supported formats: JPG, PNG, PDF, DOC
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setAttachModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Rate Consultation Modal */}
      <Modal
        isOpen={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        title="Rate Your Consultation"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
              ⭐
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              How was your consultation?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Your feedback helps us improve our service
            </p>
          </div>

          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRateConsultation(star)}
                className="text-3xl hover:scale-110"
              >
                {star <= 4 ? "⭐" : "🌟"}
              </button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Tap a star to rate (1 = Poor, 5 = Excellent)
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setRateModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Skip Rating
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          Telemedicine Chat
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Connect with healthcare providers from the comfort of your home
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chat Container */}
        <div className="lg:col-span-2">
          <Card extra="p-0 overflow-hidden">
            {/* Chat Header */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-brand-500 to-brand-600 p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaUserMd className="mr-3 h-8 w-8 text-white" />
                  <div>
                    <h4 className="font-bold text-white">
                      {isConnected
                        ? `Chat with ${activeProvider?.name}`
                        : "Telemedicine Support"}
                    </h4>
                    <div className="flex items-center text-sm text-white/90">
                      {isConnected ? (
                        <>
                          <MdCheckCircle className="mr-1 h-4 w-4 text-green-300" />
                          <span>Connected</span>
                        </>
                      ) : (
                        <>
                          <FaRegClock className="mr-1 h-4 w-4" />
                          <span>Estimated wait: {waitTime}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {isConnected && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleStartVideoCall}
                      className="rounded-lg bg-white/20 p-2 text-white hover:bg-white/30"
                    >
                      <MdVideoCall className="h-5 w-5" />
                    </button>
                    <button className="rounded-lg bg-white/20 p-2 text-white hover:bg-white/30">
                      <MdPhone className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Container */}
            <div className="h-[400px] overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <FaStethoscope className="mb-4 h-12 w-12 text-gray-400" />
                  <h4 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
                    Start a Consultation
                  </h4>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    Connect with a healthcare provider to discuss symptoms, get
                    advice, or follow up on treatment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-700">
              {isConnected ? (
                <>
                  <div className="flex items-center">
                    <button
                      onClick={handleAttachFile}
                      className="mr-3 rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300"
                    >
                      <MdAttachFile className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Type your message here..."
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-navy-800"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="linear ml-3 flex items-center rounded-lg bg-brand-500 px-4 py-3 text-white hover:bg-brand-600"
                    >
                      <MdSend className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Chat Actions */}
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={handleBookFollowUp}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600"
                    >
                      Book Follow-up Appointment
                    </button>
                    <button
                      onClick={handleEndChat}
                      className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300"
                    >
                      End Chat
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    Connect with a provider to start chatting
                  </p>
                  <button
                    onClick={() => handleConnectToProvider(providers[0])}
                    className="linear rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
                  >
                    Start Consultation
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Available Providers */}
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Available Providers
            </h4>
            <div className="space-y-3">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all ${
                    provider.status === "available"
                      ? "hover:border-brand-300 hover:bg-brand-50 dark:hover:border-brand-700"
                      : "cursor-not-allowed opacity-50"
                  } ${
                    activeProvider?.id === provider.id
                      ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() =>
                    provider.status === "available" &&
                    handleConnectToProvider(provider)
                  }
                >
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-2xl dark:bg-navy-700">
                    {provider.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-navy-700 dark:text-white">
                        {provider.name}
                      </h5>
                      <div className="flex items-center">
                        <span className="text-xs font-bold text-green-600">
                          {provider.rating} ⭐
                        </span>
                        <span
                          className={`ml-2 h-2 w-2 rounded-full ${
                            provider.status === "available"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {provider.specialty}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                      <span>Response: {provider.responseTime}</span>
                      <span className="font-medium">{provider.fee}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Consultation Notes */}
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Consultation Notes
            </h4>
            <div className="space-y-3">
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <h5 className="font-medium text-blue-800 dark:text-blue-300">
                  Before Your Chat
                </h5>
                <ul className="mt-2 space-y-1 text-sm text-blue-600 dark:text-blue-400">
                  <li>• Have your symptoms ready to describe</li>
                  <li>• List any current medications</li>
                  <li>• Prepare any questions you have</li>
                </ul>
              </div>
              <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                <h5 className="font-medium text-green-800 dark:text-green-300">
                  What You Can Discuss
                </h5>
                <ul className="mt-2 space-y-1 text-sm text-green-600 dark:text-green-400">
                  <li>• Symptoms assessment</li>
                  <li>• Medication advice</li>
                  <li>• Follow-up care</li>
                  <li>• General health questions</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Quick Actions
            </h4>
            <div className="space-y-3">
              <button
                onClick={() =>
                  (window.location.href = "/patient/symptom-checker")
                }
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700"
              >
                <div className="flex items-center">
                  <FaStethoscope className="mr-3 text-brand-500" />
                  <span>Symptom Checker</span>
                </div>
                <span>→</span>
              </button>
              <button
                onClick={() => (window.location.href = "/patient/find-clinic")}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700"
              >
                <div className="flex items-center">
                  <MdSchedule className="mr-3 text-green-500" />
                  <span>Book Appointment</span>
                </div>
                <span>→</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* SMS Alternative Notice */}
      <div className="mt-6 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
        <div className="flex items-start">
          <MdPhone className="mr-3 mt-1 h-5 w-5 text-purple-600 dark:text-purple-400" />
          <div>
            <p className="text-sm text-purple-800 dark:text-purple-300">
              <strong>Phone Consultation Available:</strong> Prefer to speak on
              the phone? Text "CALLBACK" to 12345 to schedule a phone
              consultation with a nurse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemedicineChat;
