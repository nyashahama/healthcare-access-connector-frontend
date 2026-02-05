import React, { useState, useEffect } from "react";
import {
  MdLocationOn,
  MdAccessTime,
  MdLocalHospital,
  MdInfo,
  MdCheckCircle,
  MdWarning,
} from "react-icons/md";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import { useProvider } from "hooks/useProvider";

const ClinicSuggestions = () => {
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { showToast } = useToast();

  // Use the provider hook
  const { getClinics, loading, error, clinics, clearError } = useProvider();

  console.log(clinics);

  // Fetch clinics on component mount
  useEffect(() => {
    fetchClinics();
  }, []);

  const [localClinics, setLocalClinics] = useState([]);

  // Update fetchClinics to set local state
  const fetchClinics = async () => {
    const result = await getClinics();
    console.log(result);

    // Handle nested data structure: result.data.data.clinics
    const clinicsData = result.data?.data?.clinics || result.data?.clinics;

    if (result.success && clinicsData) {
      setLocalClinics(clinicsData);
    } else {
      showToast(error || "Failed to load clinics", "error");
    }
  };
  // Format clinic data from API to match component structure
  const formatClinicData = (clinic) => {
    // Determine status based on current time and operating hours
    const getClinicStatus = () => {
      const now = new Date();
      const currentDay = now
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      const currentTime = now.getHours() * 100 + now.getMinutes(); // HHMM format

      const hours = clinic.operating_hours?.[currentDay];

      if (!hours || hours === "closed") return "Closed";

      const openTime = parseInt(hours.open?.replace(":", "") || "0");
      const closeTime = parseInt(hours.close?.replace(":", "") || "2400");

      if (currentTime >= openTime && currentTime <= closeTime) {
        return "Open Now";
      } else {
        return "Closed";
      }
    };

    // Format operating hours for display
    const formatOperatingHours = () => {
      if (!clinic.operating_hours) return "Mon-Fri: 8am-6pm";

      const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      const hoursArray = days
        .map((day) => {
          const hours = clinic.operating_hours[day];
          if (hours === "closed") return null;

          const dayName = day.charAt(0).toUpperCase() + day.slice(1);
          const openTime = hours?.open || "N/A";
          const closeTime = hours?.close || "N/A";

          return `${dayName}: ${openTime}-${closeTime}`;
        })
        .filter(Boolean);

      return hoursArray.length > 0
        ? hoursArray.join(", ")
        : "Hours not available";
    };

    return {
      id: clinic.id,
      name: clinic.clinic_name || "Clinic",
      distance: clinic.distance || "N/A",
      address: `${clinic.physical_address || ""}, ${clinic.city || ""}, ${
        clinic.province || ""
      }`.trim(),
      status: getClinicStatus(),
      services: clinic.services || [],
      specialties: clinic.specialties || [],
      waitTime: clinic.average_wait_time_minutes
        ? `${clinic.average_wait_time_minutes} min`
        : "N/A",
      hours: formatOperatingHours(),
      phone: clinic.primary_phone || "N/A",
      rating: clinic.review_count
        ? `${clinic.rating || "N/A"} (${clinic.review_count} reviews)`
        : "No ratings yet",
      features: clinic.facilities || [],
      languages: clinic.languages_spoken || [],
      acceptsMedicalAid: clinic.accepts_medical_aid,
      medicalAidProviders: clinic.medical_aid_providers || [],
      paymentMethods: clinic.payment_methods || [],
      email: clinic.email || "",
      website: clinic.website || "",
      description: clinic.description || "",
      bedCount: clinic.bed_count || 0,
      yearEstablished: clinic.year_established || "N/A",
      isVerified: clinic.is_verified || false,
      contactPerson: clinic.contact_person_name || "N/A",
      contactPersonRole: clinic.contact_person_role || "",
      contactPersonPhone: clinic.contact_person_phone || "",
      contactPersonEmail: clinic.contact_person_email || "",
      latitude: clinic.latitude,
      longitude: clinic.longitude,
    };
  };

  const handleViewDetails = (clinic) => {
    setSelectedClinic(formatClinicData(clinic));
    setDetailsModalOpen(true);
  };

  const handleBookAppointment = (clinic) => {
    setSelectedClinic(formatClinicData(clinic));
    setBookModalOpen(true);
  };

  const confirmBooking = () => {
    setBookModalOpen(false);
    showToast(`Appointment booking started for ${selectedClinic.name}`, "info");
    // Redirect to booking page or open booking modal

    window.location.href = `/patient/book-appointment?clinic=${selectedClinic.id}`;
  };

  const handleViewAll = () => {
    showToast("Opening clinic directory...", "info");

    window.location.href = "/patient/find-clinic";
  };

  return (
    <>
      {/* Clinic Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="Clinic Details"
        size="lg"
      >
        {selectedClinic && (
          <div className="space-y-6">
            {/* Clinic Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  <MdLocalHospital className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                    {selectedClinic.name}
                  </h4>
                  <div className="mt-1 flex items-center text-gray-600 dark:text-gray-300">
                    <MdLocationOn className="mr-2 h-4 w-4" />
                    {selectedClinic.address}
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                {selectedClinic.status}
              </span>
            </div>

            {/* Clinic Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="text-sm text-gray-500">Distance</div>
                <div className="text-lg font-bold">
                  {selectedClinic.distance}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="text-sm text-gray-500">Wait Time</div>
                <div className="text-lg font-bold">
                  {selectedClinic.waitTime}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="text-sm text-gray-500">Phone</div>
                <div className="font-medium">{selectedClinic.phone}</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="text-sm text-gray-500">Rating</div>
                <div className="font-medium text-yellow-600">
                  {selectedClinic.rating}
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Services Offered
              </h5>
              <div className="flex flex-wrap gap-2">
                {selectedClinic.services.map((service, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            {selectedClinic.features && selectedClinic.features.length > 0 && (
              <div>
                <h5 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Features
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedClinic.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    >
                      <MdCheckCircle className="h-3 w-3" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Hours */}
            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Operating Hours
              </h5>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <MdAccessTime className="mr-2 h-4 w-4" />
                {selectedClinic.hours}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDetailsModalOpen(false);
                  setBookModalOpen(true);
                }}
                className="rounded-lg bg-brand-500 px-6 py-2 font-medium text-white hover:bg-brand-600"
              >
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        title="Book Appointment"
        size="md"
      >
        {selectedClinic && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <MdLocalHospital className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                Book at {selectedClinic.name}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Select appointment type and time
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Appointment Type
                </label>
                <select className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-navy-800">
                  <option>General Check-up</option>
                  <option>Vaccination</option>
                  <option>Follow-up Visit</option>
                  <option>Emergency Visit</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Time
                </label>
                <select className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-navy-800">
                  <option>Morning (8am-12pm)</option>
                  <option>Afternoon (1pm-5pm)</option>
                  <option>Evening (after 5pm)</option>
                </select>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex items-start">
                <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Estimated wait time: {selectedClinic.waitTime}. Please arrive
                  10 minutes early.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <div className="flex items-start">
                <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Remember to bring your ID, medical aid card, and any previous
                  medical records.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setBookModalOpen(false)}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="rounded-lg bg-brand-500 px-6 py-2 font-medium text-white hover:bg-brand-600"
              >
                Continue Booking
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Main Component */}
      <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
        <div className="mb-4 flex items-center justify-between">
          <h5 className="text-lg font-bold text-navy-700 dark:text-white">
            Clinics Near You
          </h5>
          <button
            onClick={handleViewAll}
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            View All
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">Loading clinics...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-center text-red-700 dark:text-red-300">
              <MdWarning className="mr-2 h-5 w-5" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchClinics}
              className="mt-2 text-sm text-brand-500 hover:text-brand-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && (!localClinics || localClinics.length === 0) && (
          <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-navy-700">
            <MdLocalHospital className="mx-auto h-12 w-12 text-gray-400" />
            <h4 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
              No clinics available
            </h4>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Check back later or try a different location.
            </p>
          </div>
        )}

        {/* Clinics List */}
        <div className="space-y-4">
          {!loading &&
            !error &&
            localClinics &&
            localClinics.length > 0 &&
            localClinics.map((clinic) => {
              const formattedClinic = formatClinicData(clinic);

              return (
                <div
                  key={clinic.id}
                  className="rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:scale-[1.005] hover:border-brand-500 dark:border-navy-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <MdLocalHospital className="h-5 w-5 text-brand-500" />
                        <h6 className="font-bold text-navy-700 dark:text-white">
                          {formattedClinic.name}
                        </h6>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MdLocationOn className="mr-2 h-4 w-4" />
                          {formattedClinic.distance} away
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MdAccessTime className="mr-2 h-4 w-4" />
                          Wait: {formattedClinic.waitTime}
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {formattedClinic.services
                            .slice(0, 3)
                            .map((service, idx) => (
                              <span
                                key={idx}
                                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-navy-700 dark:text-gray-300"
                              >
                                {service}
                              </span>
                            ))}
                          {formattedClinic.services.length > 3 && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-navy-700 dark:text-gray-300">
                              +{formattedClinic.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          formattedClinic.status === "Open Now" ||
                          formattedClinic.status === "24/7 Emergency" ||
                          formattedClinic.status.toLowerCase().includes("open")
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {formattedClinic.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleViewDetails(clinic)}
                      className="flex-1 rounded-xl border border-gray-300 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-50 dark:border-gray-600"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleBookAppointment(clinic)}
                      className="linear flex-1 rounded-xl bg-brand-500 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ClinicSuggestions;
