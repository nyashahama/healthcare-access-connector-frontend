import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "components/fields/InputField";
import { useToast } from "hooks/useToast";
import { useProvider } from "hooks/useProvider";
import { MdHealthAndSafety, MdArrowBack, MdCheckCircle } from "react-icons/md";

const ProviderSignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Clinic Information
    clinic_name: "",
    clinic_type: "public_health_clinic",
    registration_number: "",
    accreditation_number: "",

    // Contact Information
    primary_phone: "",
    secondary_phone: "",
    emergency_phone: "",
    email: "",
    website: "",

    // Location Details
    physical_address: "",
    city: "",
    province: "",
    postal_code: "",
    country: "",
    latitude: "",
    longitude: "",
    google_place_id: "",

    // Additional Details
    description: "",
    year_established: "",
    ownership_type: "private",
    bed_count: "",

    // Operating Hours (will be converted to JSON)
    operating_hours_monday_open: "08:00",
    operating_hours_monday_close: "17:00",
    operating_hours_tuesday_open: "08:00",
    operating_hours_tuesday_close: "17:00",
    operating_hours_wednesday_open: "08:00",
    operating_hours_wednesday_close: "17:00",
    operating_hours_thursday_open: "08:00",
    operating_hours_thursday_close: "17:00",
    operating_hours_friday_open: "08:00",
    operating_hours_friday_close: "17:00",
    operating_hours_saturday_open: "",
    operating_hours_saturday_close: "",
    operating_hours_sunday: "closed",

    // Services and Features (will be converted to arrays)
    services: [],
    specialties: [],
    languages_spoken: [],
    facilities: [],

    // Payment and Medical Aid
    accepts_medical_aid: true,
    medical_aid_providers: [],
    payment_methods: [],
    fee_structure: "insurance_based",

    // Accreditation
    accreditation_body: "",
    accreditation_expiry: "",

    // Performance Metrics
    patient_capacity: "",
    average_wait_time_minutes: "",

    // Contact Person
    contact_person_name: "",
    contact_person_role: "",
    contact_person_phone: "",
    contact_person_email: "",

    // Terms
    termsAccepted: false,
  });

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { registerClinic, loading } = useProvider();

  const clinicTypeOptions = [
    { value: "public_health_clinic", label: "Public Health Clinic" },
    { value: "private_clinic", label: "Private Clinic" },
    { value: "community_health_center", label: "Community Health Center" },
    { value: "mobile_clinic", label: "Mobile Clinic" },
  ];

  const ownershipTypeOptions = [
    { value: "private", label: "Private" },
    { value: "public", label: "Public" },
    { value: "non_profit", label: "Non-Profit" },
    { value: "government", label: "Government" },
  ];

  const feeStructureOptions = [
    { value: "insurance_based", label: "Insurance Based" },
    { value: "sliding_scale", label: "Sliding Scale" },
    { value: "fixed_rate", label: "Fixed Rate" },
    { value: "free", label: "Free" },
  ];

  const serviceOptions = [
    "general_medicine",
    "pediatrics",
    "dermatology",
    "cardiology",
    "radiology",
    "orthopedics",
    "gynecology",
    "dentistry",
    "ophthalmology",
    "psychiatry",
  ];

  const specialtyOptions = [
    "diabetes_management",
    "hypertension",
    "asthma",
    "arthritis",
    "mental_health",
    "maternal_health",
    "child_health",
    "chronic_disease",
  ];

  const languageOptions = [
    "English",
    "Afrikaans",
    "Zulu",
    "Xhosa",
    "Spanish",
    "French",
    "Portuguese",
  ];

  const facilityOptions = [
    "xray",
    "ultrasound",
    "laboratory",
    "pharmacy",
    "emergency_room",
    "operating_theater",
    "icu",
    "maternity_ward",
  ];

  const paymentMethodOptions = [
    "cash",
    "credit_card",
    "debit_card",
    "insurance",
    "check",
    "mobile_payment",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => {
      const currentValues = prev[name] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

  const validateStep1 = () => {
    if (!formData.clinic_name.trim()) {
      showToast("Please enter clinic name", "warning");
      return false;
    }
    if (!formData.physical_address.trim()) {
      showToast("Please enter physical address", "warning");
      return false;
    }
    if (!formData.country.trim()) {
      showToast("Please enter country", "warning");
      return false;
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      showToast("Please enter a valid email", "warning");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    // Operating hours validation is optional
    return true;
  };

  const validateStep3 = () => {
    if (!formData.termsAccepted) {
      showToast("Please accept terms and conditions", "warning");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      handleSubmit();
    }
  };

  const buildOperatingHours = () => {
    const hours = {};
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    days.forEach((day) => {
      if (day === "sunday" && formData.operating_hours_sunday === "closed") {
        hours[day] = "closed";
      } else {
        const openKey = `operating_hours_${day}_open`;
        const closeKey = `operating_hours_${day}_close`;

        if (formData[openKey] && formData[closeKey]) {
          hours[day] = {
            open: formData[openKey],
            close: formData[closeKey],
          };
        } else if (!formData[openKey] && !formData[closeKey]) {
          hours[day] = "closed";
        }
      }
    });

    return Object.keys(hours).length > 0 ? hours : undefined;
  };

  const handleSubmit = async () => {
    try {
      // Build the clinic registration payload
      const clinicData = {
        clinic_name: formData.clinic_name,
        clinic_type: formData.clinic_type,
        physical_address: formData.physical_address,
        country: formData.country,
        accepts_medical_aid: formData.accepts_medical_aid,
      };

      // Add optional string fields
      const optionalStringFields = [
        "registration_number",
        "accreditation_number",
        "primary_phone",
        "secondary_phone",
        "emergency_phone",
        "email",
        "website",
        "city",
        "province",
        "postal_code",
        "google_place_id",
        "description",
        "ownership_type",
        "fee_structure",
        "accreditation_body",
        "contact_person_name",
        "contact_person_role",
        "contact_person_phone",
        "contact_person_email",
      ];

      optionalStringFields.forEach((field) => {
        if (formData[field] && formData[field].trim() !== "") {
          clinicData[field] = formData[field];
        }
      });

      // Add numeric fields
      if (formData.latitude && formData.latitude !== "") {
        clinicData.latitude = parseFloat(formData.latitude);
      }
      if (formData.longitude && formData.longitude !== "") {
        clinicData.longitude = parseFloat(formData.longitude);
      }
      if (formData.year_established && formData.year_established !== "") {
        clinicData.year_established = parseInt(formData.year_established, 10);
      }
      if (formData.bed_count && formData.bed_count !== "") {
        clinicData.bed_count = parseInt(formData.bed_count, 10);
      }
      if (formData.patient_capacity && formData.patient_capacity !== "") {
        clinicData.patient_capacity = parseInt(formData.patient_capacity, 10);
      }
      if (
        formData.average_wait_time_minutes &&
        formData.average_wait_time_minutes !== ""
      ) {
        clinicData.average_wait_time_minutes = parseInt(
          formData.average_wait_time_minutes,
          10
        );
      }

      // Add operating hours
      const operatingHours = buildOperatingHours();
      if (operatingHours) {
        clinicData.operating_hours = operatingHours;
      }

      // Add array fields (only if they have values)
      if (formData.services && formData.services.length > 0) {
        clinicData.services = formData.services;
      }
      if (formData.specialties && formData.specialties.length > 0) {
        clinicData.specialties = formData.specialties;
      }
      if (formData.languages_spoken && formData.languages_spoken.length > 0) {
        clinicData.languages_spoken = formData.languages_spoken;
      }
      if (formData.facilities && formData.facilities.length > 0) {
        clinicData.facilities = formData.facilities;
      }
      if (
        formData.medical_aid_providers &&
        formData.medical_aid_providers.length > 0
      ) {
        clinicData.medical_aid_providers = formData.medical_aid_providers;
      }
      if (formData.payment_methods && formData.payment_methods.length > 0) {
        clinicData.payment_methods = formData.payment_methods;
      }

      // Add accreditation expiry date if provided
      if (
        formData.accreditation_expiry &&
        formData.accreditation_expiry !== ""
      ) {
        clinicData.accreditation_expiry = new Date(
          formData.accreditation_expiry
        ).toISOString();
      }

      // Submit the clinic registration
      const result = await registerClinic(clinicData);

      if (result.success) {
        setStep(4);
        showToast("Clinic registered successfully!", "success");
      } else {
        showToast(result.error || "Registration failed", "error");
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error");
      console.error("Registration error:", error);
    }
  };

  // Render different steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Basic Clinic Information
            </h3>

            <InputField
              variant="auth"
              label="Clinic Name *"
              placeholder="e.g., Green Valley Medical Center"
              name="clinic_name"
              value={formData.clinic_name}
              onChange={handleInputChange}
              required
              disabled={loading}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Clinic Type *
              </label>
              <select
                name="clinic_type"
                value={formData.clinic_type}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-600 dark:bg-gray-800"
                disabled={loading}
              >
                {clinicTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                variant="auth"
                label="Registration Number"
                placeholder="REG-12345"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleInputChange}
                disabled={loading}
              />
              <InputField
                variant="auth"
                label="Accreditation Number"
                placeholder="ACC-67890"
                name="accreditation_number"
                value={formData.accreditation_number}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <InputField
              variant="auth"
              label="Physical Address *"
              placeholder="123 Health Street"
              name="physical_address"
              value={formData.physical_address}
              onChange={handleInputChange}
              required
              disabled={loading}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                variant="auth"
                label="City"
                placeholder="Springfield"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={loading}
              />
              <InputField
                variant="auth"
                label="Province/State"
                placeholder="IL"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                variant="auth"
                label="Postal Code"
                placeholder="62701"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                disabled={loading}
              />
              <InputField
                variant="auth"
                label="Country *"
                placeholder="USA"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <h4 className="text-md mt-6 font-semibold text-gray-900 dark:text-white">
              Contact Information
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                variant="auth"
                label="Primary Phone"
                placeholder="+27 69 785 2170"
                name="primary_phone"
                value={formData.primary_phone}
                onChange={handleInputChange}
                type="tel"
                disabled={loading}
              />
              <InputField
                variant="auth"
                label="Secondary Phone"
                placeholder="+27 69 785 2171"
                name="secondary_phone"
                value={formData.secondary_phone}
                onChange={handleInputChange}
                type="tel"
                disabled={loading}
              />
            </div>

            <InputField
              variant="auth"
              label="Emergency Phone"
              placeholder="+27 69 785 2178"
              name="emergency_phone"
              value={formData.emergency_phone}
              onChange={handleInputChange}
              type="tel"
              disabled={loading}
            />

            <InputField
              variant="auth"
              label="Email Address"
              placeholder="info@greenvalleymedical.com"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              disabled={loading}
            />

            <InputField
              variant="auth"
              label="Website"
              placeholder="https://greenvalleymedical.com"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              type="url"
              disabled={loading}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Clinic Details & Services
            </h3>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="A comprehensive medical facility offering primary care and specialty services"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-600 dark:bg-gray-800"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <InputField
                variant="auth"
                label="Year Established"
                placeholder="1995"
                name="year_established"
                value={formData.year_established}
                onChange={handleInputChange}
                type="number"
                disabled={loading}
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ownership Type
                </label>
                <select
                  name="ownership_type"
                  value={formData.ownership_type}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-600 dark:bg-gray-800"
                  disabled={loading}
                >
                  {ownershipTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <InputField
                variant="auth"
                label="Bed Count"
                placeholder="50"
                name="bed_count"
                value={formData.bed_count}
                onChange={handleInputChange}
                type="number"
                disabled={loading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Services Offered
              </label>
              <div className="grid grid-cols-2 gap-2">
                {serviceOptions.map((service) => (
                  <label key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() =>
                        handleMultiSelectChange("services", service)
                      }
                      className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {service
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Specialties
              </label>
              <div className="grid grid-cols-2 gap-2">
                {specialtyOptions.map((specialty) => (
                  <label
                    key={specialty}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty)}
                      onChange={() =>
                        handleMultiSelectChange("specialties", specialty)
                      }
                      className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {specialty
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Facilities Available
              </label>
              <div className="grid grid-cols-2 gap-2">
                {facilityOptions.map((facility) => (
                  <label key={facility} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.facilities.includes(facility)}
                      onChange={() =>
                        handleMultiSelectChange("facilities", facility)
                      }
                      className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {facility
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Languages Spoken
              </label>
              <div className="grid grid-cols-2 gap-2">
                {languageOptions.map((language) => (
                  <label key={language} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.languages_spoken.includes(language)}
                      onChange={() =>
                        handleMultiSelectChange("languages_spoken", language)
                      }
                      className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {language}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <h4 className="text-md mt-6 font-semibold text-gray-900 dark:text-white">
              Payment & Insurance
            </h4>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="accepts_medical_aid"
                name="accepts_medical_aid"
                checked={formData.accepts_medical_aid}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                disabled={loading}
              />
              <label
                htmlFor="accepts_medical_aid"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Accepts Medical Aid
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Methods
              </label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethodOptions.map((method) => (
                  <label key={method} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.payment_methods.includes(method)}
                      onChange={() =>
                        handleMultiSelectChange("payment_methods", method)
                      }
                      className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {method
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fee Structure
              </label>
              <select
                name="fee_structure"
                value={formData.fee_structure}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-600 dark:bg-gray-800"
                disabled={loading}
              >
                {feeStructureOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                variant="auth"
                label="Patient Capacity"
                placeholder="200"
                name="patient_capacity"
                value={formData.patient_capacity}
                onChange={handleInputChange}
                type="number"
                disabled={loading}
              />
              <InputField
                variant="auth"
                label="Avg Wait Time (minutes)"
                placeholder="15"
                name="average_wait_time_minutes"
                value={formData.average_wait_time_minutes}
                onChange={handleInputChange}
                type="number"
                disabled={loading}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Contact Person & Final Details
            </h3>

            <InputField
              variant="auth"
              label="Contact Person Name"
              placeholder="Dr. Sarah Johnson"
              name="contact_person_name"
              value={formData.contact_person_name}
              onChange={handleInputChange}
              disabled={loading}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                variant="auth"
                label="Role"
                placeholder="Medical Director"
                name="contact_person_role"
                value={formData.contact_person_role}
                onChange={handleInputChange}
                disabled={loading}
              />
              <InputField
                variant="auth"
                label="Phone"
                placeholder="+27 69 785 2179"
                name="contact_person_phone"
                value={formData.contact_person_phone}
                onChange={handleInputChange}
                type="tel"
                disabled={loading}
              />
            </div>

            <InputField
              variant="auth"
              label="Email"
              placeholder="sarah.johnson@greenvalleymedical.com"
              name="contact_person_email"
              value={formData.contact_person_email}
              onChange={handleInputChange}
              type="email"
              disabled={loading}
            />

            <h4 className="text-md mt-6 font-semibold text-gray-900 dark:text-white">
              Accreditation (Optional)
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                variant="auth"
                label="Accreditation Body"
                placeholder="Joint Commission"
                name="accreditation_body"
                value={formData.accreditation_body}
                onChange={handleInputChange}
                disabled={loading}
              />
              <InputField
                variant="auth"
                label="Accreditation Expiry"
                name="accreditation_expiry"
                value={formData.accreditation_expiry}
                onChange={handleInputChange}
                type="date"
                disabled={loading}
              />
            </div>

            <h4 className="text-md mt-6 font-semibold text-gray-900 dark:text-white">
              Location Coordinates (Optional)
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <InputField
                variant="auth"
                label="Latitude"
                placeholder="39.7817"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                type="number"
                step="any"
                disabled={loading}
              />
              <InputField
                variant="auth"
                label="Longitude"
                placeholder="-89.6501"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                type="number"
                step="any"
                disabled={loading}
              />
              <InputField
                variant="auth"
                label="Google Place ID"
                placeholder="ChIJ..."
                name="google_place_id"
                value={formData.google_place_id}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <label htmlFor="termsAccepted" className="ml-3 text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    I agree to the Terms & Conditions and Privacy Policy *
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-green-100 p-4 dark:bg-green-900/30">
              <MdCheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>

            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Registration Successful!
            </h3>

            <div className="mb-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <p className="text-green-800 dark:text-green-200">
                <strong>Your clinic has been registered successfully!</strong>
              </p>
              <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                Your clinic is now pending verification. Our team will review
                your information and contact you shortly.
              </p>
            </div>

            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Thank you for registering with HealthConnect. You can now proceed
              to set up your services and staff.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/admin")}
                className="w-full rounded-xl bg-brand-500 py-3 text-white hover:bg-brand-600"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                Return to Home
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-500 p-3">
            <MdHealthAndSafety className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-navy-700 dark:text-white">
            Clinic Registration
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join HealthConnect as a healthcare provider
          </p>
        </div>

        {/* Progress Steps (only for steps 1-3) */}
        {step < 4 && (
          <div className="relative mb-6">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="z-10 flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step >= stepNum
                        ? "bg-brand-500 text-white"
                        : "bg-gray-200 text-gray-400 dark:bg-gray-700"
                    }`}
                  >
                    {stepNum}
                  </div>
                  <span className="mt-1 text-xs">
                    {stepNum === 1
                      ? "Basic Info"
                      : stepNum === 2
                      ? "Services"
                      : "Contact"}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 dark:bg-gray-700"
              style={{ zIndex: 0 }}
            ></div>
          </div>
        )}

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-800">
          {renderStep()}

          {/* Action Buttons (only for steps 1-3) */}
          {step < 4 && (
            <div className="mt-8 space-y-4">
              <button
                onClick={handleNextStep}
                disabled={loading}
                className="linear w-full rounded-xl bg-brand-500 py-3 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
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
                    {step === 3 ? "Submitting..." : "Processing..."}
                  </span>
                ) : step === 3 ? (
                  "Submit Registration"
                ) : (
                  "Continue"
                )}
              </button>

              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                  className="linear w-full rounded-xl border border-gray-300 bg-white py-3 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  <MdArrowBack className="mr-2 inline h-4 w-4" />
                  Back
                </button>
              )}
            </div>
          )}

          {/* Sign In Link */}
          {step < 4 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/auth/sign-in"
                  className="font-medium text-brand-500 hover:text-brand-600"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Emergency Notice */}
        <div className="mt-6 rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex items-start">
            <MdHealthAndSafety className="mr-2 h-5 w-5 text-red-500 dark:text-red-300" />
            <div>
              <h4 className="text-sm font-bold text-red-800 dark:text-red-300">
                Medical Emergency?
              </h4>
              <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                Call <strong>10177</strong> or go to the nearest emergency room
                immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderSignUp;
