import React, { useState, useEffect, useRef } from "react";
import Card from "components/card";
import { useToast } from "hooks/useToast";

// Component imports
import ChatHeader from "./components/ChatHeader";
import MessagesContainer from "./components/MessagesContainer";
import MessageInput from "./components/MessageInput";
import ProvidersList from "./components/ProvidersList";
import ConsultationNotes from "./components/ConsultationNotes";
import {
  QuickActionsCard,
  SMSAlternativeBanner,
} from "./components/SidebarComponents";
import {
  EndChatModal,
  VideoCallModal,
  AttachFileModal,
  RatingModal,
} from "./components/ChatModals";

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

  // Provider data
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

  // Handler functions
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

  const handleStartPhoneCall = () => {
    showToast("Initiating phone call...", "info");
    setTimeout(() => {
      const phoneMessage = {
        id: messages.length + 1,
        text: `Phone call started with ${activeProvider?.name}`,
        sender: "system",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, phoneMessage]);
      showToast("Phone call connected", "success");
    }, 1500);
  };

  const handleAttachFile = () => {
    setAttachModalOpen(true);
  };

  const handleFileSelect = (type) => {
    setAttachModalOpen(false);

    setTimeout(() => {
      const fileMessage = {
        id: messages.length + 1,
        text: `${type} attached: fever_photo.jpg`,
        sender: "user",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, fileMessage]);
      showToast(`${type} uploaded successfully`, "success");
    }, 500);
  };

  const handleBookFollowUp = () => {
    showToast("Redirecting to appointment booking...", "info");
    setTimeout(() => {
      window.location.href = "/patient/find-clinic";
    }, 1000);
  };

  const handleSubmitRating = (rating, feedback) => {
    setRateModalOpen(false);
    showToast(
      `Thank you for rating ${activeProvider?.name} ${rating} stars!`,
      "success"
    );
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
          Telemedicine Consultation
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Connect with healthcare providers instantly through secure chat or
          video
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card extra="overflow-hidden">
            <ChatHeader
              isConnected={isConnected}
              activeProvider={activeProvider}
              waitTime={waitTime}
              onStartVideoCall={handleStartVideoCall}
              onStartPhoneCall={handleStartPhoneCall}
            />

            <MessagesContainer
              messages={messages}
              messagesEndRef={messagesEndRef}
            />

            <MessageInput
              isConnected={isConnected}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={handleSendMessage}
              onAttachFile={handleAttachFile}
              onBookFollowUp={handleBookFollowUp}
              onEndChat={handleEndChat}
              onStartConsultation={() => handleConnectToProvider(providers[0])}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ProvidersList
            providers={providers}
            activeProvider={activeProvider}
            onConnectToProvider={handleConnectToProvider}
          />

          <ConsultationNotes />

          <QuickActionsCard />
        </div>
      </div>

      {/* SMS Alternative Notice */}
      <SMSAlternativeBanner />

      {/* Modals */}
      <EndChatModal
        isOpen={endChatModalOpen}
        onClose={() => setEndChatModalOpen(false)}
        onConfirm={confirmEndChat}
      />

      <VideoCallModal
        isOpen={videoCallModalOpen}
        onClose={() => setVideoCallModalOpen(false)}
        provider={activeProvider}
        onConfirm={confirmVideoCall}
      />

      <AttachFileModal
        isOpen={attachModalOpen}
        onClose={() => setAttachModalOpen(false)}
        onFileSelect={handleFileSelect}
      />

      <RatingModal
        isOpen={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        provider={activeProvider}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
};

export default TelemedicineChat;
