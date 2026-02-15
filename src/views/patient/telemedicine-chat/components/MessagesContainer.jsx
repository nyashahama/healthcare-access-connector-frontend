import React from "react";
import { FaStethoscope } from "react-icons/fa";
import MessageBubble from "./MessageBubble";

const MessagesContainer = ({ messages, messagesEndRef }) => {
  return (
    <div className="h-[400px] overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center">
          <FaStethoscope className="mb-4 h-12 w-12 text-gray-400" />
          <h4 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
            Start a Consultation
          </h4>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Connect with a healthcare provider to discuss symptoms, get advice,
            or follow up on treatment.
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
  );
};

export default MessagesContainer;
