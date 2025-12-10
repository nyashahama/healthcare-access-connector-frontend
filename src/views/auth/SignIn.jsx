import React from "react";
import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import { FaUserInjured, FaUserMd, FaUserShield } from "react-icons/fa";
import Checkbox from "components/checkbox";

export default function SignIn() {
  const [userType, setUserType] = React.useState("patient");

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2 text-4xl font-bold text-navy-700 dark:text-white">
          Welcome to HealthConnect
        </h4>
        <p className="mb-6 ml-1 text-base text-gray-600">
          Connecting healthcare with those who need it most
        </p>

        {/* Role Selection */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-navy-700 dark:text-white">
            I am a:
          </p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setUserType("patient")}
              className={`linear rounded-xl px-4 py-3 text-center transition duration-200 ${
                userType === "patient"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-600 dark:bg-navy-800 dark:text-white"
              }`}
            >
              <FaUserInjured className="mx-auto mb-2 h-6 w-6" />
              <span className="text-sm font-medium">Patient</span>
            </button>
            <button
              onClick={() => setUserType("provider")}
              className={`linear rounded-xl px-4 py-3 text-center transition duration-200 ${
                userType === "provider"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-600 dark:bg-navy-800 dark:text-white"
              }`}
            >
              <FaUserMd className="mx-auto mb-2 h-6 w-6" />
              <span className="text-sm font-medium">Provider</span>
            </button>
            <button
              onClick={() => setUserType("admin")}
              className={`linear rounded-xl px-4 py-3 text-center transition duration-200 ${
                userType === "admin"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-600 dark:bg-navy-800 dark:text-white"
              }`}
            >
              <FaUserShield className="mx-auto mb-2 h-6 w-6" />
              <span className="text-sm font-medium">Admin</span>
            </button>
          </div>
        </div>

        {/* SMS-Only Option */}
        <div className="mb-6 rounded-xl border border-gray-200 p-4 dark:border-navy-700">
          <p className="mb-2 text-sm font-medium text-navy-700 dark:text-white">
            No smartphone? Use SMS:
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Text <span className="font-bold text-brand-500">HELP</span> to{" "}
            <span className="font-bold text-brand-500">12345</span> for free
            assistance
          </p>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white">
            {" "}
            or continue with{" "}
          </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>

        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="your.email@example.com"
          id="email"
          type="email"
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
        />

        {/* Checkbox */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
              Keep me logged In
            </p>
          </div>
          <a
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            href="/auth/forgot-password"
          >
            Forgot Password?
          </a>
        </div>

        <button
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          onClick={() => {
            // Redirect based on user type
            const redirects = {
              patient: "/patient/dashboard",
              provider: "/provider/dashboard",
              admin: "/admin/dashboard",
            };
            window.location.href = redirects[userType];
          }}
        >
          Sign In as {userType.charAt(0).toUpperCase() + userType.slice(1)}
        </button>

        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <a
            href="/auth/sign-up"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
