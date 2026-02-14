import React from "react";
import Card from "components/card";

const BulkActions = ({ onBulkApprove, showToast }) => {
  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        ⚡ Bulk Actions
      </h4>
      <div className="space-y-3">
        <button
          onClick={() => {
            showToast("Bulk approve feature coming soon!", "info");
          }}
          className="w-full rounded-lg bg-brand-50 py-3 text-sm font-medium text-brand-600 transition-all duration-200 hover:scale-105 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-300"
        >
          Approve All Complete Applications
        </button>
        <button className="w-full rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">
          Request Missing Documents
        </button>
        <button className="w-full rounded-lg border border-red-300 py-3 text-sm font-medium text-red-700 transition-all duration-200 hover:scale-105 hover:bg-red-50 dark:border-red-700 dark:text-red-400">
          Export Verification Report
        </button>
      </div>
    </Card>
  );
};

export default BulkActions;
