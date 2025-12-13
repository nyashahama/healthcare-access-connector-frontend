import React, { useState } from "react";
import { FaPhone, FaUserFriends, FaExclamationTriangle } from "react-icons/fa";
import {
  MdEdit,
  MdAdd,
  MdDelete,
  MdPerson,
  MdCall,
  MdSave,
  MdWarning,
} from "react-icons/md";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const EmergencyContact = () => {
  const { showToast } = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [actionType, setActionType] = useState("");

  const [emergencyContacts, setEmergencyContacts] = useState([
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
  ]);

  const [contactForm, setContactForm] = useState({
    name: "",
    relationship: "",
    phone: "",
    isPrimary: false,
  });

  const emergencyServices = [
    { name: "Ambulance", number: "10177" },
    { name: "Police", number: "10111" },
    { name: "Poison Control", number: "0861 555 777" },
    { name: "Mental Health Crisis", number: "0800 567 567" },
  ];

  const handleEditClick = (contact) => {
    setSelectedContact(contact);
    setContactForm({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      isPrimary: contact.isPrimary,
    });
    setActionType("edit");
    setEditModalOpen(true);
  };

  const handleAddClick = () => {
    setContactForm({
      name: "",
      relationship: "",
      phone: "",
      isPrimary: false,
    });
    setActionType("add");
    setAddModalOpen(true);
  };

  const handleDeleteClick = (contact) => {
    setSelectedContact(contact);
    setDeleteModalOpen(true);
  };

  const handleCallClick = (contact) => {
    setSelectedContact(contact);
    setCallModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setContactForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const confirmSave = () => {
    if (actionType === "edit") {
      setEmergencyContacts((prev) =>
        prev.map((contact) =>
          contact.id === selectedContact.id
            ? { ...contact, ...contactForm }
            : contact
        )
      );
      showToast(`${contactForm.name} updated successfully!`, "success");
    } else {
      const newContact = {
        id: Date.now(),
        ...contactForm,
      };
      setEmergencyContacts((prev) => [...prev, newContact]);
      showToast(`${contactForm.name} added as emergency contact!`, "success");
    }

    setEditModalOpen(false);
    setAddModalOpen(false);
  };

  const confirmDelete = () => {
    setEmergencyContacts((prev) =>
      prev.filter((contact) => contact.id !== selectedContact.id)
    );
    setDeleteModalOpen(false);
    showToast(
      `${selectedContact.name} removed from emergency contacts`,
      "error"
    );
  };

  const confirmCall = () => {
    // In a real app, this would initiate a call
    console.log(`Calling ${selectedContact.name} at ${selectedContact.phone}`);
    setCallModalOpen(false);
    showToast(`Calling ${selectedContact.name}...`, "info");
  };

  const setPrimaryContact = (id) => {
    setEmergencyContacts((prev) =>
      prev.map((contact) => ({
        ...contact,
        isPrimary: contact.id === id,
      }))
    );
    const contact = emergencyContacts.find((c) => c.id === id);
    showToast(`${contact.name} set as primary emergency contact`, "success");
  };

  return (
    <>
      {/* Edit Contact Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Emergency Contact"
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name *
              </label>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Relationship *
              </label>
              <select
                value={contactForm.relationship}
                onChange={(e) =>
                  handleFormChange("relationship", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="">Select relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
                <option value="Doctor">Doctor</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number *
              </label>
              <input
                type="tel"
                value={contactForm.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter phone number"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrimary"
                checked={contactForm.isPrimary}
                onChange={(e) =>
                  handleFormChange("isPrimary", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <label
                htmlFor="isPrimary"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Set as primary emergency contact
              </label>
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
              onClick={confirmSave}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              <MdSave className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Contact Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Emergency Contact"
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name *
              </label>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Relationship *
              </label>
              <select
                value={contactForm.relationship}
                onChange={(e) =>
                  handleFormChange("relationship", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="">Select relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
                <option value="Doctor">Doctor</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number *
              </label>
              <input
                type="tel"
                value={contactForm.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter phone number"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrimaryAdd"
                checked={contactForm.isPrimary}
                onChange={(e) =>
                  handleFormChange("isPrimary", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <label
                htmlFor="isPrimaryAdd"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Set as primary emergency contact
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setAddModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmSave}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              <MdAdd className="h-5 w-5" />
              Add Contact
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Emergency Contact"
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
              <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Remove "{selectedContact?.name}"?
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                This contact will no longer be able to access your medical
                information in emergencies.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
            >
              Remove Contact
            </button>
          </div>
        </div>
      </Modal>

      {/* Call Confirmation Modal */}
      <Modal
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        title="Call Emergency Contact"
        size="sm"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <MdCall className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Call {selectedContact?.name}?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              {selectedContact?.phone}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Relationship: {selectedContact?.relationship}
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setCallModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmCall}
              className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
            >
              <MdCall className="h-5 w-5" />
              Call Now
            </button>
          </div>
        </div>
      </Modal>

      <Card extra={"w-full h-full p-6"}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <FaExclamationTriangle className="mr-2 text-red-500" />
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              Emergency Contacts
            </h4>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            <MdEdit className="mr-1 h-4 w-4" />
            Manage
          </button>
        </div>

        {/* Personal Emergency Contacts */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h5 className="font-bold text-navy-700 dark:text-white">
              <FaUserFriends className="mr-2 inline text-brand-500" />
              My Emergency Contacts
            </h5>
            <button
              onClick={handleAddClick}
              className="flex items-center rounded-lg bg-brand-50 px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300"
            >
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
                      {contact.isPrimary ? (
                        <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-800 dark:bg-red-800 dark:text-red-300">
                          PRIMARY
                        </span>
                      ) : (
                        <button
                          onClick={() => setPrimaryContact(contact.id)}
                          className="ml-2 text-xs text-gray-500 hover:text-brand-600"
                        >
                          Set as primary
                        </button>
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
                    <div className="mt-1 flex gap-2">
                      <button
                        onClick={() => handleCallClick(contact)}
                        className="text-xs text-green-600 hover:text-green-700"
                      >
                        Call Now
                      </button>
                      <button
                        onClick={() => handleEditClick(contact)}
                        className="text-xs text-brand-500 hover:text-brand-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(contact)}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
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
                Emergency contacts can access your medical information in case
                of emergencies
              </p>
              <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                Last updated by Dr. Smith on 15 March 2024
              </p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default EmergencyContact;
