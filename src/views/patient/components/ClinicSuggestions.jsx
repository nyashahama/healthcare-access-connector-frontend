import React, { useState } from "react";
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

const ClinicSuggestions = () => {
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { showToast } = useToast();

  const clinics = [
    {
      id: 1,
      name: "Community Health Clinic",
      distance: "2.5 km",
      address: "123 Health St, Johannesburg",
      status: "Open Now",
      services: ["Pediatrics", "Vaccinations", "General Check-ups"],
      waitTime: "15 min",
      hours: "Mon-Fri: 8am-6pm, Sat: 8am-1pm",
      phone: "+27 11 234 5678",
      rating: "4.5/5",
      features: ["Wheelchair Access", "Parking", "Medical Aid Accepted"],
    },
    {
      id: 2,
      name: "City Public Hospital",
      distance: "4.1 km",
      address: "456 Main Rd, Sandton",
      status: "24/7 Emergency",
      services: ["Emergency", "X-Ray", "Laboratory"],
      waitTime: "30 min",
      hours: "24/7",
      phone: "+27 11 345 6789",
      rating: "4.2/5",
      features: ["Emergency Dept", "ICU", "Trauma Center"],
    },
    {
      id: 3,
      name: "Children's Health Center",
      distance: "3.2 km",
      address: "789 Child Ave, Randburg",
      status: "Open Now",
      services: ["Pediatrics", "Nutrition", "Vaccinations"],
      waitTime: "20 min",
      hours: "Mon-Fri: 7:30am-5pm",
      phone: "+27 11 456 7890",
      rating: "4.7/5",
      features: ["Play Area", "Child Specialists", "Vaccination Clinic"],
    },
  ];

  const handleViewDetails = (clinic) => {
    setSelectedClinic(clinic);
    setDetailsModalOpen(true);
  };

  const handleBookAppointment = (clinic) => {
    setSelectedClinic(clinic);
    setBookModalOpen(true);
  };

  const confirmBooking = () => {
    setBookModalOpen(false);
    showToast(`Appointment booking started for ${selectedClinic.name}`, "info");
    // Redirect to booking page or open booking modal
    setTimeout(() => {
      window.location.href = `/patient/book-appointment?clinic=${selectedClinic.id}`;
    }, 1000);
  };

  const handleViewAll = () => {
    showToast("Opening clinic directory...", "info");
    setTimeout(() => {
      window.location.href = "/patient/clinics";
    }, 1000);
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

        <div className="space-y-4">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className="rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:scale-[1.005] hover:border-brand-500 dark:border-navy-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <MdLocalHospital className="h-5 w-5 text-brand-500" />
                    <h6 className="font-bold text-navy-700 dark:text-white">
                      {clinic.name}
                    </h6>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MdLocationOn className="mr-2 h-4 w-4" />
                      {clinic.distance} away
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MdAccessTime className="mr-2 h-4 w-4" />
                      Wait: {clinic.waitTime}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {clinic.services.map((service, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-navy-700 dark:text-gray-300"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      clinic.status === "Open Now" ||
                      clinic.status === "24/7 Emergency"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {clinic.status}
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
          ))}
        </div>
      </div>
    </>
  );
};

export default ClinicSuggestions;
