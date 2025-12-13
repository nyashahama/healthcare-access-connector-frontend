import React, { useState } from "react";
import { FaBaby, FaCalendarAlt, FaHeartbeat } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import {
  MdEdit,
  MdAdd,
  MdDelete,
  MdSave,
  MdWarning,
  MdInfo,
} from "react-icons/md";

const MyChildren = () => {
  const { showToast } = useToast();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [actionType, setActionType] = useState("");

  const [children, setChildren] = useState([
    {
      id: 1,
      name: "Emily Johnson",
      age: "5 years",
      gender: "Female",
      dateOfBirth: "2019-05-15",
      lastCheckup: "2 weeks ago",
      nextAppointment: "Next month",
      healthStatus: "Good",
      vaccinations: ["6-week", "10-week", "14-week", "9 months"],
      upcomingVaccination: "6-year shots in July 2024",
    },
    {
      id: 2,
      name: "James Johnson",
      age: "2 years",
      gender: "Male",
      dateOfBirth: "2022-03-10",
      lastCheckup: "1 month ago",
      nextAppointment: "In 3 months",
      healthStatus: "Excellent",
      vaccinations: ["6-week", "10-week", "14-week", "9 months", "18 months"],
      upcomingVaccination: "6-year shots in March 2028",
    },
  ]);

  const [childForm, setChildForm] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    healthStatus: "Good",
  });

  const [appointmentForm, setAppointmentForm] = useState({
    type: "Regular Check-up",
    date: "",
    time: "",
    notes: "",
  });

  const handleAddClick = () => {
    setChildForm({
      name: "",
      dateOfBirth: "",
      gender: "",
      healthStatus: "Good",
    });
    setActionType("add");
    setAddModalOpen(true);
  };

  const handleEditClick = (child) => {
    setSelectedChild(child);
    setChildForm({
      name: child.name,
      dateOfBirth: child.dateOfBirth,
      gender: child.gender,
      healthStatus: child.healthStatus,
    });
    setActionType("edit");
    setEditModalOpen(true);
  };

  const handleDeleteClick = (child) => {
    setSelectedChild(child);
    setDeleteModalOpen(true);
  };

  const handleBookClick = (child) => {
    setSelectedChild(child);
    setAppointmentForm({
      type: "Regular Check-up",
      date: "",
      time: "",
      notes: "",
    });
    setBookModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setChildForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAppointmentFormChange = (field, value) => {
    setAppointmentForm((prev) => ({ ...prev, [field]: value }));
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }

    if (years < 1) {
      const totalMonths =
        (today.getFullYear() - birthDate.getFullYear()) * 12 + months;
      return totalMonths > 0 ? `${totalMonths} months` : "Newborn";
    }

    return `${years} year${years > 1 ? "s" : ""}`;
  };

  const confirmSave = () => {
    if (actionType === "add") {
      const newChild = {
        id: Date.now(),
        ...childForm,
        age: calculateAge(childForm.dateOfBirth),
        lastCheckup: "Never",
        nextAppointment: "Not scheduled",
        vaccinations: ["6-week"],
        upcomingVaccination: "Next due: 10-week shots",
      };
      setChildren((prev) => [...prev, newChild]);
      setAddModalOpen(false);
      showToast(`${childForm.name} added successfully!`, "success");
    } else {
      setChildren((prev) =>
        prev.map((child) =>
          child.id === selectedChild.id
            ? {
                ...child,
                ...childForm,
                age: calculateAge(childForm.dateOfBirth),
              }
            : child
        )
      );
      setEditModalOpen(false);
      showToast(`${childForm.name}'s information updated!`, "success");
    }
  };

  const confirmDelete = () => {
    setChildren((prev) =>
      prev.filter((child) => child.id !== selectedChild.id)
    );
    setDeleteModalOpen(false);
    showToast(`${selectedChild.name} removed from dependents`, "error");
  };

  const confirmBookAppointment = () => {
    // In a real app, this would create an appointment
    setBookModalOpen(false);
    showToast(`Appointment booked for ${selectedChild.name}!`, "success");
  };

  return (
    <>
      {/* Add Child Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Child"
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
                value={childForm.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter child's full name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date of Birth *
              </label>
              <input
                type="date"
                value={childForm.dateOfBirth}
                onChange={(e) =>
                  handleFormChange("dateOfBirth", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Gender *
              </label>
              <select
                value={childForm.gender}
                onChange={(e) => handleFormChange("gender", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Health Status
              </label>
              <select
                value={childForm.healthStatus}
                onChange={(e) =>
                  handleFormChange("healthStatus", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                After adding your child, you can schedule vaccinations and
                check-ups.
              </p>
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
              Add Child
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Child Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Child Information"
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
                value={childForm.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter child's full name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date of Birth *
              </label>
              <input
                type="date"
                value={childForm.dateOfBirth}
                onChange={(e) =>
                  handleFormChange("dateOfBirth", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Gender *
              </label>
              <select
                value={childForm.gender}
                onChange={(e) => handleFormChange("gender", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Health Status
              </label>
              <select
                value={childForm.healthStatus}
                onChange={(e) =>
                  handleFormChange("healthStatus", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
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

      {/* Book Appointment Modal */}
      <Modal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        title={`Book Appointment for ${selectedChild?.name}`}
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Appointment Type *
              </label>
              <select
                value={appointmentForm.type}
                onChange={(e) =>
                  handleAppointmentFormChange("type", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="Regular Check-up">Regular Check-up</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Sick Visit">Sick Visit</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Specialist Consultation">
                  Specialist Consultation
                </option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Preferred Date *
              </label>
              <input
                type="date"
                value={appointmentForm.date}
                onChange={(e) =>
                  handleAppointmentFormChange("date", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Preferred Time *
              </label>
              <select
                value={appointmentForm.time}
                onChange={(e) =>
                  handleAppointmentFormChange("time", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="">Select time</option>
                <option value="08:00">08:00 AM</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes (Optional)
              </label>
              <textarea
                value={appointmentForm.notes}
                onChange={(e) =>
                  handleAppointmentFormChange("notes", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                rows="2"
                placeholder="Any specific concerns or notes..."
              />
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700 dark:text-green-300">
                You'll receive a confirmation SMS within 24 hours.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setBookModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmBookAppointment}
              className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Child"
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
              <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Remove "{selectedChild?.name}"?
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                This child's health information will be removed from your
                profile.
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
              Remove Child
            </button>
          </div>
        </div>
      </Modal>

      <Card extra={"w-full h-full p-6"}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              My Children
            </h4>
            <p className="mt-1 text-sm text-gray-600">
              Manage health information for your dependents
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300"
          >
            <MdAdd className="mr-1" />
            Add Child
          </button>
        </div>

        <div className="space-y-4">
          {children.map((child) => (
            <div
              key={child.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 p-4 hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700"
            >
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
                  <FaBaby className="text-xl text-pink-600 dark:text-pink-400" />
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <h5 className="font-bold text-navy-700 dark:text-white">
                      {child.name}
                    </h5>
                    <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {child.age}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-600">
                    <span>{child.gender}</span>
                    <span className="text-gray-400">•</span>
                    <span className="flex items-center">
                      <FaHeartbeat className="mr-1 text-green-500" />
                      {child.healthStatus}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-1 text-brand-500" />
                      Last: {child.lastCheckup}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Next vaccination: {child.upcomingVaccination}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBookClick(child)}
                  className="rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300"
                >
                  Book Check-up
                </button>
                <button
                  onClick={() => handleEditClick(child)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-navy-600"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => handleDeleteClick(child)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-start">
            <div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                !
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Ensure your child's vaccination records are up to date
              </p>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                Next vaccination due: {children[0]?.upcomingVaccination}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default MyChildren;
