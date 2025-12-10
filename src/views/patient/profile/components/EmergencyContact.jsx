import React from "react";
import { FaPhone, FaUserFriends, FaExclamationTriangle } from "react-icons/fa";
import { MdEdit, MdAdd } from "react-icons/md";
import Card from "components/card";

const EmergencyContact = () => {
  const emergencyContacts = [
    {
      id: 1,
      name: "John Johnson",
      relationship: "Husband",
      phone: "+27 72 987 6543",
      isPrimary: true,
    },
    {
      id: 2,
      name: "Mary Smith",
      relationship: "Sister",
      phone: "+27 82 456 7890",
      isPrimary: false,
    },
    {
      id: 3,
      name: "Dr. Michael Smith",
      relationship: "Family Doctor",
      phone: "+27 11 123 4567",
      isPrimary: false,
    },
  ];

  const emergencyServices = [
    { name: "Ambulance", number: "10177" },
    { name: "Police", number: "10111" },
    { name: "Poison Control", number: "0861 555 777" },
    { name: "Mental Health Crisis", number: "0800 567 567" },
  ];

  return (
    <Card extra={"w-full h-full p-6"}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <FaExclamationTriangle className="mr-2 text-red-500" />
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Emergency Contacts
          </h4>
        </div>
        <button className="flex items-center text-sm font-medium text-brand-500 hover:text-brand-600">
          <MdEdit className="mr-1" />
          Edit
        </button>
      </div>

      {/* Personal Emergency Contacts */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h5 className="font-bold text-navy-700 dark:text-white">
            <FaUserFriends className="mr-2 inline text-brand-500" />
            My Emergency Contacts
          </h5>
          <button className="flex items-center rounded-lg bg-brand-50 px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300">
            <MdAdd className="mr-1" />
            Add Contact
          </button>
        </div>

        <div className="space-y-3">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className={`rounded-lg border p-3 ${
                contact.isPrimary
                  ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                  : "border-gray-200 bg-white dark:border-navy-600 dark:bg-navy-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <p className="font-bold text-navy-700 dark:text-white">
                      {contact.name}
                    </p>
                    {contact.isPrimary && (
                      <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-800 dark:bg-red-800 dark:text-red-300">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {contact.relationship}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-navy-700 dark:text-white">
                    {contact.phone}
                  </p>
                  <button className="mt-1 text-xs text-brand-500 hover:text-brand-600">
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Services */}
      <div>
        <h5 className="mb-4 font-bold text-navy-700 dark:text-white">
          <FaPhone className="mr-2 inline text-red-500" />
          Emergency Services
        </h5>
        <div className="space-y-2">
          {emergencyServices.map((service, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 hover:bg-gray-100 dark:bg-navy-700 dark:hover:bg-navy-600"
            >
              <span className="font-medium text-navy-700 dark:text-white">
                {service.name}
              </span>
              <span className="font-bold text-red-600 dark:text-red-400">
                {service.number}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Information Note */}
      <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <div className="flex items-start">
          <div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800">
            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
              !
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              Emergency contacts can access your medical information in case of
              emergencies
            </p>
            <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
              Last updated by Dr. Smith on 15 March 2024
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmergencyContact;
