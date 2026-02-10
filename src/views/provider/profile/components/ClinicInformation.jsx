import React, { useState, useEffect } from "react";
import {
  MdBusiness,
  MdDescription,
  MdAccessible,
  MdLanguage,
  MdLocalHospital,
  MdPayment,
  MdEdit,
  MdSave,
  MdWarning,
} from "react-icons/md";
import { useProvider } from "hooks/useProvider";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const ClinicInformation = ({ clinicId }) => {
  const { getClinic, updateClinic, clinic, loading } = useProvider();
  const [clinicData, setClinicData] = useState(null);
  const [clinicInfo, setClinicInfo] = useState({
    clinic_type: "",
    description: "",
    facilities: [],
    languages: [],
    payment_methods: [],
    accreditation_body: "",
    year_established: "",
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saveConfirmModalOpen, setSaveConfirmModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...clinicInfo });
  const { showToast } = useToast();

  useEffect(() => {
    const fetchClinicData = async () => {
      if (clinicId) {
        const result = await getClinic(clinicId);
        if (result.success) {
          setClinicData(result.data);

          const info = {
            clinic_type: result.data.clinic_type || "",
            description: result.data.description || "",
            facilities: result.data.facilities || [],
            languages: result.data.languages_spoken || [],
            payment_methods: result.data.payment_methods || [],
            accreditation_body: result.data.accreditation_body || "",
            year_established: result.data.year_established?.toString() || "",
          };

          setClinicInfo(info);
          setEditForm(info);
        }
      }
    };

    fetchClinicData();
  }, [clinicId, getClinic]);

  const formatClinicType = (type) => {
    if (!type) return "";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatLanguage = (langCode) => {
    const langMap = {
      en: "English",
      zu: "Zulu",
      af: "Afrikaans",
      xh: "Xhosa",
      st: "Sotho",
      ts: "Tsonga",
      tn: "Tswana",
      ve: "Venda",
      nr: "Ndebele",
      ss: "Swazi",
      nso: "Northern Sotho",
    };
    return langMap[langCode] || langCode;
  };

  const formatPaymentMethod = (method) => {
    if (!method) return "";
    return method
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatFacility = (facility) => {
    if (!facility) return "";
    return facility
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleEditClick = () => {
    setEditForm({ ...clinicInfo });
    setEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setClinicInfo({ ...editForm });
    setEditModalOpen(false);
    showToast("Clinic information updated successfully!", "success");
  };

  const handleSaveConfirm = async () => {
    if (!clinicId) {
      showToast("No clinic ID provided", "error");
      return;
    }

    const updateData = {
      clinic_type: editForm.clinic_type,
      description: editForm.description,
      facilities: editForm.facilities,
      languages_spoken: editForm.languages,
      payment_methods: editForm.payment_methods,
      accreditation_body: editForm.accreditation_body,
      year_established: parseInt(editForm.year_established) || null,
    };

    const result = await updateClinic(clinicId, updateData);

    if (result.success) {
      setClinicInfo({ ...editForm });
      setClinicData(result.data);
      setSaveConfirmModalOpen(false);
      showToast("Clinic information saved successfully!", "success");
    } else {
      showToast("Failed to save clinic information", "error");
    }
  };

  const handleFacilityAdd = (facility) => {
    if (facility && !editForm.facilities.includes(facility)) {
      setEditForm({
        ...editForm,
        facilities: [...editForm.facilities, facility],
      });
    }
  };

  const handleFacilityRemove = (facilityToRemove) => {
    setEditForm({
      ...editForm,
      facilities: editForm.facilities.filter((f) => f !== facilityToRemove),
    });
  };

  const handleLanguageAdd = (language) => {
    if (language && !editForm.languages.includes(language)) {
      setEditForm({
        ...editForm,
        languages: [...editForm.languages, language],
      });
    }
  };

  const handleLanguageRemove = (languageToRemove) => {
    setEditForm({
      ...editForm,
      languages: editForm.languages.filter((l) => l !== languageToRemove),
    });
  };

  if (loading && !clinicData) {
    return (
      <Card extra={"w-full h-full p-6"}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-navy-700"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-navy-700"></div>
              <div className="h-8 rounded bg-gray-200 dark:bg-navy-700"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card extra={"w-full h-full p-6"}>
      {/* Edit Clinic Details Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Clinic Information"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Clinic Type *
            </label>
            <select
              value={editForm.clinic_type}
              onChange={(e) =>
                setEditForm({ ...editForm, clinic_type: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            >
              <option value="public_clinic">Public Clinic</option>
              <option value="private_clinic">Private Clinic</option>
              <option value="community_health_center">
                Community Health Center
              </option>
              <option value="specialist_clinic">Specialist Clinic</option>
              <option value="mobile_clinic">Mobile Clinic</option>
              <option value="district_hospital">District Hospital</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description *
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              rows="4"
              placeholder="Describe your clinic services..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Facilities & Accessibility
            </label>
            <div className="mb-3 flex flex-wrap gap-2">
              {editForm.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300"
                >
                  {formatFacility(facility)}
                  <button
                    onClick={() => handleFacilityRemove(facility)}
                    className="ml-1 hover:text-green-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a facility (e.g., WiFi, Parking)"
                className="flex-1 rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-700"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleFacilityAdd(
                      e.target.value.toLowerCase().replace(/ /g, "_")
                    );
                    e.target.value = "";
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector(
                    'input[placeholder="Add a facility (e.g., WiFi, Parking)"]'
                  );
                  if (input.value) {
                    handleFacilityAdd(
                      input.value.toLowerCase().replace(/ /g, "_")
                    );
                    input.value = "";
                  }
                }}
                className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Languages Spoken
            </label>
            <div className="mb-3 flex flex-wrap gap-2">
              {editForm.languages.map((language, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {formatLanguage(language)}
                  <button
                    onClick={() => handleLanguageRemove(language)}
                    className="ml-1 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-700"
                onChange={(e) => {
                  if (e.target.value) {
                    handleLanguageAdd(e.target.value);
                    e.target.value = "";
                  }
                }}
              >
                <option value="">Select a language</option>
                <option value="en">English</option>
                <option value="zu">Zulu</option>
                <option value="af">Afrikaans</option>
                <option value="xh">Xhosa</option>
                <option value="st">Sotho</option>
                <option value="ts">Tsonga</option>
                <option value="tn">Tswana</option>
                <option value="ve">Venda</option>
                <option value="nr">Ndebele</option>
                <option value="ss">Swazi</option>
                <option value="nso">Northern Sotho</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Accreditation
              </label>
              <input
                type="text"
                value={editForm.accreditation_body}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    accreditation_body: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., HPCSA, DOH"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Operating Since
              </label>
              <input
                type="number"
                value={editForm.year_established}
                onChange={(e) =>
                  setEditForm({ ...editForm, year_established: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Year"
                min="1900"
                max={new Date().getFullYear()}
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
              onClick={handleSaveChanges}
              className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
            >
              <MdSave className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Save Confirmation Modal */}
      <Modal
        isOpen={saveConfirmModalOpen}
        onClose={() => setSaveConfirmModalOpen(false)}
        title="Save Changes"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <MdSave className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Update Clinic Information?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              These changes will be visible to all patients and visitors.
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Changes may affect how patients find and interact with your
                clinic.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSaveConfirmModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveConfirm}
              disabled={loading}
              className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Information"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          Clinic Information
        </h4>
        <button
          onClick={handleEditClick}
          className="flex items-center rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:scale-105 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300"
        >
          <MdEdit className="mr-1" />
          Edit Details
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <MdBusiness className="mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Clinic Type</p>
            <p className="font-medium text-navy-700 dark:text-white">
              {formatClinicType(clinicInfo.clinic_type)}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MdDescription className="mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Description</p>
            <p className="font-medium text-navy-700 dark:text-white">
              {clinicInfo.description || "No description available"}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MdAccessible className="mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Facilities & Accessibility</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {clinicInfo.facilities.length > 0 ? (
                clinicInfo.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    {formatFacility(facility)}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">
                  No facilities listed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MdLanguage className="mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Languages Spoken</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {clinicInfo.languages.length > 0 ? (
                clinicInfo.languages.map((language, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  >
                    {formatLanguage(language)}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">
                  No languages listed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MdPayment className="mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Payment Methods</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {clinicInfo.payment_methods.length > 0 ? (
                clinicInfo.payment_methods.map((method, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                  >
                    {formatPaymentMethod(method)}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">
                  No payment methods listed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 dark:border-navy-600">
          <div>
            <p className="text-sm text-gray-600">Accreditation</p>
            <p className="font-medium text-navy-700 dark:text-white">
              {clinicInfo.accreditation_body || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Operating Since</p>
            <p className="font-medium text-navy-700 dark:text-white">
              {clinicInfo.year_established || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={() => setSaveConfirmModalOpen(true)}
        className="linear mt-6 w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:scale-105 hover:bg-brand-600"
      >
        Save Changes
      </button>
    </Card>
  );
};

export default ClinicInformation;
