import React from "react";
import Modal from "components/modal/Modal";
import { IoMdCalendar, IoMdMedical } from "react-icons/io";
import { MdWarning, MdInfo } from "react-icons/md";

export const AppointmentReminderModal = ({
  isOpen,
  onClose,
  upcomingCount,
  appointments,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Appointment Reminders"
    size="md"
  >
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <IoMdCalendar className="h-8 w-8 text-blue-600 dark:text-blue-300" />
        </div>
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Upcoming Appointments
        </h4>
        <p className="text-gray-600 dark:text-gray-300">
          You have {upcomingCount} scheduled appointment
          {upcomingCount !== 1 ? "s" : ""}
        </p>
      </div>

      {appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">
                    {appointment.reason_for_visit || "Appointment"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(
                      appointment.appointment_datetime
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(
                      appointment.appointment_datetime
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {appointment.doctor_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {appointment.clinic_name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No upcoming appointments</p>
      )}

      <button
        onClick={() => (window.location.href = "/patient/appointments")}
        className="w-full rounded-lg bg-brand-500 py-2 text-sm font-medium text-white hover:bg-brand-600"
      >
        View All Appointments
      </button>
    </div>
  </Modal>
);

export const HealthScoreModal = ({ isOpen, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Health Score Details"
    size="md"
  >
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <IoMdMedical className="h-10 w-10 text-green-600 dark:text-green-300" />
        </div>
        <div className="text-4xl font-bold text-green-600">85/100</div>
        <p className="text-gray-600 dark:text-gray-300">Good Health Status</p>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <div className="mb-2 flex justify-between">
            <span className="font-medium">Physical Activity</span>
            <span className="text-green-600">90%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-green-200">
            <div className="h-full w-[90%] bg-green-500"></div>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="mb-2 flex justify-between">
            <span className="font-medium">Nutrition</span>
            <span className="text-blue-600">80%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-blue-200">
            <div className="h-full w-[80%] bg-blue-500"></div>
          </div>
        </div>

        <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
          <div className="mb-2 flex justify-between">
            <span className="font-medium">Sleep Quality</span>
            <span className="text-purple-600">85%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-purple-200">
            <div className="h-full w-[85%] bg-purple-500"></div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
        <div className="flex items-start">
          <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            Your health score is based on activity, nutrition, and sleep data.
            Keep up the good work!
          </p>
        </div>
      </div>
    </div>
  </Modal>
);

export const EmergencyContactsModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Emergency Contacts" size="md">
    <div className="space-y-4">
      <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <div className="flex items-start">
          <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-800 dark:text-red-300">
            For life-threatening emergencies, call immediately. Do not wait.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <a
          href="tel:10177"
          className="flex items-center justify-between rounded-lg border-2 border-red-300 bg-white p-4 transition-colors hover:bg-red-50 dark:border-red-700 dark:bg-navy-800 dark:hover:bg-red-900/20"
        >
          <div>
            <div className="font-bold text-red-700 dark:text-red-300">
              Ambulance
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Emergency medical services
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600">10177</div>
        </a>

        <a
          href="tel:10111"
          className="flex items-center justify-between rounded-lg border-2 border-gray-300 bg-white p-4 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:hover:bg-navy-700"
        >
          <div>
            <div className="font-bold">Police</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Law enforcement
            </div>
          </div>
          <div className="text-2xl font-bold">10111</div>
        </a>

        <a
          href="tel:0861555777"
          className="flex items-center justify-between rounded-lg border-2 border-gray-300 bg-white p-4 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:hover:bg-navy-700"
        >
          <div>
            <div className="font-bold">Poison Control</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Poisoning emergencies
            </div>
          </div>
          <div className="text-xl font-bold">0861 555 777</div>
        </a>

        <a
          href="tel:0800567567"
          className="flex items-center justify-between rounded-lg border-2 border-purple-300 bg-white p-4 transition-colors hover:bg-purple-50 dark:border-purple-700 dark:bg-navy-800 dark:hover:bg-purple-900/20"
        >
          <div>
            <div className="font-bold text-purple-700 dark:text-purple-300">
              Mental Health Crisis
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              24/7 support line
            </div>
          </div>
          <div className="text-xl font-bold text-purple-600">0800 567 567</div>
        </a>
      </div>
    </div>
  </Modal>
);

export const NutritionTipModal = ({ isOpen, onClose, tip, showToast }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={tip?.title || "Nutrition Tip"}
    size="md"
  >
    <div className="space-y-4">
      <p className="text-gray-700 dark:text-gray-300">
        {tip?.content || "No content available"}
      </p>

      <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
        <h5 className="mb-3 font-semibold text-orange-800 dark:text-orange-300">
          Daily Servings Guide
        </h5>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded bg-green-50 p-2 text-center dark:bg-green-900/20">
            <div className="font-bold text-green-700 dark:text-green-300">
              Fruits & Vegetables
            </div>
            <div>5 servings</div>
          </div>
          <div className="rounded bg-blue-50 p-2 text-center dark:bg-blue-900/20">
            <div className="font-bold text-blue-700 dark:text-blue-300">
              Dairy
            </div>
            <div>2-3 servings</div>
          </div>
          <div className="rounded bg-purple-50 p-2 text-center dark:bg-purple-900/20">
            <div className="font-bold text-purple-700 dark:text-purple-300">
              Protein
            </div>
            <div>2 servings</div>
          </div>
          <div className="rounded bg-yellow-50 p-2 text-center dark:bg-yellow-900/20">
            <div className="font-bold text-yellow-700 dark:text-yellow-300">
              Grains
            </div>
            <div>4-6 servings</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          window.location.href = "/patient/nutrition";
          showToast("Opening nutrition guide...", "info");
        }}
        className="w-full rounded-lg bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600"
      >
        View Full Nutrition Guide
      </button>
    </div>
  </Modal>
);
