import React, { useState } from "react";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdPerson,
  MdEdit,
  MdSave,
} from "react-icons/md";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const ContactInformation = () => {
  const { showToast } = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    fullName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+27 72 123 4567",
    address: "123 Main St, Johannesburg, Gauteng",
    dateOfBirth: "15 March 1992",
    gender: "Female",
    language: "English, Zulu",
    smsNotifications: true,
  });

  const [editForm, setEditForm] = useState({ ...contactInfo });

  const handleEditClick = () => {
    setEditForm({ ...contactInfo });
    setEditModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const confirmEdit = () => {
    setContactInfo(editForm);
    setEditModalOpen(false);
    showToast("Contact information updated successfully!", "success");
  };

  const toggleSmsNotifications = () => {
    setContactInfo((prev) => ({
      ...prev,
      smsNotifications: !prev.smsNotifications,
    }));
    showToast(
      `SMS notifications ${
        !contactInfo.smsNotifications ? "enabled" : "disabled"
      }`,
      "info"
    );
  };

  return (
    <>
      {/* Edit Contact Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Contact Information"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name *
              </label>
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) => handleFormChange("fullName", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address *
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number *
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date of Birth
              </label>
              <input
                type="text"
                value={editForm.dateOfBirth}
                onChange={(e) =>
                  handleFormChange("dateOfBirth", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="DD Month YYYY"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Gender
              </label>
              <select
                value={editForm.gender}
                onChange={(e) => handleFormChange("gender", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Languages
              </label>
              <input
                type="text"
                value={editForm.language}
                onChange={(e) => handleFormChange("language", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Separate languages with commas"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Address *
              </label>
              <textarea
                value={editForm.address}
                onChange={(e) => handleFormChange("address", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                rows="3"
                placeholder="Enter full address"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmEdit}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              <MdSave className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      <Card extra={"w-full h-full p-6"}>
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Contact Information
          </h4>
          <button
            onClick={handleEditClick}
            className="flex items-center text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            <MdEdit className="mr-1 h-4 w-4" />
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
              <button
                onClick={toggleSmsNotifications}
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                {contactInfo.smsNotifications ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ContactInformation;
