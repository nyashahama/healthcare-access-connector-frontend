import React from "react";
import { MdEmail, MdPhone } from "react-icons/md";
import Modal from "components/modal/Modal";

const InviteStaffModal = ({
  showInviteModal,
  setShowInviteModal,
  inviteEmail,
  setInviteEmail,
  inviteFirstName,
  setInviteFirstName,
  inviteLastName,
  setInviteLastName,
  invitePhone,
  setInvitePhone,
  inviteRole,
  setInviteRole,
  inviteDepartment,
  setInviteDepartment,
  inviteProfessionalTitle,
  setInviteProfessionalTitle,
  inviteCanManageStaff,
  setInviteCanManageStaff,
  inviteCanApproveAppointments,
  setInviteCanApproveAppointments,
  inviteCanEditClinicInfo,
  setInviteCanEditClinicInfo,
  handleInviteStaff,
  loading,
}) => {
  return (
    <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)}>
      <div className="p-6">
        <h3 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
          Invite Staff Member
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name *
              </label>
              <input
                type="text"
                value={inviteFirstName}
                onChange={(e) => setInviteFirstName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
                placeholder="John"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name *
              </label>
              <input
                type="text"
                value={inviteLastName}
                onChange={(e) => setInviteLastName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Work Email *
            </label>
            <div className="relative">
              <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 pl-10 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
                placeholder="john.doe@example.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <div className="relative">
              <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={invitePhone}
                onChange={(e) => setInvitePhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 pl-10 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role *
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              >
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="admin">Admin</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Department
              </label>
              <input
                type="text"
                value={inviteDepartment}
                onChange={(e) => setInviteDepartment(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
                placeholder="e.g., Cardiology"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Professional Title
            </label>
            <input
              type="text"
              value={inviteProfessionalTitle}
              onChange={(e) => setInviteProfessionalTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              placeholder="e.g., MD, RN, NP"
            />
          </div>

          <div className="border-t border-gray-200 pt-4 dark:border-navy-600">
            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Permissions
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={inviteCanManageStaff}
                  onChange={(e) => setInviteCanManageStaff(e.target.checked)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Can manage staff
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={inviteCanApproveAppointments}
                  onChange={(e) =>
                    setInviteCanApproveAppointments(e.target.checked)
                  }
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Can approve appointments
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={inviteCanEditClinicInfo}
                  onChange={(e) => setInviteCanEditClinicInfo(e.target.checked)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Can edit clinic information
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setShowInviteModal(false)}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleInviteStaff}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Invitation"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InviteStaffModal;
