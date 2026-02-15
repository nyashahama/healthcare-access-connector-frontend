import React from "react";
import Card from "components/card";

const ProvidersList = ({ providers, activeProvider, onConnectToProvider }) => {
  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Available Providers
      </h4>
      <div className="space-y-3">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all ${
              provider.status === "available"
                ? "hover:border-brand-300 hover:bg-brand-50 dark:hover:border-brand-700"
                : "cursor-not-allowed opacity-50"
            } ${
              activeProvider?.id === provider.id
                ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20"
                : "border-gray-200 dark:border-gray-700"
            }`}
            onClick={() =>
              provider.status === "available" && onConnectToProvider(provider)
            }
          >
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-2xl dark:bg-navy-700">
              {provider.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-navy-700 dark:text-white">
                  {provider.name}
                </h5>
                <div className="flex items-center">
                  <span className="text-xs font-bold text-green-600">
                    {provider.rating} ⭐
                  </span>
                  <span
                    className={`ml-2 h-2 w-2 rounded-full ${
                      provider.status === "available"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {provider.specialty}
              </p>
              <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                <span>Response: {provider.responseTime}</span>
                <span className="font-medium">{provider.fee}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProvidersList;
