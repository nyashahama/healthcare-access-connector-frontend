import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdLocationOn,
  MdAccessTime,
  MdLocalHospital,
  MdPhone,
  MdMap,
  MdList,
  MdDirections,
} from "react-icons/md";
import {
  FaFilter,
  FaWalking,
  FaCar,
  FaWheelchair,
  FaStethoscope,
} from "react-icons/fa";
import Card from "components/card";
import ClinicMap from "../components/ClinicMap";

const FindClinic = () => {
  const [viewMode, setViewMode] = useState("map"); // 'map' or 'list'
  const [selectedFilters, setSelectedFilters] = useState({
    freeServices: true,
    childHealth: false,
    openNow: false,
    vaccinations: false,
    emergency: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);

  // Mock clinic data - In production, this would come from an API
  const clinics = [
    {
      id: 1,
      name: "Soweto Community Health Centre",
      distance: "2.5 km",
      status: "Open Now",
      services: [
        "Pediatrics",
        "Vaccinations",
        "General Check-ups",
        "HIV Testing",
      ],
      waitTime: "15 min",
      address: "123 Chris Hani Rd, Soweto, Johannesburg",
      phone: "+27 11 984 1234",
      hours: "Mon-Fri: 8:00-17:00, Sat: 8:00-13:00",
      freeServices: true,
      childHealth: true,
      coordinates: { lat: -26.249, lng: 27.854 },
      languages: ["English", "isiZulu", "Sesotho"],
    },
    {
      id: 2,
      name: "Charlotte Maxeke Hospital",
      distance: "4.1 km",
      status: "24/7 Emergency",
      services: ["Emergency", "X-Ray", "Laboratory", "Surgery"],
      waitTime: "30 min",
      address: "1 Jubilee Rd, Parktown, Johannesburg",
      phone: "+27 11 488 4911",
      hours: "24/7",
      freeServices: true,
      emergency: true,
      coordinates: { lat: -26.179, lng: 28.038 },
      languages: ["English", "isiZulu", "Afrikaans"],
    },
    {
      id: 3,
      name: "Rahima Moosa Mother & Child Hospital",
      distance: "3.2 km",
      status: "Open Now",
      services: ["Pediatrics", "Maternity", "Nutrition", "Vaccinations"],
      waitTime: "20 min",
      address: "Cnr Fuel & Oudtshoorn St, Coronationville",
      phone: "+27 11 470 9000",
      hours: "Mon-Fri: 7:30-16:00",
      freeServices: true,
      childHealth: true,
      coordinates: { lat: -26.169, lng: 27.986 },
      languages: ["English", "isiZulu"],
    },
    {
      id: 4,
      name: "Alexandra Clinic",
      distance: "5.7 km",
      status: "Closed",
      services: ["Primary Care", "Chronic Medication", "TB Screening"],
      waitTime: "N/A",
      address: "12th Ave, Alexandra, Johannesburg",
      phone: "+27 11 440 1212",
      hours: "Mon-Fri: 8:00-16:00",
      freeServices: true,
      coordinates: { lat: -26.102, lng: 28.098 },
      languages: ["English", "isiZulu"],
    },
    {
      id: 5,
      name: "Baragwanath Hospital",
      distance: "8.3 km",
      status: "24/7 Emergency",
      services: ["Emergency", "Pediatrics", "Surgery", "ICU"],
      waitTime: "45 min",
      address: "Chris Hani Rd, Soweto, Johannesburg",
      phone: "+27 11 933 8000",
      hours: "24/7",
      freeServices: true,
      emergency: true,
      coordinates: { lat: -26.262, lng: 27.931 },
      languages: ["English", "isiZulu", "Sesotho"],
    },
  ];

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Johannesburg coordinates if permission denied
          setUserLocation({ lat: -26.2041, lng: 28.0473 });
        }
      );
    }
  }, []);

  const filteredClinics = clinics.filter((clinic) => {
    // Search filter
    if (
      searchQuery &&
      !clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !clinic.address.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Service filters
    if (selectedFilters.freeServices && !clinic.freeServices) return false;
    if (selectedFilters.childHealth && !clinic.childHealth) return false;
    if (selectedFilters.openNow && clinic.status === "Closed") return false;
    if (
      selectedFilters.vaccinations &&
      !clinic.services.includes("Vaccinations")
    )
      return false;
    if (selectedFilters.emergency && !clinic.emergency) return false;

    return true;
  });

  const handleBookAppointment = (clinicId) => {
    console.log(`Booking appointment for clinic ${clinicId}`);
    // Navigate to booking page
    window.location.href = `/patient/book-appointment?clinic=${clinicId}`;
  };

  const handleGetDirections = (clinic) => {
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${clinic.coordinates.lat},${clinic.coordinates.lng}`;
    window.open(url, "_blank");
  };

  const FilterButton = ({ icon, label, filterKey }) => (
    <button
      onClick={() =>
        setSelectedFilters((prev) => ({
          ...prev,
          [filterKey]: !prev[filterKey],
        }))
      }
      className={`flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        selectedFilters[filterKey]
          ? "bg-brand-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300"
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          Find a Clinic Near You
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Search for healthcare facilities by location, services, and
          availability
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Search Bar */}
        <div className="lg:col-span-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by clinic name, address, or services..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 dark:border-gray-600 dark:bg-navy-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center rounded-lg px-4 py-2 ${
              viewMode === "map"
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 dark:bg-navy-700 dark:text-gray-300"
            }`}
          >
            <MdMap className="mr-2 h-4 w-4" />
            Map
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center rounded-lg px-4 py-2 ${
              viewMode === "list"
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 dark:bg-navy-700 dark:text-gray-300"
            }`}
          >
            <MdList className="mr-2 h-4 w-4" />
            List
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterButton
          icon={<FaFilter className="h-4 w-4" />}
          label="Free Services"
          filterKey="freeServices"
        />
        <FilterButton
          icon={<MdLocalHospital className="h-4 w-4" />}
          label="Child Health"
          filterKey="childHealth"
        />
        <FilterButton
          icon={<MdAccessTime className="h-4 w-4" />}
          label="Open Now"
          filterKey="openNow"
        />
        <FilterButton
          icon={<FaWheelchair className="h-4 w-4" />}
          label="Vaccinations"
          filterKey="vaccinations"
        />
        <FilterButton
          icon={<FaStethoscope className="h-4 w-4" />}
          label="Emergency"
          filterKey="emergency"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map View */}
        {viewMode === "map" && (
          <div className="lg:col-span-2">
            <Card extra="p-0 overflow-hidden">
              <div className="h-[500px]">
                <ClinicMap
                  clinics={filteredClinics}
                  userLocation={userLocation}
                  onClinicSelect={setSelectedClinic}
                />
              </div>
            </Card>
          </div>
        )}

        {/* Clinic List */}
        <div
          className={`${
            viewMode === "map" ? "lg:col-span-1" : "lg:col-span-3"
          }`}
        >
          <div className="space-y-4">
            {filteredClinics.length === 0 ? (
              <Card extra="p-6 text-center">
                <MdLocalHospital className="mx-auto h-12 w-12 text-gray-400" />
                <h4 className="mt-4 text-lg font-bold text-navy-700 dark:text-white">
                  No clinics found
                </h4>
                <p className="mt-2 text-gray-600">
                  Try adjusting your filters or search terms
                </p>
              </Card>
            ) : (
              filteredClinics.map((clinic) => (
                <Card
                  key={clinic.id}
                  extra="p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="space-y-3">
                    {/* Clinic Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <MdLocalHospital className="h-5 w-5 text-brand-500" />
                          <h5 className="font-bold text-navy-700 dark:text-white">
                            {clinic.name}
                          </h5>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MdLocationOn className="mr-2 h-4 w-4" />
                          {clinic.address}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          clinic.status === "Open Now" ||
                          clinic.status === "24/7 Emergency"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {clinic.status}
                      </span>
                    </div>

                    {/* Clinic Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm">
                        <FaWalking className="mr-2 h-4 w-4 text-gray-400" />
                        <span>{clinic.distance} away</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MdAccessTime className="mr-2 h-4 w-4 text-gray-400" />
                        <span>Wait: {clinic.waitTime}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MdPhone className="mr-2 h-4 w-4 text-gray-400" />
                        <span>{clinic.phone}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Hours: </span>
                        <span>{clinic.hours}</span>
                      </div>
                    </div>

                    {/* Services & Languages */}
                    <div>
                      <div className="mb-2 flex flex-wrap gap-1">
                        {clinic.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {clinic.languages?.map((lang, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-navy-700 dark:text-gray-300"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleGetDirections(clinic)}
                        className="flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600"
                      >
                        <MdDirections className="mr-2 h-4 w-4" />
                        Directions
                      </button>
                      <button
                        onClick={() => handleBookAppointment(clinic.id)}
                        className="linear flex flex-1 items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SMS Access Notice */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="flex items-start">
          <div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              📱
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              <strong>No smartphone?</strong> Text "HELP" to 12345 for SMS-based
              clinic search
            </p>
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
              Reply with your location to get clinic details via SMS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindClinic;
