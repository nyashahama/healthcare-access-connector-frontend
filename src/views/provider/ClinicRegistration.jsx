import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "components/fields/InputField";
import { useToast } from "hooks/useToast";
import { useProvider } from "hooks/useProvider";
import { useAuth } from "hooks/useAuth";

const CLINIC_TYPES = [
  { value: "private_clinic", label: "Private Clinic" },
  { value: "public_clinic", label: "Public Clinic" },
  { value: "community_health_center", label: "Community Health Center" },
  { value: "hospital", label: "Hospital" },
  { value: "specialized_clinic", label: "Specialized Clinic" },
];

const OWNERSHIP_TYPES = [
  { value: "private_partnership", label: "Private Partnership" },
  { value: "sole_proprietor", label: "Sole Proprietor" },
  { value: "government", label: "Government" },
  { value: "ngo", label: "NGO" },
  { value: "corporate", label: "Corporate" },
];

const SERVICES = [
  { value: "general_practice", label: "General Practice" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "women_health", label: "Women's Health" },
  { value: "chronic_disease_management", label: "Chronic Disease Management" },
  { value: "minor_surgery", label: "Minor Surgery" },
  { value: "vaccinations", label: "Vaccinations" },
  { value: "health_screenings", label: "Health Screenings" },
  { value: "dental", label: "Dental" },
  { value: "ophthalmology", label: "Ophthalmology" },
  { value: "physiotherapy", label: "Physiotherapy" },
];

const SPECIALTIES = [
  { value: "family_medicine", label: "Family Medicine" },
  { value: "internal_medicine", label: "Internal Medicine" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "obstetrics_gynecology", label: "Obstetrics & Gynecology" },
  { value: "surgery", label: "Surgery" },
  { value: "psychiatry", label: "Psychiatry" },
  { value: "dermatology", label: "Dermatology" },
];

const FACILITIES = [
  { value: "wheelchair_accessible", label: "Wheelchair Accessible" },
  { value: "parking", label: "Parking Available" },
  { value: "waiting_area", label: "Waiting Area" },
  { value: "consultation_rooms", label: "Consultation Rooms" },
  { value: "procedure_room", label: "Procedure Room" },
  { value: "pharmacy", label: "On-site Pharmacy" },
  { value: "laboratory", label: "Laboratory" },
  { value: "x_ray", label: "X-Ray Facilities" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "zu", label: "Zulu" },
  { value: "xh", label: "Xhosa" },
  { value: "af", label: "Afrikaans" },
  { value: "st", label: "Sotho" },
  { value: "tn", label: "Tswana" },
  { value: "ss", label: "Swati" },
  { value: "ve", label: "Venda" },
  { value: "ts", label: "Tsonga" },
  { value: "nr", label: "Ndebele" },
];

const PAYMENT_METHODS = [
  { value: "medical_aid", label: "Medical Aid" },
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "eft", label: "EFT" },
];

const PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
];

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const ClinicRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { registerClinic } = useProvider();
  const { getCurrentUser } = useAuth();

  const [formData, setFormData] = useState({
    // Basic Information
    clinic_name: "",
    clinic_type: "",
    description: "",
    year_established: "",
    ownership_type: "",

    // Contact Information
    email: "",
    primary_phone: "",
    secondary_phone: "",
    emergency_phone: "",
    website: "",

    // Address
    physical_address: "",
    city: "",
    province: "",
    postal_code: "",
    country: "South Africa",

    // Operational Details
    bed_count: "",
    patient_capacity: "",
    average_wait_time_minutes: "",
    operating_hours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },

    // Services & Specialties
    services: [],
    specialties: [],
    languages_spoken: [],
    facilities: [],

    // Medical Aid & Payment
    accepts_medical_aid: false,
    medical_aid_providers: "",
    payment_methods: [],
    fee_structure: "medical_aid_rates",

    // Accreditation
    accreditation_number: "",
    accreditation_body: "HPCSA",
    accreditation_expiry: "",

    // Contact Person
    contact_person_name: "",
    contact_person_role: "",
    contact_person_phone: "",
    contact_person_email: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOperatingHoursChange = (day, value) => {
    setFormData((prev) => ({
      ...prev,
      operating_hours: {
        ...prev.operating_hours,
        [day]: value,
      },
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((item) => item !== value)
        : [...prev[name], value],
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.clinic_name.trim()) {
          showToast("Please enter clinic name", "warning");
          return false;
        }
        if (!formData.clinic_type) {
          showToast("Please select clinic type", "warning");
          return false;
        }
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
          showToast("Please enter a valid email", "warning");
          return false;
        }
        if (!formData.primary_phone) {
          showToast("Please enter primary phone number", "warning");
          return false;
        }
        return true;

      case 2:
        if (!formData.physical_address.trim()) {
          showToast("Please enter physical address", "warning");
          return false;
        }
        if (!formData.city.trim()) {
          showToast("Please enter city", "warning");
          return false;
        }
        if (!formData.province) {
          showToast("Please select province", "warning");
          return false;
        }
        return true;

      case 3:
        if (formData.services.length === 0) {
          showToast("Please select at least one service", "warning");
          return false;
        }
        return true;

      case 4:
        if (formData.payment_methods.length === 0) {
          showToast("Please select at least one payment method", "warning");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setIsLoading(true);

    try {
      // Convert medical_aid_providers string to array
      const medicalAidArray = formData.medical_aid_providers
        ? formData.medical_aid_providers.split(",").map((s) => s.trim())
        : [];

      const clinicData = {
        ...formData,
        year_established: parseInt(formData.year_established) || undefined,
        bed_count: parseInt(formData.bed_count) || undefined,
        patient_capacity: parseInt(formData.patient_capacity) || undefined,
        average_wait_time_minutes:
          parseInt(formData.average_wait_time_minutes) || undefined,
        medical_aid_providers: medicalAidArray,
        accreditation_expiry: formData.accreditation_expiry
          ? new Date(formData.accreditation_expiry).toISOString()
          : undefined,
      };

      const result = await registerClinic(clinicData);

      if (result.success) {
        showToast("Clinic registration submitted successfully!", "success");
        setRegistrationComplete(true);
      } else {
        showToast(result.error || "Registration failed", "error");
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error");
      console.error("Clinic registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message after registration
  if (registrationComplete) {
    return (
      <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10">
        <div className="w-full max-w-4xl">
          <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-navy-800">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <svg
                  className="h-10 w-10 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="mb-3 text-2xl font-bold text-navy-700 dark:text-white">
                Clinic Registration Submitted!
              </h2>

              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Your clinic registration has been successfully submitted for
                review.
              </p>

              <div className="mb-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
                <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-100">
                  What happens next?
                </h3>
                <ol className="space-y-3 text-left text-sm text-blue-800 dark:text-blue-200">
                  <li className="flex items-start">
                    <span className="mr-3 font-bold">1.</span>
                    <span>
                      Our admin team will review your clinic registration
                      details
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold">2.</span>
                    <span>
                      You'll receive an email notification once the review is
                      complete
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold">3.</span>
                    <span>
                      If approved, you'll be able to access all clinic
                      management features
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-bold">4.</span>
                    <span>Review typically takes 1-3 business days</span>
                  </li>
                </ol>
              </div>

              <div className="mb-6 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Your access to the platform is limited until your clinic is
                  approved. You can view your dashboard but cannot manage
                  appointments or patients yet.
                </p>
              </div>

              <button
                onClick={() => navigate("/provider/dashboard")}
                className="w-full rounded-xl bg-brand-500 py-3 text-white hover:bg-brand-600"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-navy-700 dark:text-white">
            Register Your Clinic
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Complete the registration to start serving patients
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  currentStep >= step
                    ? "bg-brand-500 text-white"
                    : "bg-gray-200 text-gray-600 dark:bg-navy-700 dark:text-gray-400"
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`h-1 w-12 ${
                    currentStep > step
                      ? "bg-brand-500"
                      : "bg-gray-200 dark:bg-navy-700"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main Form Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-800 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
                  Basic Information
                </h2>

                <InputField
                  variant="auth"
                  label="Clinic Name *"
                  placeholder="e.g., Johannesburg Medical Centre"
                  name="clinic_name"
                  value={formData.clinic_name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-navy-700 dark:text-white">
                      Clinic Type *
                    </label>
                    <select
                      name="clinic_type"
                      value={formData.clinic_type}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-700 outline-none focus:border-brand-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
                      required
                    >
                      <option value="">Select clinic type</option>
                      {CLINIC_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-navy-700 dark:text-white">
                      Ownership Type
                    </label>
                    <select
                      name="ownership_type"
                      value={formData.ownership_type}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-700 outline-none focus:border-brand-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
                    >
                      <option value="">Select ownership type</option>
                      {OWNERSHIP_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-navy-700 dark:text-white">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-700 outline-none focus:border-brand-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
                    placeholder="Brief description of your clinic and services"
                  />
                </div>

                <InputField
                  variant="auth"
                  label="Year Established"
                  placeholder="e.g., 2015"
                  name="year_established"
                  type="number"
                  value={formData.year_established}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />

                <h3 className="mb-3 mt-6 text-lg font-semibold text-navy-700 dark:text-white">
                  Contact Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    variant="auth"
                    label="Email Address *"
                    type="email"
                    placeholder="info@clinic.co.za"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />

                  <InputField
                    variant="auth"
                    label="Website"
                    type="url"
                    placeholder="https://clinic.co.za"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <InputField
                    variant="auth"
                    label="Primary Phone *"
                    type="tel"
                    placeholder="+27 11 789 4561"
                    name="primary_phone"
                    value={formData.primary_phone}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />

                  <InputField
                    variant="auth"
                    label="Secondary Phone"
                    type="tel"
                    placeholder="+27 11 789 4562"
                    name="secondary_phone"
                    value={formData.secondary_phone}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />

                  <InputField
                    variant="auth"
                    label="Emergency Phone"
                    type="tel"
                    placeholder="+27 11 789 4563"
                    name="emergency_phone"
                    value={formData.emergency_phone}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Address & Location */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
                  Address & Location
                </h2>

                <InputField
                  variant="auth"
                  label="Physical Address *"
                  placeholder="123 Medical Street, Sandton"
                  name="physical_address"
                  value={formData.physical_address}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <InputField
                    variant="auth"
                    label="City *"
                    placeholder="Johannesburg"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />

                  <div>
                    <label className="mb-2 block text-sm font-bold text-navy-700 dark:text-white">
                      Province *
                    </label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-700 outline-none focus:border-brand-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
                      required
                    >
                      <option value="">Select province</option>
                      {PROVINCES.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>

                  <InputField
                    variant="auth"
                    label="Postal Code"
                    placeholder="2196"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <h3 className="mb-3 mt-6 text-lg font-semibold text-navy-700 dark:text-white">
                  Operating Hours
                </h3>

                <div className="space-y-3">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <label className="w-28 text-sm font-medium capitalize text-navy-700 dark:text-white">
                        {day}
                      </label>
                      <input
                        type="text"
                        value={formData.operating_hours[day]}
                        onChange={(e) =>
                          handleOperatingHoursChange(day, e.target.value)
                        }
                        disabled={isLoading}
                        placeholder="e.g., 08:00-18:00 or Closed"
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-navy-700 outline-none focus:border-brand-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Services & Facilities */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
                  Services & Facilities
                </h2>

                <div>
                  <label className="mb-3 block text-sm font-bold text-navy-700 dark:text-white">
                    Services Offered *
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {SERVICES.map((service) => (
                      <label
                        key={service.value}
                        className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-navy-700 dark:hover:bg-navy-900"
                      >
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service.value)}
                          onChange={() =>
                            handleMultiSelect("services", service.value)
                          }
                          disabled={isLoading}
                          className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                        />
                        <span className="ml-2 text-sm text-navy-700 dark:text-white">
                          {service.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-bold text-navy-700 dark:text-white">
                    Specialties
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {SPECIALTIES.map((specialty) => (
                      <label
                        key={specialty.value}
                        className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-navy-700 dark:hover:bg-navy-900"
                      >
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(
                            specialty.value
                          )}
                          onChange={() =>
                            handleMultiSelect("specialties", specialty.value)
                          }
                          disabled={isLoading}
                          className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                        />
                        <span className="ml-2 text-sm text-navy-700 dark:text-white">
                          {specialty.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-bold text-navy-700 dark:text-white">
                    Facilities Available
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {FACILITIES.map((facility) => (
                      <label
                        key={facility.value}
                        className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-navy-700 dark:hover:bg-navy-900"
                      >
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility.value)}
                          onChange={() =>
                            handleMultiSelect("facilities", facility.value)
                          }
                          disabled={isLoading}
                          className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                        />
                        <span className="ml-2 text-sm text-navy-700 dark:text-white">
                          {facility.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-bold text-navy-700 dark:text-white">
                    Languages Spoken
                  </label>
                  <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
                    {LANGUAGES.map((lang) => (
                      <label
                        key={lang.value}
                        className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-navy-700 dark:hover:bg-navy-900"
                      >
                        <input
                          type="checkbox"
                          checked={formData.languages_spoken.includes(
                            lang.value
                          )}
                          onChange={() =>
                            handleMultiSelect("languages_spoken", lang.value)
                          }
                          disabled={isLoading}
                          className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                        />
                        <span className="ml-2 text-sm text-navy-700 dark:text-white">
                          {lang.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <InputField
                    variant="auth"
                    label="Bed Count"
                    type="number"
                    placeholder="e.g., 25"
                    name="bed_count"
                    value={formData.bed_count}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />

                  <InputField
                    variant="auth"
                    label="Patient Capacity"
                    type="number"
                    placeholder="e.g., 1500"
                    name="patient_capacity"
                    value={formData.patient_capacity}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />

                  <InputField
                    variant="auth"
                    label="Avg Wait Time (min)"
                    type="number"
                    placeholder="e.g., 30"
                    name="average_wait_time_minutes"
                    value={formData.average_wait_time_minutes}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Payment & Accreditation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
                  Payment & Accreditation
                </h2>

                <div>
                  <label className="mb-3 block text-sm font-bold text-navy-700 dark:text-white">
                    Payment Methods Accepted *
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.value}
                        className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-navy-700 dark:hover:bg-navy-900"
                      >
                        <input
                          type="checkbox"
                          checked={formData.payment_methods.includes(
                            method.value
                          )}
                          onChange={() =>
                            handleMultiSelect("payment_methods", method.value)
                          }
                          disabled={isLoading}
                          className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                        />
                        <span className="ml-2 text-sm text-navy-700 dark:text-white">
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center rounded-lg border border-gray-200 p-4 dark:border-navy-700">
                  <input
                    type="checkbox"
                    id="accepts_medical_aid"
                    name="accepts_medical_aid"
                    checked={formData.accepts_medical_aid}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <label
                    htmlFor="accepts_medical_aid"
                    className="ml-3 text-sm font-medium text-navy-700 dark:text-white"
                  >
                    Accepts Medical Aid
                  </label>
                </div>

                {formData.accepts_medical_aid && (
                  <InputField
                    variant="auth"
                    label="Medical Aid Providers (comma-separated)"
                    placeholder="e.g., Discovery, Bonitas, Momentum"
                    name="medical_aid_providers"
                    value={formData.medical_aid_providers}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                )}

                <h3 className="mb-3 mt-6 text-lg font-semibold text-navy-700 dark:text-white">
                  Accreditation Details
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    variant="auth"
                    label="Accreditation Number"
                    placeholder="e.g., HPCSA-12345-2023"
                    name="accreditation_number"
                    value={formData.accreditation_number}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />

                  <InputField
                    variant="auth"
                    label="Accreditation Body"
                    placeholder="e.g., HPCSA"
                    name="accreditation_body"
                    value={formData.accreditation_body}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <InputField
                  variant="auth"
                  label="Accreditation Expiry Date"
                  type="date"
                  name="accreditation_expiry"
                  value={formData.accreditation_expiry}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />

                <h3 className="mb-3 mt-6 text-lg font-semibold text-navy-700 dark:text-white">
                  Contact Person
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    variant="auth"
                    label="Contact Person Name"
                    placeholder="Dr. John Smith"
                    name="contact_person_name"
                    value={formData.contact_person_name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />

                  <InputField
                    variant="auth"
                    label="Role/Title"
                    placeholder="Practice Manager"
                    name="contact_person_role"
                    value={formData.contact_person_role}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    variant="auth"
                    label="Contact Phone"
                    type="tel"
                    placeholder="+27 82 123 4567"
                    name="contact_person_phone"
                    value={formData.contact_person_phone}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />

                  <InputField
                    variant="auth"
                    label="Contact Email"
                    type="email"
                    placeholder="contact@clinic.co.za"
                    name="contact_person_email"
                    value={formData.contact_person_email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="rounded-xl border border-gray-300 px-6 py-3 text-navy-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-700 dark:text-white dark:hover:bg-navy-900"
                >
                  Back
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="ml-auto rounded-xl bg-brand-500 px-6 py-3 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ml-auto rounded-xl bg-brand-500 px-6 py-3 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="mr-2 h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Registration"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            ℹ️ Your clinic registration will be reviewed by our admin team.
            You'll receive an email notification once it's approved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClinicRegistration;
