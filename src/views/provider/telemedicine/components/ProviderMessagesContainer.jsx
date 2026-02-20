import React from "react";
import { FaStethoscope } from "react-icons/fa";
import ProviderMessageBubble from "./ProviderMessageBubble";

const ProviderMessagesContainer = ({ messages, messagesEndRef }) => {
  return (
    <div className="h-[400px] overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center">
          <FaStethoscope className="mb-4 h-12 w-12 text-gray-400" />
          <h4 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
            No Active Consultation
          </h4>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Accept a patient from the queue to start a consultation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <ProviderMessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ProviderMessagesContainer;
