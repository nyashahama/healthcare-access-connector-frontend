import React from "react";
import Modal from "components/modal/Modal";

const UpdateHoursModal = ({
  isOpen,
  onClose,
  hoursForm,
  setHoursForm,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Clinic Hours"
      size="lg"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {Object.entries(hoursForm).map(([day, hours]) => (
            <div key={day} className="flex items-center justify-between">
              <span className="w-24 capitalize">{day}</span>
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={hours.open}
                  onChange={(e) =>
                    setHoursForm((prev) => ({
                      ...prev,
                      [day]: { ...prev[day], open: e.target.value },
                    }))
                  }
                  className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-700"
                />
                <span>to</span>
                <input
                  type="time"
                  value={hours.close}
                  onChange={(e) =>
                    setHoursForm((prev) => ({
                      ...prev,
                      [day]: { ...prev[day], close: e.target.value },
                    }))
                  }
                  className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-700"
                />
                <label className="ml-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={!hours.open && !hours.close}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setHoursForm((prev) => ({
                          ...prev,
                          [day]: { open: "", close: "" },
                        }));
                      } else {
                        setHoursForm((prev) => ({
                          ...prev,
                          [day]: { open: "08:00", close: "18:00" },
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <span className="ml-2 text-sm">Closed</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
          >
            Update Hours
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateHoursModal;
