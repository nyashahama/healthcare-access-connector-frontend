import React, { useState, useEffect } from "react";
import {
  MdLocationOn,
  MdAccessTime,
  MdLocalHospital,
  MdInfo,
  MdCheckCircle,
  MdWarning,
  MdStar,
  MdPhone,
  MdEmail,
  MdDirections,
  MdClose,
  MdLanguage,
  MdPayment,
} from "react-icons/md";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import { useProvider } from "hooks/useProvider";

const ClinicSuggestions = () => {
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { showToast } = useToast();

  const { clinics, loading, error, getClinics } = useProvider();

  useEffect(() => {
    // Only fetch if clinics don't already exist
    if (!clinics || clinics.length === 0) {
      getClinics();
    }
  }, []);

  const formatClinicData = (clinic) => {
    const getClinicStatus = () => {
      const now = new Date();
      const currentDay = now
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      const currentTime = now.getHours() * 100 + now.getMinutes();
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
      rating: clinic.rating || 0,
      reviewCount: clinic.review_count || 0,
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
    showToast(`Redirecting to booking...`, "info");
    window.location.href = `/patient/book-appointment?clinic=${selectedClinic.id}`;
  };

  const handleViewAll = () => {
    window.location.href = "/patient/find-clinic";
  };

  console.log(clinics);

  return (
    <>
      {/* Clinic Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title=""
        size="lg"
      >
        {selectedClinic && (
          <div className="space-y-6 py-4">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                <MdLocalHospital className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 flex items-center justify-center gap-2 text-2xl font-bold text-navy-700 dark:text-white">
                {selectedClinic.name}
                {selectedClinic.isVerified && (
                  <MdCheckCircle
                    className="h-6 w-6 text-blue-500"
                    title="Verified"
                  />
                )}
              </h3>
              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                <MdLocationOn className="h-4 w-4" />
                <span className="text-sm">{selectedClinic.address}</span>
              </div>
            </div>

            {/* Status & Rating */}
            <div className="flex items-center justify-center gap-4">
              <span
                className={`rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wide ${
                  selectedClinic.status === "Open Now" ||
                  selectedClinic.status.toLowerCase().includes("open")
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {selectedClinic.status}
              </span>
              {selectedClinic.rating > 0 && (
                <div className="flex items-center gap-1">
                  <MdStar className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-navy-700 dark:text-white">
                    {selectedClinic.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({selectedClinic.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border-2 border-gray-200 p-4 text-center dark:border-gray-700">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Distance
                </div>
                <div className="mt-1 text-2xl font-bold text-navy-700 dark:text-white">
                  {selectedClinic.distance}
                </div>
              </div>
              <div className="rounded-xl border-2 border-gray-200 p-4 text-center dark:border-gray-700">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Wait Time
                </div>
                <div className="mt-1 text-2xl font-bold text-navy-700 dark:text-white">
                  {selectedClinic.waitTime}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              {selectedClinic.phone !== "N/A" && (
                <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                    <MdPhone className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Phone
                    </div>
                    <div className="mt-0.5 font-semibold text-navy-700 dark:text-white">
                      {selectedClinic.phone}
                    </div>
                  </div>
                  <a
                    href={`tel:${selectedClinic.phone}`}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    Call
                  </a>
                </div>
              )}

              {selectedClinic.email && (
                <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <MdEmail className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Email
                    </div>
                    <div className="mt-0.5 font-semibold text-navy-700 dark:text-white">
                      {selectedClinic.email}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Services */}
            {selectedClinic.services.length > 0 && (
              <div>
                <h5 className="mb-3 font-bold text-navy-700 dark:text-white">
                  Services Offered
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedClinic.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border-2 border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-900/20 dark:text-brand-300"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {selectedClinic.languages.length > 0 && (
              <div>
                <h5 className="mb-3 flex items-center gap-2 font-bold text-navy-700 dark:text-white">
                  <MdLanguage className="h-5 w-5" />
                  Languages Spoken
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedClinic.languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-navy-700 dark:text-gray-300"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Medical Aid */}
            {selectedClinic.acceptsMedicalAid && (
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <div className="mb-2 flex items-center gap-2">
                  <MdPayment className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h5 className="font-bold text-green-900 dark:text-green-300">
                    Medical Aid Accepted
                  </h5>
                </div>
                {selectedClinic.medicalAidProviders.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedClinic.medicalAidProviders.map((provider, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-green-200 px-3 py-1 text-xs font-medium text-green-900 dark:bg-green-800 dark:text-green-200"
                      >
                        {provider}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Operating Hours */}
            <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-navy-900">
              <h5 className="mb-2 font-bold text-navy-700 dark:text-white">
                Operating Hours
              </h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {selectedClinic.hours}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDetailsModalOpen(false);
                  setBookModalOpen(true);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
              >
                <MdCheckCircle className="h-5 w-5" />
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        title=""
        size="md"
      >
        {selectedClinic && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600">
                <MdCheckCircle className="h-8 w-8 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Book Appointment
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                at {selectedClinic.name}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 p-4 dark:from-brand-900/20 dark:to-purple-900/20">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MdLocationOn className="mt-1 h-5 w-5 text-brand-600 dark:text-brand-400" />
                  <div>
                    <div className="font-semibold text-navy-700 dark:text-white">
                      {selectedClinic.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedClinic.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Appointment Type
                </label>
                <select className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800">
                  <option>General Check-up</option>
                  <option>Vaccination</option>
                  <option>Follow-up Visit</option>
                  <option>Emergency Visit</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Preferred Time
                </label>
                <select className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800">
                  <option>Morning (8am-12pm)</option>
                  <option>Afternoon (1pm-5pm)</option>
                  <option>Evening (after 5pm)</option>
                </select>
              </div>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-start gap-3">
                <MdInfo className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Estimated wait time:</strong>{" "}
                  {selectedClinic.waitTime}. Please arrive 10 minutes early.
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-start gap-3">
                <MdWarning className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                  Remember to bring your ID, medical aid card, and any previous
                  medical records.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setBookModalOpen(false)}
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
              >
                Continue Booking
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Main Component */}
      <div className="rounded-[20px] bg-white p-6 shadow-sm dark:bg-navy-800">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h5 className="text-xl font-bold text-navy-700 dark:text-white">
              Clinics Near You
            </h5>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Find the best healthcare nearby
            </p>
          </div>
          <button
            onClick={handleViewAll}
            className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
          >
            View All
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
            <div className="text-gray-500 dark:text-gray-400">
              Loading clinics...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-start gap-3">
              <MdWarning className="mt-0.5 h-6 w-6 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <div className="font-semibold text-red-900 dark:text-red-300">
                  Error loading clinics
                </div>
                <div className="mt-1 text-sm text-red-700 dark:text-red-400">
                  {error}
                </div>
                <button
                  onClick={getClinics}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && (!clinics || clinics.length === 0) && (
          <div className="rounded-xl bg-gray-50 p-12 text-center dark:bg-navy-700">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-navy-600">
              <MdLocalHospital className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
              No Clinics Found
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later or try a different location
            </p>
          </div>
        )}

        {/* Clinics List */}
        <div className="space-y-4">
          {!loading &&
            !error &&
            clinics &&
            clinics.length > 0 &&
            clinics.map((clinic) => {
              const formattedClinic = formatClinicData(clinic);

              return (
                <div
                  key={clinic.id}
                  className="group relative overflow-hidden rounded-xl border-2 border-gray-200 p-5 transition-all duration-300 hover:border-brand-500 hover:shadow-lg dark:border-navy-700 dark:hover:border-brand-500"
                >
                  {/* Gradient accent on hover */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></div>

                  {/* Background pattern */}
                  <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-5">
                    <MdLocalHospital className="h-full w-full text-brand-500" />
                  </div>

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
                            <MdLocalHospital className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h6 className="text-lg font-bold text-navy-700 dark:text-white">
                                {formattedClinic.name}
                              </h6>
                              {formattedClinic.isVerified && (
                                <MdCheckCircle
                                  className="h-5 w-5 text-blue-500"
                                  title="Verified"
                                />
                              )}
                            </div>
                            {formattedClinic.rating > 0 && (
                              <div className="mt-1 flex items-center gap-1">
                                <MdStar className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-semibold text-navy-700 dark:text-white">
                                  {formattedClinic.rating.toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({formattedClinic.reviewCount})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mb-3 grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                              <MdLocationOn className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Distance
                              </div>
                              <div className="text-sm font-semibold text-navy-700 dark:text-white">
                                {formattedClinic.distance}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                              <MdAccessTime className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Wait Time
                              </div>
                              <div className="text-sm font-semibold text-navy-700 dark:text-white">
                                {formattedClinic.waitTime}
                              </div>
                            </div>
                          </div>
                        </div>

                        {formattedClinic.services.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {formattedClinic.services
                              .slice(0, 3)
                              .map((service, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-navy-700 dark:text-gray-300"
                                >
                                  {service}
                                </span>
                              ))}
                            {formattedClinic.services.length > 3 && (
                              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                                +{formattedClinic.services.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="ml-4">
                        <span
                          className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
                            formattedClinic.status === "Open Now" ||
                            formattedClinic.status
                              .toLowerCase()
                              .includes("open")
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {formattedClinic.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleViewDetails(clinic)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:text-gray-200 dark:hover:bg-navy-700"
                      >
                        <MdInfo className="h-4 w-4" />
                        Details
                      </button>
                      <button
                        onClick={() => handleBookAppointment(clinic)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
                      >
                        <MdCheckCircle className="h-4 w-4" />
                        Book Now
                      </button>
                    </div>
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
