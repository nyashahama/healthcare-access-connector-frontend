import React from "react";
import Modal from "components/modal/Modal";

const GenerateReportModal = ({
  isOpen,
  onClose,
  reportForm,
  setReportForm,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Report" size="md">
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Report Type *
          </label>
          <select
            value={reportForm.type}
            onChange={(e) =>
              setReportForm((prev) => ({ ...prev, type: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {reportForm.type === "custom" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date *
              </label>
              <input
                type="date"
                value={reportForm.startDate}
                onChange={(e) =>
                  setReportForm((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date *
              </label>
              <input
                type="date"
                value={reportForm.endDate}
                onChange={(e) =>
                  setReportForm((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                min={reportForm.startDate}
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Include in Report
          </label>
          <div className="space-y-2">
            {["revenue", "appointments", "patients", "services", "staff"].map(
              (item) => (
                <label key={item} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportForm.include.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setReportForm((prev) => ({
                          ...prev,
                          include: [...prev.include, item],
                        }));
                      } else {
                        setReportForm((prev) => ({
                          ...prev,
                          include: prev.include.filter((i) => i !== item),
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <span className="ml-2 text-sm capitalize">{item}</span>
                </label>
              )
            )}
          </div>
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
            Generate Report
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GenerateReportModal;
