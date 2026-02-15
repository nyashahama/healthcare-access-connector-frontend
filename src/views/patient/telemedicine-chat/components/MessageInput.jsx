import React from "react";
import { MdSend, MdAttachFile } from "react-icons/md";

const MessageInput = ({
  isConnected,
  newMessage,
  setNewMessage,
  onSendMessage,
  onAttachFile,
  onBookFollowUp,
  onEndChat,
  onStartConsultation,
}) => {
  if (!isConnected) {
    return (
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Connect with a provider to start chatting
          </p>
          <button
            onClick={onStartConsultation}
            className="linear rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
          >
            Start Consultation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 p-4 dark:border-gray-700">
      <div className="flex items-center">
        <button
          onClick={onAttachFile}
          className="mr-3 rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300"
        >
          <MdAttachFile className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
          placeholder="Type your message here..."
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-navy-800"
        />
        <button
          onClick={onSendMessage}
          className="linear ml-3 flex items-center rounded-lg bg-brand-500 px-4 py-3 text-white hover:bg-brand-600"
        >
          <MdSend className="h-5 w-5" />
        </button>
      </div>

      {/* Chat Actions */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={onBookFollowUp}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600"
        >
          Book Follow-up Appointment
        </button>
        <button
          onClick={onEndChat}
          className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300"
        >
          End Chat
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
