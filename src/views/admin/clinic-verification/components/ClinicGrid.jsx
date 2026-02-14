import React from "react";
import Card from "components/card";
import ClinicCard from "./ClinicCard";

const ClinicGrid = ({
  clinics,
  selectedTab,
  searchQuery,
  loading,
  onViewDetails,
  onEdit,
  onDelete,
  onApprove,
}) => {
  // Filter clinics based on selected tab
  const getFilteredClinics = () => {
    if (!clinics) return [];

    let filtered = clinics;

    // Filter by tab
    if (selectedTab !== "all") {
      filtered = filtered.filter(
        (clinic) => clinic.verification_status === selectedTab
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (clinic) =>
          clinic.clinic_name?.toLowerCase().includes(query) ||
          clinic.city?.toLowerCase().includes(query) ||
          clinic.province?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredClinics = getFilteredClinics();

  return (
    <Card extra="p-6">
      <div className="mb-4">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          {selectedTab === "all"
            ? "All Clinics"
            : selectedTab === "pending"
            ? "Pending Verification"
            : selectedTab === "verified"
            ? "Verified Clinics"
            : "Rejected Applications"}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredClinics.length} clinic
          {filteredClinics.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading clinics...</p>
        </div>
      ) : filteredClinics.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p className="mb-2 text-lg">No clinics found</p>
          <p className="text-sm">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "No clinics match the selected filter"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {filteredClinics.map((clinic) => (
            <ClinicCard
              key={clinic.id}
              clinic={clinic}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
              onApprove={onApprove}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default ClinicGrid;
