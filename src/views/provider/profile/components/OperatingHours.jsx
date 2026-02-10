import React, { useState, useEffect } from "react";
import { FaClock, FaCalendarAlt, FaSave } from "react-icons/fa";
import { MdEdit, MdWarning, MdCheckCircle } from "react-icons/md";
import { useProvider } from "hooks/useProvider";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const OperatingHours = ({ clinicId }) => {
  const { getClinic, updateClinic, clinic, loading } = useProvider();
  const [clinicData, setClinicData] = useState(null);
  const [hours, setHours] = useState({
    monday: { open: "08:00", close: "17:00", closed: false },
    tuesday: { open: "08:00", close: "17:00", closed: false },
    wednesday: { open: "08:00", close: "17:00", closed: false },
    thursday: { open: "08:00", close: "17:00", closed: false },
    friday: { open: "08:00", close: "17:00", closed: false },
    saturday: { open: "09:00", close: "13:00", closed: false },
    sunday: { open: "", close: "", closed: true },
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saveConfirmModalOpen, setSaveConfirmModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...hours });
  const { showToast } = useToast();

  useEffect(() => {
    const fetchClinicData = async () => {
      if (clinicId) {
        const result = await getClinic(clinicId);
        if (result.success && result.data?.operating_hours) {
          setClinicData(result.data);
          const apiHours = parseOperatingHours(result.data.operating_hours);
          setHours(apiHours);
          setEditForm(apiHours);
        }
      }
    };

    fetchClinicData();
  }, [clinicId, getClinic]);

  // Parse API operating hours format to component format
  const parseOperatingHours = (apiHours) => {
    const parsedHours = {};
    const daysOfWeek = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    daysOfWeek.forEach((day) => {
      if (apiHours[day]) {
        const hoursStr = apiHours[day];

        if (
          hoursStr.toLowerCase().includes("emergency") ||
          hoursStr.toLowerCase().includes("closed")
        ) {
          parsedHours[day] = { open: "", close: "", closed: true };
        } else {
          const [open, close] = hoursStr.split("-").map((time) => time.trim());
          parsedHours[day] = {
            open: open || "08:00",
            close: close || "17:00",
            closed: false,
          };
        }
      } else {
        parsedHours[day] = { open: "", close: "", closed: true };
      }
    });

    return parsedHours;
  };

  // Convert component format back to API format
  const formatOperatingHoursForAPI = (hoursObj) => {
    const apiFormat = {};

    Object.entries(hoursObj).forEach(([day, data]) => {
      if (data.closed) {
        apiFormat[day] = "Closed";
      } else {
        apiFormat[day] = `${data.open}-${data.close}`;
      }
    });

    return apiFormat;
  };

  const holidays = [
    { date: "27 April 2024", name: "Freedom Day", closed: true },
    { date: "1 May 2024", name: "Workers' Day", closed: true },
    { date: "16 June 2024", name: "Youth Day", closed: true },
  ];

  const handleEditClick = () => {
    setEditForm({ ...hours });
    setEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    setHours({ ...editForm });
    setEditModalOpen(false);
    showToast("Operating hours updated successfully!", "success");
  };

  const handleDayChange = (day, field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleToggleClosed = (day) => {
    setEditForm((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        closed: !prev[day].closed,
      },
    }));
  };

  const handleSaveConfirm = async () => {
    if (!clinicId) {
      showToast("No clinic ID provided", "error");
      return;
    }

    const apiHours = formatOperatingHoursForAPI(editForm);

    const result = await updateClinic(clinicId, {
      operating_hours: apiHours,
    });

    if (result.success) {
      setHours({ ...editForm });
      setClinicData(result.data);
      setSaveConfirmModalOpen(false);
      showToast("Operating hours saved successfully!", "success");
    } else {
      showToast("Failed to save operating hours", "error");
    }
  };

  if (loading && !clinicData) {
    return (
      <Card extra={"w-full h-full p-6"}>
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-navy-700"></div>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="h-12 rounded bg-gray-200 dark:bg-navy-700"
            ></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card extra={"w-full h-full p-6"}>
      {/* Edit Hours Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Operating Hours"
        size="lg"
      >
        <div className="space-y-6">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <FaClock className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Set your clinic's regular operating hours. Changes will affect
                appointment availability.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(editForm).map(([day, data]) => (
              <div
                key={day}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-600"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={!data.closed}
                    onChange={() => handleToggleClosed(day)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="ml-3 w-32 font-medium capitalize text-navy-700 dark:text-white">
                    {day}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={data.open}
                    onChange={(e) =>
                      handleDayChange(day, "open", e.target.value)
                    }
                    disabled={data.closed}
                    className="rounded-lg border border-gray-300 p-2 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-navy-700"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={data.close}
                    onChange={(e) =>
                      handleDayChange(day, "close", e.target.value)
                    }
                    disabled={data.closed}
                    className="rounded-lg border border-gray-300 p-2 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-navy-700"
                  />
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    data.closed
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  }`}
                >
                  {data.closed ? "Closed" : "Open"}
                </span>
              </div>
            ))}
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
              <FaSave className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Save Confirmation Modal */}
      <Modal
        isOpen={saveConfirmModalOpen}
        onClose={() => setSaveConfirmModalOpen(false)}
        title="Confirm Changes"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <MdWarning className="h-8 w-8 text-yellow-600" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Update Operating Hours?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              This will affect all future appointment availability and patient
              bookings.
            </p>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <div className="flex items-start">
              <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Existing appointments during changed hours may need to be
                rescheduled.
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
              {loading ? "Updating..." : "Update Hours"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <FaClock className="mr-2 text-brand-500" />
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Operating Hours
          </h4>
        </div>
        <button
          onClick={handleEditClick}
          className="flex items-center rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:scale-105 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300"
        >
          <MdEdit className="mr-1" />
          Edit Hours
        </button>
      </div>

      {/* Regular Hours */}
      <div className="space-y-3">
        {Object.entries(hours).map(([day, data]) => (
          <div
            key={day}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 transition-all duration-300 hover:scale-[1.02] dark:bg-navy-700"
          >
            <span className="font-medium capitalize text-navy-700 dark:text-white">
              {day}
            </span>
            {data.closed ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                Closed
              </span>
            ) : (
              <span className="font-medium text-navy-700 dark:text-white">
                {data.open} - {data.close}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Emergency Hours */}
      {clinicData?.emergency_phone && (
        <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 transition-all duration-300 hover:scale-[1.02] dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-start">
            <div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800">
              <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                !
              </span>
            </div>
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-300">
                24/7 Emergency Services
              </p>
              <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                Emergency line: {clinicData.emergency_phone}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Holiday Schedule */}
      <div className="mt-6">
        <div className="mb-4 flex items-center">
          <FaCalendarAlt className="mr-2 text-purple-500" />
          <h5 className="font-bold text-navy-700 dark:text-white">
            Upcoming Holiday Schedule
          </h5>
        </div>
        <div className="space-y-2">
          {holidays.map((holiday, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 transition-all duration-300 hover:scale-[1.02] dark:border-navy-600"
            >
              <div>
                <p className="font-medium text-navy-700 dark:text-white">
                  {holiday.name}
                </p>
                <p className="text-sm text-gray-600">{holiday.date}</p>
              </div>
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                Clinic Closed
              </span>
            </div>
          ))}
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

export default OperatingHours;
