import React from "react";
import {
  FaCertificate,
  FaUserMd,
  FaGraduationCap,
  FaAward,
} from "react-icons/fa";
import { MdVerified, MdFileUpload } from "react-icons/md";
import Card from "components/card";

const Credentials = () => {
  const credentials = [
    {
      id: 1,
      type: "Professional License",
      number: "HPCSA 1234567",
      issuer: "Health Professions Council of SA",
      expiry: "2025-12-31",
      status: "verified",
      icon: <FaCertificate />,
    },
    {
      id: 2,
      type: "Specialization Certificate",
      number: "FAM MED 789",
      issuer: "College of Family Physicians",
      expiry: "2026-06-30",
      status: "verified",
      icon: <FaUserMd />,
    },
    {
      id: 3,
      type: "Medical Degree",
      number: "MBChB 2010",
      issuer: "University of Cape Town",
      expiry: null,
      status: "verified",
      icon: <FaGraduationCap />,
    },
    {
      id: 4,
      type: "Advanced Life Support",
      number: "ALS 456",
      issuer: "Resuscitation Council SA",
      expiry: "2024-09-15",
      status: "pending",
      icon: <FaAward />,
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <span className="flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
            <MdVerified className="mr-1" />
            Verified
          </span>
        );
      case "pending":
        return (
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </span>
        );
      case "expired":
        return (
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  const getExpiryStatus = (expiry) => {
    if (!expiry) return { text: "No expiry", color: "text-gray-600" };

    const today = new Date();
    const expiryDate = new Date(expiry);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Expired", color: "text-red-600" };
    if (diffDays < 30)
      return { text: `Expires in ${diffDays} days`, color: "text-orange-600" };
    return {
      text: `Expires ${expiryDate.toLocaleDateString()}`,
      color: "text-green-600",
    };
  };

  return (
    <Card extra={"w-full h-full p-6"}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <FaCertificate className="mr-3 text-brand-500" />
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Professional Credentials
          </h4>
        </div>
        <button className="flex items-center rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300">
          <MdFileUpload className="mr-2" />
          Upload New
        </button>
      </div>

      {/* Credentials List */}
      <div className="space-y-4">
        {credentials.map((cred) => {
          const expiryStatus = getExpiryStatus(cred.expiry);

          return (
            <div
              key={cred.id}
              className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    {cred.icon}
                  </div>
                  <div>
                    <h5 className="font-bold text-navy-700 dark:text-white">
                      {cred.type}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {cred.number} • Issued by {cred.issuer}
                    </p>
                    {cred.expiry && (
                      <p
                        className={`mt-1 text-sm font-medium ${expiryStatus.color}`}
                      >
                        {expiryStatus.text}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(cred.status)}
                  <button className="mt-2 text-sm text-brand-500 hover:text-brand-600">
                    View Document
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* License Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            3
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Active Licenses
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            1
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Renewal Needed
          </p>
        </div>
      </div>

      {/* Accreditation */}
      <div className="mt-4">
        <h5 className="mb-2 font-bold text-navy-700 dark:text-white">
          Clinic Accreditations
        </h5>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
            Department of Health
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            ISO 9001:2015
          </span>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            OHSC Compliant
          </span>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300">
            POPIA Compliant
          </span>
        </div>
      </div>

      {/* Verification Note */}
      <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
        <div className="flex items-start">
          <MdVerified className="mr-3 mt-1 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-medium text-green-800 dark:text-green-300">
              All credentials verified by HealthConnect
            </p>
            <p className="mt-1 text-sm text-green-600 dark:text-green-400">
              Last verification: 15 March 2024
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Credentials;
