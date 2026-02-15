import React from "react";

const EmergencyContactsCard = ({ onClick }) => {
  const contacts = [
    { label: "Ambulance", number: "10177" },
    { label: "Police", number: "10111" },
    { label: "Poison Control", number: "0861 555 777" },
    { label: "Mental Health Crisis", number: "0800 567 567" },
  ];

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-[20px] border border-red-200 bg-red-50 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-red-300 dark:border-red-800 dark:bg-red-900/20"
    >
      <h5 className="mb-3 text-lg font-bold text-red-700 dark:text-red-300">
        🚨 Emergency Contacts
      </h5>
      <ul className="space-y-2">
        {contacts.map((contact, index) => (
          <li key={index} className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">
              {contact.label}
            </span>
            <span className="font-bold">{contact.number}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmergencyContactsCard;
