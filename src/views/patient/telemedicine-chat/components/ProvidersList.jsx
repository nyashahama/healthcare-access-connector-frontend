import React from "react";
import Card from "components/card";
import { FaUserMd } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";

const StatusDot = ({ status }) => {
  const colors = {
    available: "bg-green-500",
    busy: "bg-yellow-400",
    away: "bg-gray-400",
    offline: "bg-gray-300",
  };
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        colors[status] || colors.offline
      }`}
    />
  );
};

const ProvidersList = ({
  providers = [],
  activeProvider,
  onConnectToProvider,
  loading,
  onRefresh,
}) => {
  return (
    <Card extra="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Available Providers
        </h4>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="rounded p-1 text-gray-400 transition-colors hover:text-brand-500"
            title="Refresh"
          >
            <MdRefresh className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      {loading && providers.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex animate-pulse items-center rounded-lg border border-gray-100 p-3 dark:border-gray-700"
            >
              <div className="mr-3 h-10 w-10 rounded-full bg-gray-200 dark:bg-navy-600" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-navy-600" />
                <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-navy-600" />
              </div>
            </div>
          ))}
        </div>
      ) : providers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FaUserMd className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No providers online right now
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Check back shortly or use the symptom checker
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {providers.map((provider) => {
            const isActive = activeProvider?.id === provider.staff_id;
            const isAvailable = provider.status === "available";

            return (
              <div
                key={provider.staff_id}
                onClick={() =>
                  isAvailable && !isActive && onConnectToProvider(provider)
                }
                className={`flex items-center rounded-lg border p-3 transition-all
                  ${
                    !isAvailable
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }
                  ${
                    isActive
                      ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20"
                      : isAvailable
                      ? "border-gray-200 hover:border-brand-300 hover:bg-brand-50 dark:border-gray-700 dark:hover:border-brand-700 dark:hover:bg-brand-900/10"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
              >
                {/* Avatar */}
                <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl dark:bg-navy-700">
                  {provider.profile_picture_url ? (
                    <img
                      src={provider.profile_picture_url}
                      alt={provider.first_name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    "👨‍⚕️"
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="truncate font-medium text-navy-700 dark:text-white">
                      {provider.professional_title
                        ? `${provider.professional_title} ${provider.first_name} ${provider.last_name}`
                        : `${provider.first_name} ${provider.last_name}`}
                    </h5>
                    <StatusDot status={provider.status} />
                  </div>

                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {provider.specialization || "General Practice"}
                  </p>

                  <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                    {provider.estimated_wait_minutes != null ? (
                      <span>~{provider.estimated_wait_minutes} min wait</span>
                    ) : (
                      <span>Available now</span>
                    )}
                    {provider.consultation_fee_override != null && (
                      <span className="font-medium text-navy-700 dark:text-white">
                        R{provider.consultation_fee_override}
                      </span>
                    )}
                  </div>

                  {provider.active_consultation_count != null &&
                    provider.max_concurrent_consultations != null && (
                      <div className="mt-1.5">
                        <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-navy-600">
                          <div
                            className="h-1 rounded-full bg-brand-400 transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                (provider.active_consultation_count /
                                  provider.max_concurrent_consultations) *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
                        <p className="mt-0.5 text-right text-[10px] text-gray-400">
                          {provider.active_consultation_count}/
                          {provider.max_concurrent_consultations} active
                        </p>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default ProvidersList;
