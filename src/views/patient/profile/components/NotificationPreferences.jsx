import React from "react";
import { FaBell, FaSms, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import Card from "components/card";
import Switch from "components/switch";

const NotificationPreferences = () => {
  return (
    <Card extra={"w-full h-full p-6"}>
      <div className="mb-6 flex items-center">
        <FaBell className="mr-3 text-brand-500" />
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          Notification Preferences
        </h4>
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
              <Switch id="sms-appointments" defaultChecked={true} />
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
              <Switch id="sms-health-tips" defaultChecked={true} />
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
              <Switch id="sms-medication" defaultChecked={false} />
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
              <Switch id="email-summaries" defaultChecked={true} />
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
              <Switch id="email-reports" defaultChecked={false} />
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
              <Switch id="email-newsletter" defaultChecked={true} />
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
              <select className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-navy-600 dark:bg-navy-700">
                <option>2 hours before</option>
                <option>1 day before</option>
                <option>2 days before</option>
              </select>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-gray-600">
                Language for Notifications
              </p>
              <select className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-navy-600 dark:bg-navy-700">
                <option>English</option>
                <option>Zulu</option>
                <option>Afrikaans</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600">
          Save Preferences
        </button>
      </div>
    </Card>
  );
};

export default NotificationPreferences;
