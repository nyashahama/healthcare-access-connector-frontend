import React from "react";
import Modal from "components/modal/Modal";
import {
  MdWarning,
  MdVideoCall,
  MdAttachFile,
  MdCameraAlt,
  MdInfo,
} from "react-icons/md";

export const EndChatModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <MdWarning className="text-2xl text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          End Consultation
        </h3>
      </div>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Are you sure you want to end this consultation? The chat history will be
        saved to your records.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
        >
          Continue Chat
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          End Consultation
        </button>
      </div>
    </div>
  </Modal>
);

export const VideoCallModal = ({ isOpen, onClose, provider, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <MdVideoCall className="text-2xl text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          Start Video Call
        </h3>
      </div>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Start a video consultation with{" "}
        <span className="font-medium">{provider?.name}</span>?
      </p>
      <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="flex items-start">
          <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium">Consultation Fee: {provider?.fee}</p>
            <p className="mt-1">
              Please ensure you have a stable internet connection and allow
              camera access.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          Start Video Call
        </button>
      </div>
    </div>
  </Modal>
);

export const AttachFileModal = ({ isOpen, onClose, onFileSelect }) => {
  const fileTypes = [
    {
      id: "photo",
      name: "Photo",
      icon: "📷",
      description: "Take or upload a photo",
    },
    {
      id: "document",
      name: "Document",
      icon: "📄",
      description: "Upload medical records",
    },
    {
      id: "lab",
      name: "Lab Results",
      icon: "🔬",
      description: "Share test results",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
            <MdAttachFile className="text-2xl text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white">
            Attach File
          </h3>
        </div>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Choose what you'd like to share with your healthcare provider:
        </p>
        <div className="grid gap-3">
          {fileTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onFileSelect(type.name)}
              className="flex items-center rounded-lg border border-gray-300 p-4 text-left transition-all hover:scale-[1.02] hover:border-brand-300 hover:bg-brand-50 dark:border-gray-600 dark:hover:bg-brand-900/20"
            >
              <span className="mr-4 text-3xl">{type.icon}</span>
              <div>
                <div className="font-medium text-navy-700 dark:text-white">
                  {type.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {type.description}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const RatingModal = ({ isOpen, onClose, provider, onSubmit }) => {
  const [rating, setRating] = React.useState(0);
  const [feedback, setFeedback] = React.useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">
          Rate Your Consultation
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          How was your experience with {provider?.name}?
        </p>
        <div className="mb-6 flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="text-3xl transition-all hover:scale-110"
            >
              {star <= rating ? "⭐" : "☆"}
            </button>
          ))}
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Additional Feedback (Optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            rows="4"
            placeholder="Share your experience..."
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
          >
            Skip
          </button>
          <button
            onClick={() => onSubmit(rating, feedback)}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            disabled={rating === 0}
          >
            Submit Rating
          </button>
        </div>
      </div>
    </Modal>
  );
};
