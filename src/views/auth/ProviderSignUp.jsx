import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "components/fields/InputField";
import { useToast } from "hooks/useToast";
import { useAuth } from "hooks/useAuth";
import { MdHealthAndSafety, MdArrowBack, MdCheckCircle } from "react-icons/md";

const ProviderSignUp = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [formData, setFormData] = useState({
    // Step 1: Clinic Details
    clinicName: "",
    clinicType: "general",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    contactPerson: "",

    // Step 2: Provider Info
    providerName: "",
    providerId: "",
    providerType: "doctor",
    licenseNumber: "",
    specialization: "",

    // Step 3: Documents (to be handled with file upload)
    termsAccepted: false,
  });

  const [documents, setDocuments] = useState({
    license: null,
    certificate: null,
    idDocument: null,
  });

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { register } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    setDocuments((prev) => ({
      ...prev,
      [docType]: file,
    }));
  };

  const validateStep1 = () => {
    if (!formData.clinicName.trim()) {
      showToast("Please enter clinic name", "warning");
      return false;
    }
    if (!formData.address.trim()) {
      showToast("Please enter clinic address", "warning");
      return false;
    }
    if (!formData.phone.trim()) {
      showToast("Please enter phone number", "warning");
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      showToast("Please enter valid email", "warning");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.providerName.trim()) {
      showToast("Please enter provider name", "warning");
      return false;
    }
    if (!formData.licenseNumber.trim()) {
      showToast("Please enter license number", "warning");
      return false;
    }
    return true;
  };

  const validateDocuments = () => {
    if (!documents.license || !documents.certificate || !documents.idDocument) {
      showToast("Please upload all required documents", "warning");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateDocuments()) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!formData.termsAccepted) {
      showToast("Please accept terms and conditions", "warning");
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for file upload
      const formDataObj = new FormData();

      // Append form data
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });

      // Append files
      Object.keys(documents).forEach((key) => {
        if (documents[key]) {
          formDataObj.append(key, documents[key]);
        }
      });

      formDataObj.append("role", "provider");
      formDataObj.append("verificationStatus", "pending");

      const result = await register(formDataObj);

      if (result.success) {
        setVerificationStatus("pending");
        setStep(4);
        showToast("Registration submitted for verification!", "success");
      } else {
        showToast(result.error || "Registration failed", "error");
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render different steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Clinic Information
            </h3>

            <InputField
              variant="auth"
              label="Clinic Name *"
              placeholder="e.g., City Health Clinic"
              name="clinicName"
              value={formData.clinicName}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Clinic Type *
              </label>
              <select
                name="clinicType"
                value={formData.clinicType}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-600 dark:bg-gray-800"
                disabled={isLoading}
              >
                <option value="general">General Practice</option>
                <option value="specialist">Specialist Clinic</option>
                <option value="hospital">Hospital</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="laboratory">Laboratory</option>
              </select>
            </div>

            <InputField
              variant="auth"
              label="Address *"
              placeholder="Street address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                variant="auth"
                label="City"
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <InputField
                variant="auth"
                label="Postal Code"
                placeholder="Postal code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <InputField
              variant="auth"
              label="Phone Number *"
              placeholder="071 234 5678"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              type="tel"
              required
              disabled={isLoading}
            />

            <InputField
              variant="auth"
              label="Email Address *"
              placeholder="clinic@example.com"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              required
              disabled={isLoading}
            />

            <InputField
              variant="auth"
              label="Contact Person"
              placeholder="Full name"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Provider Information
            </h3>

            <InputField
              variant="auth"
              label="Full Name *"
              placeholder="Dr. John Smith"
              name="providerName"
              value={formData.providerName}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />

            <InputField
              variant="auth"
              label="HPCSA/Provider ID *"
              placeholder="Professional registration number"
              name="providerId"
              value={formData.providerId}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Provider Type *
                </label>
                <select
                  name="providerType"
                  value={formData.providerType}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-600 dark:bg-gray-800"
                  disabled={isLoading}
                >
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="specialist">Specialist</option>
                </select>
              </div>

              <InputField
                variant="auth"
                label="License Number *"
                placeholder="Practice license number"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <InputField
              variant="auth"
              label="Specialization"
              placeholder="e.g., Pediatrics, Cardiology"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Document Upload
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please upload the following documents for verification:
            </p>

            {[
              {
                id: "license",
                label: "Professional License/Certificate *",
                description: "Clear copy of valid license",
                accept: ".pdf,.jpg,.jpeg,.png",
              },
              {
                id: "certificate",
                label: "HPCSA/Professional Certificate *",
                description: "Registration certificate",
                accept: ".pdf,.jpg,.jpeg,.png",
              },
              {
                id: "idDocument",
                label: "ID Document/Passport *",
                description: "Clear copy of ID or passport",
                accept: ".pdf,.jpg,.jpeg,.png",
              },
            ].map((doc) => (
              <div
                key={doc.id}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <label className="mb-2 block font-medium text-gray-900 dark:text-white">
                  {doc.label}
                </label>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                  {doc.description}
                </p>
                <input
                  type="file"
                  accept={doc.accept}
                  onChange={(e) => handleFileChange(e, doc.id)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-brand-700 hover:file:bg-brand-100"
                  disabled={isLoading}
                />
                {documents[doc.id] && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ {documents[doc.id].name}
                  </p>
                )}
              </div>
            ))}

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  disabled={isLoading}
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
              Registration Submitted!
            </h3>

            <div className="mb-6 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>Verification Status: Pending</strong>
              </p>
              <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                Your registration is under review. This process typically takes
                1-2 business days. You'll receive an email/SMS once your account
                is approved.
              </p>
            </div>

            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Thank you for registering with HealthConnect. Our team will verify
              your documents and contact you shortly.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/")}
                className="w-full rounded-xl bg-brand-500 py-3 text-white hover:bg-brand-600"
              >
                Return to Home
              </button>
              <button
                onClick={() => navigate("/auth/sign-in")}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                Go to Sign In
              </button>
            </div>
          </div>
        );
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
                      ? "Clinic Info"
                      : stepNum === 2
                      ? "Provider Info"
                      : "Documents"}
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
                    {step === 3 ? "Submitting..." : "Continue"}
                  </span>
                ) : step === 3 ? (
                  "Submit for Verification"
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
