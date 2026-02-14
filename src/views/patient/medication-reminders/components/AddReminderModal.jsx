import React from "react";
import { MdAdd, MdAccessTime, MdCheckCircle, MdInfo } from "react-icons/md";
import { FaMobileAlt, FaBell } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Modal from "components/modal/Modal";

const AddReminderModal = ({
  isOpen,
  onClose,
  currentStep,
  steps,
  onNext,
  onBack,
  onConfirm,
}) => {
  const getStepIcon = (iconName) => {
    switch (iconName) {
      case "MdAdd":
        return MdAdd;
      case "MdAccessTime":
        return MdAccessTime;
      case "MdCheckCircle":
        return MdCheckCircle;
      default:
        return MdAdd;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
      <div className="space-y-6 py-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600">
            <MdAdd className="h-8 w-8 text-white" />
          </div>
          <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
            Add Medication Reminder
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            Set up a new medication schedule
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = getStepIcon(step.icon);
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-1 flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                        currentStep >= step.number
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-navy-800"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <MdCheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div
                        className={`text-xs font-semibold ${
                          currentStep >= step.number
                            ? "text-brand-500"
                            : "text-gray-400"
                        }`}
                      >
                        Step {step.number}
                      </div>
                      <div
                        className={`text-xs ${
                          currentStep >= step.number
                            ? "font-medium text-navy-700 dark:text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-4 h-0.5 flex-1 transition-all ${
                        currentStep > step.number
                          ? "bg-brand-500"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Medication Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Amoxicillin 250mg"
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Dosage *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 5ml or 1 tablet"
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Frequency *
                </label>
                <select className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800">
                  <option>Daily</option>
                  <option>Every 6 hours</option>
                  <option>Every 8 hours</option>
                  <option>Every 12 hours</option>
                  <option>Weekly</option>
                  <option>As needed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Instructions (Optional)
              </label>
              <textarea
                placeholder="Any special instructions..."
                className="h-24 w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Start Date *
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  End Date *
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Reminder Times *
              </label>
              <div className="space-y-2">
                {["08:00", "12:00", "16:00", "20:00"].map((time) => (
                  <label
                    key={time}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-gray-200 p-3 transition-colors hover:border-brand-300 dark:border-gray-700"
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <div className="flex-1 font-medium text-navy-700 dark:text-white">
                      {time}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Notification Method *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-green-300 bg-green-50 p-4 transition-all hover:border-green-500 dark:border-green-700 dark:bg-green-900/20">
                  <FaMobileAlt className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold">SMS</span>
                </button>
                <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-blue-300 bg-blue-50 p-4 transition-all hover:border-blue-500 dark:border-blue-700 dark:bg-blue-900/20">
                  <FaBell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold">Push</span>
                </button>
                <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-purple-300 bg-purple-50 p-4 transition-all hover:border-purple-500 dark:border-purple-700 dark:bg-purple-900/20">
                  <MdEmail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold">Email</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 p-4 dark:from-brand-900/20 dark:to-purple-900/20">
              <div className="text-center">
                <MdCheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h5 className="mt-2 font-bold text-navy-700 dark:text-white">
                  Review Your Reminder
                </h5>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Please review the details below
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Medication
                </span>
                <span className="font-semibold text-navy-700 dark:text-white">
                  Amoxicillin 250mg
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Dosage</span>
                <span className="font-semibold text-navy-700 dark:text-white">
                  5ml • Every 8 hours
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Schedule
                </span>
                <span className="font-semibold text-navy-700 dark:text-white">
                  08:00, 16:00, 00:00
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Duration
                </span>
                <span className="font-semibold text-navy-700 dark:text-white">
                  Jan 10 - Jan 20, 2024
                </span>
              </div>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-start gap-3">
                <MdInfo className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  You'll receive reminders via SMS 10 minutes before each
                  scheduled time.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {currentStep > 1 ? (
            <button
              onClick={onBack}
              className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
            >
              Cancel
            </button>
          )}
          {currentStep < 3 ? (
            <button
              onClick={onNext}
              className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-green-700 hover:shadow-lg"
            >
              Save Reminder
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddReminderModal;
