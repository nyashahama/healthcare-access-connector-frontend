import React from "react";
import { MdEmail, MdPhone, MdLocationOn, MdPerson } from "react-icons/md";
import Card from "components/card";

const ContactInformation = () => {
  const contactInfo = {
    fullName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+27 72 123 4567",
    address: "123 Main St, Johannesburg, Gauteng",
    dateOfBirth: "15 March 1992",
    gender: "Female",
    language: "English, Zulu",
  };

  return (
    <Card extra={"w-full h-full p-6"}>
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          Contact Information
        </h4>
        <button className="text-sm font-medium text-brand-500 hover:text-brand-600">
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-start space-x-3">
          <MdPerson className="mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Full Name</p>
            <p className="font-medium text-navy-700 dark:text-white">
              {contactInfo.fullName}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MdEmail className="mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Email Address</p>
            <p className="font-medium text-navy-700 dark:text-white">
              {contactInfo.email}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MdPhone className="mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Phone Number</p>
            <p className="font-medium text-navy-700 dark:text-white">
              {contactInfo.phone}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MdLocationOn className="mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-medium text-navy-700 dark:text-white">
              {contactInfo.address}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="mt-1 h-5 w-5">
            <span className="text-gray-500">🎂</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date of Birth</p>
            <p className="font-medium text-navy-700 dark:text-white">
              {contactInfo.dateOfBirth}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="mt-1 h-5 w-5">
            <span className="text-gray-500">🌐</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Languages</p>
            <p className="font-medium text-navy-700 dark:text-white">
              {contactInfo.language}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-6 dark:border-navy-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-navy-700 dark:text-white">
              SMS Notification Preference
            </p>
            <p className="text-sm text-gray-600">
              You'll receive appointment reminders and health tips via SMS
            </p>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-green-600">Enabled</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContactInformation;
