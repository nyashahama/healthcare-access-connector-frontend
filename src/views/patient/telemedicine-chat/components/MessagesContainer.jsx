import React from "react";
import { FaStethoscope } from "react-icons/fa";
import MessageBubble from "./MessageBubble";

const TypingIndicator = ({ providerName }) => (
  <div className="flex justify-start">
    <div className="rounded-lg bg-gray-100 px-4 py-3 dark:bg-navy-700">
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {providerName || "Provider"} is typing
        </span>
        <span className="flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  </div>
);

const MessagesContainer = ({
  messages,
  messagesEndRef,
  providerTyping = false,
  providerName,
  isLoading = false,
}) => {
  return (
    <div className="h-[400px] overflow-y-auto p-4">
      {isLoading && messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-500" />
            <p className="text-sm text-gray-400">Loading messages…</p>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center">
          <FaStethoscope className="mb-4 h-12 w-12 text-gray-300" />
          <h4 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
            Start a Consultation
          </h4>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Connect with a healthcare provider to discuss symptoms, get advice,
            or follow up on treatment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {providerTyping && <TypingIndicator providerName={providerName} />}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessagesContainer;
