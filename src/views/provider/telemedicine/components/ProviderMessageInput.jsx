import React from "react";
import { MdSend, MdAssignment, MdCallMade, MdScience } from "react-icons/md";

const ProviderMessageInput = ({
  isConsulting,
  newMessage,
  setNewMessage,
  onSendMessage,
  onIssuePrescription,
  onReferPatient,
  onOrderLab,
  onEndConsultation,
}) => {
  if (!isConsulting) {
    return (
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Accept a patient from the queue to begin messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 p-4 dark:border-gray-700">
      {/* Message input row */}
      <div className="flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
          placeholder="Type your clinical message..."
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-navy-800"
        />
        <button
          onClick={onSendMessage}
          className="linear ml-3 flex items-center rounded-lg bg-brand-500 px-4 py-3 text-white hover:bg-brand-600"
        >
          <MdSend className="h-5 w-5" />
        </button>
      </div>

      {/* Clinical Action Buttons */}
      <div className="mt-4 flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onIssuePrescription}
            className="flex items-center rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
          >
            <MdAssignment className="mr-1 h-4 w-4" />
            Prescribe
          </button>
          <button
            onClick={onReferPatient}
            className="flex items-center rounded-lg border border-purple-300 bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
          >
            <MdCallMade className="mr-1 h-4 w-4" />
            Refer
          </button>
          <button
            onClick={onOrderLab}
            className="flex items-center rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300"
          >
            <MdScience className="mr-1 h-4 w-4" />
            Order Labs
          </button>
        </div>
        <button
          onClick={onEndConsultation}
          className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300"
        >
          End Consultation
        </button>
      </div>
    </div>
  );
};

export default ProviderMessageInput;
