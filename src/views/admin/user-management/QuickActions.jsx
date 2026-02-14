import React from "react";
import Card from "components/card";
import { MdPerson, MdCheckCircle, MdBlock } from "react-icons/md";

const QuickActions = () => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* User Activity */}
      <Card extra="p-6">
        <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
          📈 User Activity
        </h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Sessions</span>
              <span className="font-bold">1,245</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 w-3/4 rounded-full bg-green-500 transition-all duration-1000"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg. Session Duration</span>
              <span className="font-bold">8m 24s</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 w-1/2 rounded-full bg-blue-500 transition-all duration-1000"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Failed Logins (24h)</span>
              <span className="font-bold text-red-500">42</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 w-1/5 rounded-full bg-red-500 transition-all duration-1000"></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      <Card extra="p-6">
        <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
          ⚡ Bulk Actions
        </h4>
        <div className="space-y-3">
          <button className="w-full rounded-lg bg-green-50 py-3 text-sm font-medium text-green-700 transition-all duration-200 hover:scale-105 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300">
            Send Mass Notification
          </button>
          <button className="w-full rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">
            Export User Data
          </button>
          <button className="w-full rounded-lg border border-red-300 py-3 text-sm font-medium text-red-700 transition-all duration-200 hover:scale-105 hover:bg-red-50 dark:border-red-700 dark:text-red-400">
            Clean Up Inactive Accounts
          </button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card extra="p-6">
        <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
          🔔 Recent Activity
        </h4>
        <div className="space-y-3">
          <div className="flex items-start transition-all duration-300 hover:scale-[1.02]">
            <div className="mr-3 rounded-full bg-blue-100 p-1 dark:bg-blue-900">
              <MdPerson className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                New patient registered: Nthabiseng Molefe
              </div>
              <div className="text-xs text-gray-500">10 minutes ago</div>
            </div>
          </div>
          <div className="flex items-start transition-all duration-300 hover:scale-[1.02]">
            <div className="mr-3 rounded-full bg-green-100 p-1 dark:bg-green-900">
              <MdCheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Dr. Sarah Johnson account verified
              </div>
              <div className="text-xs text-gray-500">2 hours ago</div>
            </div>
          </div>
          <div className="flex items-start transition-all duration-300 hover:scale-[1.02]">
            <div className="mr-3 rounded-full bg-red-100 p-1 dark:bg-red-900">
              <MdBlock className="h-4 w-4 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Account suspended: Kagiso Williams
              </div>
              <div className="text-xs text-gray-500">Yesterday</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Note */}
      <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 transition-all duration-300 hover:scale-[1.01] dark:bg-red-900/20 dark:text-red-300 lg:col-span-3">
        <p>
          🔒 <strong>Security Note:</strong> User data is protected under POPIA
          regulations. Always verify permissions before accessing sensitive
          medical information.
        </p>
      </div>
    </div>
  );
};

export default QuickActions;
