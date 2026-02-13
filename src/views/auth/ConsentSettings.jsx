import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Checkbox from "components/checkbox";
import { useToast } from "hooks/useToast";
import { useAuth } from "context/AuthContext";
import {
  FaShieldAlt,
  FaEnvelope,
  FaBell,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";

const ConsentSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [consentData, setConsentData] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    dataSharing: false,
    researchParticipation: false,
    marketingEmails: false,
    appointmentReminders: true,
    medicationReminders: true,
    emergencyAlerts: true,
    shareWithProviders: true,
  });

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { getConsent, user } = useAuth();

  const isMounted = useRef(true);

  useEffect(() => {
    fetchConsentSettings();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchConsentSettings = async () => {
    if (!user?._id) {
      showToast("User not found", "error");
      navigate("/auth/sign-in");
      return;
    }

    setIsLoading(true);

    try {
      const result = await getConsent(user._id);

      if (!isMounted.current) return;

      if (result.success) {
        setConsentData(result.data);
      } else {
        showToast(result.error || "Failed to load consent settings", "error");
      }
    } catch (error) {
      if (isMounted.current) {
        showToast("An unexpected error occurred", "error");
        console.error("Fetch consent error:", error);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const handleConsentChange = (e) => {
    const { name, checked } = e.target;
    setConsentData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSaveConsent = async () => {
    setIsLoading(true);

    try {
      // In a real app, you would call an API to save consent settings
      // For now, we'll simulate the save

      setTimeout(() => {
        if (!isMounted.current) return;

        showToast("Consent settings updated successfully!", "success");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      if (isMounted.current) {
        showToast("An unexpected error occurred", "error");
        console.error("Save consent error:", error);
        setIsLoading(false);
      }
    }
  };

  const consentGroups = [
    {
      title: "Communication Preferences",
      icon: <FaEnvelope className="text-blue-500" />,
      settings: [
        {
          id: "emailNotifications",
          label: "Email Notifications",
          description: "Receive important updates via email",
          icon: <FaEnvelope className="text-gray-400" />,
        },
        {
          id: "smsNotifications",
          label: "SMS Notifications",
          description: "Receive important updates via SMS",
          icon: <FaBell className="text-gray-400" />,
        },
        {
          id: "marketingEmails",
          label: "Marketing Emails",
          description: "Receive promotional offers and health tips",
          icon: <FaEnvelope className="text-gray-400" />,
        },
      ],
    },
    {
      title: "Reminders & Alerts",
      icon: <FaBell className="text-green-500" />,
      settings: [
        {
          id: "appointmentReminders",
          label: "Appointment Reminders",
          description: "Receive reminders for upcoming appointments",
          icon: <FaCalendarAlt className="text-gray-400" />,
        },
        {
          id: "medicationReminders",
          label: "Medication Reminders",
          description: "Receive reminders for medications",
          icon: <FaBell className="text-gray-400" />,
        },
        {
          id: "emergencyAlerts",
          label: "Emergency Alerts",
          description: "Receive emergency health alerts",
          icon: <FaShieldAlt className="text-gray-400" />,
        },
      ],
    },
    {
      title: "Data Sharing",
      icon: <FaUsers className="text-purple-500" />,
      settings: [
        {
          id: "dataSharing",
          label: "Share Health Data",
          description: "Allow sharing of anonymized health data for research",
          icon: <FaUsers className="text-gray-400" />,
        },
        {
          id: "researchParticipation",
          label: "Research Participation",
          description: "Participate in medical research studies",
          icon: <FaShieldAlt className="text-gray-400" />,
        },
        {
          id: "shareWithProviders",
          label: "Share with Healthcare Providers",
          description: "Allow sharing of medical records with your providers",
          icon: <FaUsers className="text-gray-400" />,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-navy-900 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center">
            <div className="mr-4 rounded-full bg-brand-500 p-3">
              <FaShieldAlt className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
                Consent Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Control how your data is used and what communications you
                receive
              </p>
            </div>
          </div>
        </div>

        {isLoading && !consentData.emailNotifications ? (
          <div className="flex items-center justify-center py-12">
            <div className="border-r-transparent h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500"></div>
          </div>
        ) : (
          <>
            {/* Consent Groups */}
            <div className="space-y-6">
              {consentGroups.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-800"
                >
                  <div className="mb-6 flex items-center">
                    <div className="mr-3">{group.icon}</div>
                    <h2 className="text-xl font-bold text-navy-700 dark:text-white">
                      {group.title}
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {group.settings.map((setting, settingIndex) => (
                      <div
                        key={settingIndex}
                        className="flex items-center justify-between border-b border-gray-100 pb-6 last:border-0 dark:border-gray-700"
                      >
                        <div className="flex items-start">
                          <div className="mr-4 mt-1">{setting.icon}</div>
                          <div>
                            <h3 className="font-medium text-navy-700 dark:text-white">
                              {setting.label}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                              {setting.description}
                            </p>
                          </div>
                        </div>
                        <div>
                          <Checkbox
                            checked={consentData[setting.id]}
                            onChange={handleConsentChange}
                            name={setting.id}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Important Notice */}
            <div className="mb-6 mt-8 rounded-2xl bg-blue-50 p-6 dark:bg-blue-900/20">
              <div className="flex items-start">
                <FaShieldAlt className="mr-3 mt-1 h-5 w-5 text-blue-500 dark:text-blue-300" />
                <div>
                  <h3 className="mb-2 font-bold text-blue-800 dark:text-blue-300">
                    Your Privacy Matters
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Your consent preferences help us provide better care while
                    respecting your privacy. You can change these settings at
                    any time. Emergency alerts will always be sent regardless of
                    your preferences to ensure your safety.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConsent}
                disabled={isLoading}
                className="rounded-lg bg-brand-500 px-6 py-3 text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Consent Settings"
                )}
              </button>
            </div>
          </>
        )}

        {/* Emergency Notice */}
        <div className="mt-8 rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex items-start">
            <FaShieldAlt className="mr-2 h-5 w-5 text-red-500 dark:text-red-300" />
            <div>
              <h4 className="text-sm font-bold text-red-800 dark:text-red-300">
                Medical Emergency?
              </h4>
              <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                Call <strong>10177</strong> or go to the nearest emergency room
                immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentSettings;
