import React from "react";
import Modal from "components/modal/Modal";
import { MdInfo, MdWarning } from "react-icons/md";

export const NewAppointmentModal = ({
  isOpen,
  onClose,
  appointment,
  onChange,
  onSubmit,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <h3 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
        New Appointment
      </h3>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Patient Name *
          </label>
          <input
            type="text"
            value={appointment.patient_name}
            onChange={(e) => onChange("patient_name", e.target.value)}
            className="w-full rounded-lg border p-2 dark:border-navy-600 dark:bg-navy-700"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Phone</label>
          <input
            type="tel"
            value={appointment.patient_phone}
            onChange={(e) => onChange("patient_phone", e.target.value)}
            className="w-full rounded-lg border p-2 dark:border-navy-600 dark:bg-navy-700"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={appointment.patient_email}
            onChange={(e) => onChange("patient_email", e.target.value)}
            className="w-full rounded-lg border p-2 dark:border-navy-600 dark:bg-navy-700"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Date *</label>
            <input
              type="date"
              value={appointment.appointment_date}
              onChange={(e) => onChange("appointment_date", e.target.value)}
              className="w-full rounded-lg border p-2 dark:border-navy-600 dark:bg-navy-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Time *</label>
            <input
              type="time"
              value={appointment.appointment_time}
              onChange={(e) => onChange("appointment_time", e.target.value)}
              className="w-full rounded-lg border p-2 dark:border-navy-600 dark:bg-navy-700"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Reason</label>
          <input
            type="text"
            value={appointment.reason_for_visit}
            onChange={(e) => onChange("reason_for_visit", e.target.value)}
            className="w-full rounded-lg border p-2 dark:border-navy-600 dark:bg-navy-700"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Notes</label>
          <textarea
            value={appointment.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            className="w-full rounded-lg border p-2 dark:border-navy-600 dark:bg-navy-700"
            rows="3"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
        >
          Book Appointment
        </button>
      </div>
    </div>
  </Modal>
);

export const RescheduleModal = ({
  isOpen,
  onClose,
  form,
  onChange,
  onSubmit,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <h3 className="mb-4 text-xl font-bold">Reschedule Appointment</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">New Date</label>
            <input
              type="date"
              value={form.appointment_date}
              onChange={(e) => onChange("appointment_date", e.target.value)}
              className="w-full rounded-lg border p-2 dark:border-navy-600 dark:bg-navy-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">New Time</label>
            <input
              type="time"
              value={form.appointment_time}
              onChange={(e) => onChange("appointment_time", e.target.value)}
              className="w-full rounded-lg border p-2 dark:border-navy-600 dark:bg-navy-700"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            className="w-full rounded-lg border p-2 dark:border-navy-600 dark:bg-navy-700"
            rows="3"
          />
        </div>
        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <div className="flex items-start">
            <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Patient will be notified of the new appointment time.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-lg bg-gray-200 px-4 py-2">
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="rounded-lg bg-brand-500 px-4 py-2 text-white"
        >
          Confirm
        </button>
      </div>
    </div>
  </Modal>
);

export const CancelModal = ({ isOpen, onClose, form, onChange, onSubmit }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <MdWarning className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-xl font-bold">Cancel Appointment</h3>
      </div>
      <p className="mb-4 text-gray-600">
        Are you sure you want to cancel this appointment?
      </p>
      <div>
        <label className="mb-2 block text-sm font-medium">
          Cancellation Reason
        </label>
        <textarea
          value={form.cancellation_reason}
          onChange={(e) => onChange("cancellation_reason", e.target.value)}
          className="w-full rounded-lg border p-2 dark:border-navy-600 dark:bg-navy-700"
          rows="3"
          placeholder="Please provide a reason..."
        />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-lg bg-gray-200 px-4 py-2">
          Keep Appointment
        </button>
        <button
          onClick={onSubmit}
          className="rounded-lg bg-red-500 px-4 py-2 text-white"
        >
          Cancel Appointment
        </button>
      </div>
    </div>
  </Modal>
);
