import React from "react";
import Card from "components/card";

const PendingInvitations = ({
  invitations,
  getRoleLabel,
  formatDate,
  handleCancelInvitation,
  loading,
}) => {
  if (invitations.length === 0) return null;

  return (
    <Card extra="p-6 mt-6">
      <div className="mb-4">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Pending Invitations
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Staff members who haven't accepted their invitation yet
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-navy-600">
              <th className="pb-3 text-left text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">
                Email
              </th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">
                Role
              </th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">
                Invited On
              </th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((invitation) => (
              <tr
                key={invitation.id || invitation.invitation_token}
                className="border-b border-gray-100 dark:border-navy-700"
              >
                <td className="py-4 text-sm font-medium text-navy-700 dark:text-white">
                  {invitation.first_name} {invitation.last_name}
                </td>
                <td className="py-4 text-sm text-gray-600">
                  {invitation.work_email}
                </td>
                <td className="py-4">
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    {getRoleLabel(invitation.staff_role)}
                  </span>
                </td>
                <td className="py-4 text-sm text-gray-600">
                  {formatDate(invitation.invited_at)}
                </td>
                <td className="py-4">
                  <button
                    onClick={() =>
                      handleCancelInvitation(invitation.invitation_token)
                    }
                    className="text-sm text-red-500 hover:text-red-700"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PendingInvitations;
