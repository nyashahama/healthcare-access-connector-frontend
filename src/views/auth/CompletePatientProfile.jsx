import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "components/fields/InputField";
import { useToast } from "hooks/useToast";
import { usePatient } from "hooks/usePatient";
import {
  FaUser,
  FaCalendarAlt,
  FaVenusMars,
  FaMapMarkerAlt,
  FaGlobe,
  FaPhone,
  FaStethoscope,
} from "react-icons/fa";

const CompletePatientProfile = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: "",
    lastName: "",
    preferredName: "",
    dateOfBirth: "",
    gender: "",
    preferredGenderPronouns: "",

    // Contact & Location
    primaryAddress: "",
    city: "",
    province: "",
    country: "South Africa",
    postalCode: "",
    homeLanguage: "",
    requiresInterpreter: false,
    preferredCommunicationMethod: "sms", // sms, email, phone

    // Medical Information
    hasMedicalAid: false,
    medicalAidNumber: "",
    medicalAidProvider: "",
    nationalIdNumber: "",

    // Demographic Information
    employmentStatus: "",
    educationLevel: "",
    householdIncomeRange: "",

    // Preferences
    timezone: "Africa/Johannesburg",
    acceptsMarketingEmails: false,
    languagePreferences: ["English"],
  });

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { upsertPatientProfile } = usePatient();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      showToast("First name is required", "warning");
      return false;
    }
    if (!formData.lastName.trim()) {
      showToast("Last name is required", "warning");
      return false;
    }
    if (!formData.dateOfBirth) {
      showToast("Date of birth is required", "warning");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.primaryAddress.trim()) {
      showToast("Address is required", "warning");
      return false;
    }
    if (!formData.city.trim()) {
      showToast("City is required", "warning");
      return false;
    }
    if (!formData.country.trim()) {
      showToast("Country is required", "warning");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Map formData to snake_case for backend
      // Debug: log what we're sending

      const userStr = localStorage.getItem("user");

      const user = JSON.parse(userStr);

      const profileData = {
        user_id: user ? user.id : undefined,
        first_name: formData.firstName,
        last_name: formData.lastName,
        preferred_name: formData.preferredName || undefined,
        date_of_birth: formData.dateOfBirth
          ? formData.dateOfBirth + "T00:00:00Z"
          : undefined,
        gender: formData.gender || undefined,
        preferred_gender_pronouns:
          formData.preferredGenderPronouns || undefined,
        primary_address: formData.primaryAddress,
        city: formData.city,
        province: formData.province,
        country: formData.country, // This is CRITICAL
        postal_code: formData.postalCode || undefined,
        home_language: formData.homeLanguage || undefined,
        requires_interpreter: formData.requiresInterpreter,
        preferred_communication_method: formData.preferredCommunicationMethod,
        has_medical_aid: formData.hasMedicalAid,
        medical_aid_number: formData.hasMedicalAid
          ? formData.medicalAidNumber
          : undefined,
        medical_aid_provider: formData.hasMedicalAid
          ? formData.medicalAidProvider
          : undefined,
        national_id_number: formData.nationalIdNumber || undefined,
        employment_status: formData.employmentStatus || undefined,
        education_level: formData.educationLevel || undefined,
        household_income_range: formData.householdIncomeRange || undefined,
        timezone: formData.timezone,
        accepts_marketing_emails: formData.acceptsMarketingEmails,
        language_preferences: formData.languagePreferences,
      };

      const result = await upsertPatientProfile(profileData);

      if (result.success) {
        showToast("Profile completed successfully!", "success");
        setTimeout(() => {
          navigate("/patient/dashboard");
        }, 1500);
      } else {
        showToast(result.error || "Failed to save profile", "error");
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error");
      console.error("Profile submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center space-x-3">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                <FaUser className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tell us about yourself (Takes ~2 minutes)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                variant="auth"
                label="First Name *"
                placeholder="John"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              <InputField
                variant="auth"
                label="Last Name *"
                placeholder="Doe"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <InputField
              variant="auth"
              label="Preferred Name (Optional)"
              placeholder="What should we call you?"
              name="preferredName"
              value={formData.preferredName}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Birth *
                </label>
                <InputField
                  variant="auth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  disabled={isLoading}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <InputField
              variant="auth"
              label="Preferred Pronouns (Optional)"
              placeholder="e.g., he/him, she/her, they/them"
              name="preferredGenderPronouns"
              value={formData.preferredGenderPronouns}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hasMedicalAid"
                name="hasMedicalAid"
                checked={formData.hasMedicalAid}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                disabled={isLoading}
              />
              <label htmlFor="hasMedicalAid" className="text-sm">
                I have medical aid/insurance
              </label>
            </div>

            {formData.hasMedicalAid && (
              <div className="space-y-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <h4 className="font-medium text-green-800 dark:text-green-300">
                  Medical Aid Details
                </h4>
                <InputField
                  variant="auth"
                  label="Medical Aid Number"
                  placeholder="M123456789"
                  name="medicalAidNumber"
                  value={formData.medicalAidNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <InputField
                  variant="auth"
                  label="Medical Aid Provider"
                  placeholder="e.g., Discovery, Momentum"
                  name="medicalAidProvider"
                  value={formData.medicalAidProvider}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            )}

            <InputField
              variant="auth"
              label="South African ID Number (Optional)"
              placeholder="YYMMDDSSSSCAZ"
              name="nationalIdNumber"
              value={formData.nationalIdNumber}
              onChange={handleInputChange}
              disabled={isLoading}
              helpText="13-digit ID number for faster service registration"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center space-x-3">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                <FaMapMarkerAlt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Location & Preferences
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Help us connect you with local services
                </p>
              </div>
            </div>

            <InputField
              variant="auth"
              label="Primary Address *"
              placeholder="Street address"
              name="primaryAddress"
              value={formData.primaryAddress}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                variant="auth"
                label="City *"
                placeholder="e.g., Johannesburg"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <InputField
                variant="auth"
                label="Province"
                placeholder="e.g., Gauteng"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                variant="auth"
                label="Country *"
                placeholder="South Africa"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <InputField
                variant="auth"
                label="Postal Code"
                placeholder="e.g., 2196"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Home Language
              </label>
              <select
                name="homeLanguage"
                value={formData.homeLanguage}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                disabled={isLoading}
              >
                <option value="">Select language</option>
                <option value="english">English</option>
                <option value="afrikaans">Afrikaans</option>
                <option value="zulu">Zulu</option>
                <option value="xhosa">Xhosa</option>
                {/* Add more languages as needed */}
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="requiresInterpreter"
                name="requiresInterpreter"
                checked={formData.requiresInterpreter}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                disabled={isLoading}
              />
              <label htmlFor="requiresInterpreter" className="text-sm">
                I require an interpreter
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Preferred Communication Method
              </label>
              <div className="grid grid-cols-3 gap-4">
                {["sms", "email", "phone"].map((method) => (
                  <label key={method} className="flex flex-col items-center">
                    <input
                      type="radio"
                      name="preferredCommunicationMethod"
                      value={method}
                      checked={formData.preferredCommunicationMethod === method}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="mb-2 h-5 w-5"
                    />
                    {method === "sms" && <FaGlobe className="mb-2 h-5 w-5" />}
                    {method === "email" && <FaGlobe className="mb-2 h-5 w-5" />}
                    {method === "phone" && <FaPhone className="mb-2 h-5 w-5" />}
                    <span className="text-sm capitalize">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional fields like employment, education, etc., can be added here if needed */}
          </div>
        );
    }
  };

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2].map((stepNum) => (
              <div key={stepNum} className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    step >= stepNum
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800"
                  }`}
                >
                  {stepNum}
                </div>
                <span className="mt-2 text-xs">
                  {stepNum === 1 ? "Personal Info" : "Location & Contact"}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-4">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gray-200 dark:bg-gray-700"></div>
            <div
              className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-brand-500 transition-all duration-300"
              style={{ width: `${(step - 1) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-800">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complete Your Patient Profile
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Help us personalize your healthcare experience
            </p>
          </div>

          {renderStep()}

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <button
              onClick={handleNextStep}
              disabled={isLoading}
              className="linear w-full rounded-xl bg-brand-500 py-3 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                  {step === 2 ? "Completing Profile..." : "Continue"}
                </span>
              ) : step === 2 ? (
                "Complete Profile"
              ) : (
                "Continue"
              )}
            </button>

            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={isLoading}
                className="linear w-full rounded-xl border border-gray-300 bg-white py-3 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                Back
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate("/patient/dashboard")}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400"
              disabled={isLoading}
            >
              Skip and complete later
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-gray-800">
              <span className="mr-2">Step {step} of 2</span>
              <span className="font-medium">
                {step === 1 ? "Basic Information" : "Additional Details"}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              This helps us provide better healthcare recommendations
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-start">
            <FaStethoscope className="mr-3 mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">
                Your Privacy Matters
              </h4>
              <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                All information is encrypted and stored securely in compliance
                with POPIA. We only share information with healthcare providers
                when you book appointments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletePatientProfile;
