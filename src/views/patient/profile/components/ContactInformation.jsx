import React, { useState, useEffect } from "react";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdPerson,
  MdEdit,
  MdSave,
  MdCake,
  MdLanguage,
} from "react-icons/md";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import { usePatient } from "hooks/usePatient";
import { useAuth } from "context/AuthContext";

const ContactInformation = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const {
    patient,
    loading: patientLoading,
    updatePatientProfile,
    getCurrentPatientProfile,
  } = usePatient();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize with empty/null values instead of other user's data
  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    language: "",
    smsNotifications: true,
  });

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    language: "",
  });

  // Load patient data on component mount
  useEffect(() => {
    const loadPatientData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getCurrentPatientProfile();

        if (result.success && result.data) {
          // Map patient data to contact info format
          const patientData = result.data;
          const newContactInfo = {
            fullName:
              `${patientData.first_name || ""} ${
                patientData.last_name || ""
              }`.trim() || "",
            email: patientData.email || user.email || "",
            phone: patientData.phone || user.phone || "",
            address: patientData.primary_address || "",
            dateOfBirth: patientData.date_of_birth
              ? formatDate(patientData.date_of_birth)
              : "",
            gender: patientData.gender || "",
            language:
              patientData.home_language ||
              patientData.language_preferences?.join(", ") ||
              "",
            smsNotifications:
              patientData.sms_notifications !== undefined
                ? patientData.sms_notifications
                : true,
          };
          setContactInfo(newContactInfo);
        } else {
          setError("Failed to load patient data. Please try again.");
        }
      } catch (error) {
        console.error("Error loading patient data:", error);
        setError("An error occurred while loading your information.");
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();
  }, [user, getCurrentPatientProfile]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Parse date for form input
  const parseDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (error) {
      return "";
    }
  };

  const handleEditClick = () => {
    // Split full name into first and last
    const [firstName, ...lastNameParts] = contactInfo.fullName.split(" ");
    const lastName = lastNameParts.join(" ");

    setEditForm({
      firstName: firstName || "",
      lastName: lastName || "",
      email: contactInfo.email || "",
      phone: contactInfo.phone || "",
      address: contactInfo.address || "",
      dateOfBirth: parseDateForInput(contactInfo.dateOfBirth),
      gender: contactInfo.gender || "",
      language: contactInfo.language || "",
    });
    setEditModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getOriginalValue = (field) => {
    let value = patient?.[field] || "";
    if (field === "date_of_birth") {
      value = patient?.date_of_birth?.split("T")[0] || "";
    }
    return value;
  };

  const confirmEdit = async () => {
    setIsSaving(true);

    try {
      // Prepare partial updates by comparing with original patient data
      const updates = {};

      if (
        editForm.firstName &&
        editForm.firstName !== (getOriginalValue("first_name") || "")
      ) {
        updates.first_name = editForm.firstName;
      }

      if (
        editForm.lastName &&
        editForm.lastName !== (getOriginalValue("last_name") || "")
      ) {
        updates.last_name = editForm.lastName;
      }

      if (
        editForm.address &&
        editForm.address !== (getOriginalValue("primary_address") || "")
      ) {
        updates.primary_address = editForm.address;
      }

      if (
        editForm.dateOfBirth &&
        editForm.dateOfBirth !== (getOriginalValue("date_of_birth") || "")
      ) {
        updates.date_of_birth = editForm.dateOfBirth + "T00:00:00Z";
      }

      if (
        editForm.gender &&
        editForm.gender !== (getOriginalValue("gender") || "")
      ) {
        updates.gender = editForm.gender;
      }

      if (editForm.language && editForm.language !== contactInfo.language) {
        updates.home_language = editForm.language;
      }

      // Only proceed if there are changes
      if (Object.keys(updates).length === 0) {
        showToast("No changes detected", "info");
        setEditModalOpen(false);
        setIsSaving(false);
        return;
      }

      console.log("Sending updates:", updates);

      // Merge with current patient data
      const merged = { ...patient, ...updates };

      if (patient?.id) {
        const result = await updatePatientProfile(patient.id, merged);
        console.log(result);

        if (result.success) {
          // Update local state with merged data
          const newContactInfo = {
            fullName:
              `${updates.first_name || patient.first_name || ""} ${
                updates.last_name || patient.last_name || ""
              }`.trim() || "",
            email: contactInfo.email,
            phone: contactInfo.phone,
            address: updates.primary_address || patient.primary_address || "",
            dateOfBirth: formatDate(
              updates.date_of_birth || patient.date_of_birth
            ),
            gender: updates.gender || patient.gender || "",
            language: updates.home_language || contactInfo.language,
            smsNotifications: contactInfo.smsNotifications,
          };
          setContactInfo(newContactInfo);

          setEditModalOpen(false);
          showToast("Contact information updated successfully!", "success");
        } else {
          showToast(
            result.error || "Failed to update contact information",
            "error"
          );
        }
      } else {
        showToast(
          "Patient profile not found. Please complete your profile first.",
          "error"
        );
      }
    } catch (error) {
      showToast(
        "An error occurred while updating contact information",
        "error"
      );
      console.error("Update error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSmsNotifications = async () => {
    if (!patient?.id) {
      showToast(
        "Patient profile not found. Please complete your profile first.",
        "error"
      );
      return;
    }

    const newSmsStatus = !contactInfo.smsNotifications;

    try {
      const result = await updatePatientProfile(patient.id, {
        sms_notifications: newSmsStatus,
      });

      if (result.success) {
        setContactInfo((prev) => ({
          ...prev,
          smsNotifications: newSmsStatus,
        }));
        showToast(
          `SMS notifications ${newSmsStatus ? "enabled" : "disabled"}`,
          "success"
        );
      } else {
        showToast("Failed to update notification preferences", "error");
      }
    } catch (error) {
      showToast(
        "An error occurred while updating notification preferences",
        "error"
      );
      console.error("Toggle SMS error:", error);
    }
  };

  // Helper function to display field value or placeholder
  const displayValue = (value) => {
    return value || <span className="italic text-gray-400">Not provided</span>;
  };

  // Loading state
  if (loading || patientLoading) {
    return (
      <Card extra={"w-full h-full p-6"}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-brand-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading your information...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card extra={"w-full h-full p-6"}>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-red-50 p-4 dark:bg-red-900/20">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Unable to Load Information
          </h3>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
          >
            Try Again
          </button>
        </div>
      </Card>
    );
  }

  // No user logged in
  if (!user) {
    return (
      <Card extra={"w-full h-full p-6"}>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <svg
              className="h-8 w-8 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Please Sign In
          </h3>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            You need to be signed in to view your contact information.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Contact Information"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name *
              </label>
              <input
                type="text"
                value={editForm.firstName}
                onChange={(e) => handleFormChange("firstName", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="First Name"
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name *
              </label>
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) => handleFormChange("lastName", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Last Name"
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Email Address"
                disabled={isSaving}
              />
              <p className="mt-1 text-xs text-gray-500">
                To update email, contact support or use account settings.
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Phone Number"
                disabled={isSaving}
              />
              <p className="mt-1 text-xs text-gray-500">
                To update phone, contact support or use account settings.
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date of Birth
              </label>
              <input
                type="date"
                value={editForm.dateOfBirth}
                onChange={(e) =>
                  handleFormChange("dateOfBirth", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                disabled={isSaving}
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
                disabled={isSaving}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Language(s)
              </label>
              <input
                type="text"
                value={editForm.language}
                onChange={(e) => handleFormChange("language", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., English, Zulu"
                disabled={isSaving}
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
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={confirmEdit}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <MdSave className="h-5 w-5" />
                  Save Changes
                </>
              )}
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
            disabled={loading}
            className="flex items-center text-sm font-medium text-brand-500 hover:text-brand-600 disabled:opacity-50"
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
                {displayValue(contactInfo.fullName)}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MdEmail className="mt-1 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Email Address</p>
              <p className="font-medium text-navy-700 dark:text-white">
                {displayValue(contactInfo.email)}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MdPhone className="mt-1 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="font-medium text-navy-700 dark:text-white">
                {displayValue(contactInfo.phone)}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MdLocationOn className="mt-1 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-navy-700 dark:text-white">
                {displayValue(contactInfo.address)}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MdCake className="mt-1 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-medium text-navy-700 dark:text-white">
                {displayValue(contactInfo.dateOfBirth)}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MdLanguage className="mt-1 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Language(s)</p>
              <p className="font-medium text-navy-700 dark:text-white">
                {displayValue(contactInfo.language)}
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
              <div
                className={`mr-2 h-2 w-2 rounded-full ${
                  contactInfo.smsNotifications ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <button
                onClick={toggleSmsNotifications}
                disabled={loading || !patient?.id}
                className="text-sm font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
              >
                {contactInfo.smsNotifications ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
          {!patient?.id && (
            <p className="mt-2 text-xs text-yellow-600">
              Complete your patient profile to enable SMS notifications
            </p>
          )}
        </div>
      </Card>
    </>
  );
};

export default ContactInformation;
