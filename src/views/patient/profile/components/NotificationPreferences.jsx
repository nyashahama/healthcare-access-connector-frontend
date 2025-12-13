import React, { useState } from "react";
import { FaBell, FaSms, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import Switch from "components/switch";
import { MdSave, MdInfo } from "react-icons/md";

const NotificationPreferences = () => {
  const { showToast } = useToast();
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);

  const [preferences, setPreferences] = useState({
    sms: {
      appointments: true,
      healthTips: true,
      medication: false,
    },
    email: {
      summaries: true,
      reports: false,
      newsletter: true,
    },
    appointment: {
      reminderTime: "2 hours before",
      language: "English",
    },
  });

  const [testForm, setTestForm] = useState({
    type: "sms",
    message: "",
  });

  const handleToggle = (category, setting) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting],
      },
    }));
  };

  const handleAppointmentChange = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      appointment: {
        ...prev.appointment,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    setSaveModalOpen(true);
  };

  const confirmSave = () => {
    setSaveModalOpen(false);
    showToast("Notification preferences saved successfully!", "success");
  };

  const handleTestNotification = () => {
    setTestForm({
      type: "sms",
      message: "",
    });
    setTestModalOpen(true);
  };

  const confirmTest = () => {
    setTestModalOpen(false);
    showToast("Test notification sent successfully!", "info");
  };

  const handleFormChange = (field, value) => {
    setTestForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Save Confirmation Modal */}
      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save Preferences"
        size="sm"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <MdSave className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Save Changes?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your notification preferences will be updated.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSaveModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmSave}
              className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
            >
              <MdSave className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Test Notification Modal */}
      <Modal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        title="Send Test Notification"
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notification Type
              </label>
              <select
                value={testForm.type}
                onChange={(e) => handleFormChange("type", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="sms">SMS Notification</option>
                <option value="email">Email Notification</option>
                <option value="push">Push Notification</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Test Message
              </label>
              <textarea
                value={testForm.message}
                onChange={(e) => handleFormChange("message", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                rows="3"
                placeholder="Enter test message or leave empty for default..."
              />
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                A test notification will be sent to verify your preferences are
                working correctly.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setTestModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmTest}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Send Test
            </button>
          </div>
        </div>
      </Modal>

      <Card extra={"w-full h-full p-6"}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <FaBell className="mr-3 text-brand-500" />
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              Notification Preferences
            </h4>
          </div>
          <button
            onClick={handleTestNotification}
            className="text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            Send Test
          </button>
        </div>

        <div className="space-y-6">
          {/* SMS Notifications */}
          <div>
            <div className="mb-3 flex items-center">
              <FaSms className="mr-2 text-green-500" />
              <h5 className="font-bold text-navy-700 dark:text-white">
                SMS Notifications
              </h5>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-navy-700 dark:text-white">
                    Appointment Reminders
                  </p>
                  <p className="text-sm text-gray-600">
                    Receive reminders 48h and 2h before appointments
                  </p>
                </div>
                <Switch
                  id="sms-appointments"
                  checked={preferences.sms.appointments}
                  onChange={() => handleToggle("sms", "appointments")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-navy-700 dark:text-white">
                    Health Tips & Updates
                  </p>
                  <p className="text-sm text-gray-600">
                    Weekly health tips and clinic updates
                  </p>
                </div>
                <Switch
                  id="sms-health-tips"
                  checked={preferences.sms.healthTips}
                  onChange={() => handleToggle("sms", "healthTips")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-navy-700 dark:text-white">
                    Medication Reminders
                  </p>
                  <p className="text-sm text-gray-600">
                    Daily reminders for chronic medications
                  </p>
                </div>
                <Switch
                  id="sms-medication"
                  checked={preferences.sms.medication}
                  onChange={() => handleToggle("sms", "medication")}
                />
              </div>
            </div>
          </div>

          {/* Email Notifications */}
          <div>
            <div className="mb-3 flex items-center">
              <FaEnvelope className="mr-2 text-blue-500" />
              <h5 className="font-bold text-navy-700 dark:text-white">
                Email Notifications
              </h5>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-navy-700 dark:text-white">
                    Consultation Summaries
                  </p>
                  <p className="text-sm text-gray-600">
                    After-visit summaries and recommendations
                  </p>
                </div>
                <Switch
                  id="email-summaries"
                  checked={preferences.email.summaries}
                  onChange={() => handleToggle("email", "summaries")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-navy-700 dark:text-white">
                    Health Reports
                  </p>
                  <p className="text-sm text-gray-600">
                    Monthly health reports and insights
                  </p>
                </div>
                <Switch
                  id="email-reports"
                  checked={preferences.email.reports}
                  onChange={() => handleToggle("email", "reports")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-navy-700 dark:text-white">
                    Newsletter
                  </p>
                  <p className="text-sm text-gray-600">
                    HealthConnect monthly newsletter
                  </p>
                </div>
                <Switch
                  id="email-newsletter"
                  checked={preferences.email.newsletter}
                  onChange={() => handleToggle("email", "newsletter")}
                />
              </div>
            </div>
          </div>

          {/* Appointment Preferences */}
          <div>
            <div className="mb-3 flex items-center">
              <FaCalendarAlt className="mr-2 text-purple-500" />
              <h5 className="font-bold text-navy-700 dark:text-white">
                Appointment Preferences
              </h5>
            </div>
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Preferred Reminder Time
                </p>
                <select
                  value={preferences.appointment.reminderTime}
                  onChange={(e) =>
                    handleAppointmentChange("reminderTime", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-navy-600 dark:bg-navy-700"
                >
                  <option>2 hours before</option>
                  <option>1 day before</option>
                  <option>2 days before</option>
                  <option>1 week before</option>
                </select>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Language for Notifications
                </p>
                <select
                  value={preferences.appointment.language}
                  onChange={(e) =>
                    handleAppointmentChange("language", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-navy-600 dark:bg-navy-700"
                >
                  <option>English</option>
                  <option>Zulu</option>
                  <option>Afrikaans</option>
                  <option>Sesotho</option>
                  <option>isiXhosa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600"
          >
            Save Preferences
          </button>
        </div>
      </Card>
    </>
  );
};

export default NotificationPreferences;
