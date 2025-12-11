import React, { useState } from "react";
import {
  MdPersonAdd,
  MdEmail,
  MdContentCopy,
  MdEdit,
  MdDelete,
  MdVerified,
  MdPendingActions,
} from "react-icons/md";
import { FaUserMd, FaUserNurse } from "react-icons/fa";
import Card from "components/card";

const StaffManagement = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("doctor");

  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      name: "Dr. Michael Smith",
      email: "michael.smith@clinic.com",
      role: "doctor",
      status: "active",
      joinDate: "2023-01-15",
      lastActive: "Today, 10:30 AM",
    },
    {
      id: 2,
      name: "Nurse Sarah Johnson",
      email: "sarah.j@clinic.com",
      role: "nurse",
      status: "active",
      joinDate: "2023-02-20",
      lastActive: "Today, 09:45 AM",
    },
    {
      id: 3,
      name: "Dr. Thandi Nkosi",
      email: "thandi.n@clinic.com",
      role: "doctor",
      status: "pending",
      joinDate: "2024-11-01",
      lastActive: "Not yet joined",
    },
    {
      id: 4,
      name: "Dr. Robert Wilson",
      email: "robert.w@clinic.com",
      role: "doctor",
      status: "inactive",
      joinDate: "2023-03-10",
      lastActive: "2 weeks ago",
    },
  ]);

  const generateInviteLink = () => {
    const token = Math.random().toString(36).substr(2, 9);
    return `${window.location.origin}/auth/sign-up/staff?token=${token}&role=${inviteRole}`;
  };

  const handleInviteStaff = () => {
    if (!inviteEmail || !inviteRole) return;

    const newStaff = {
      id: staffMembers.length + 1,
      name: "Invitation sent",
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: "Waiting for registration",
    };

    setStaffMembers([...staffMembers, newStaff]);
    setInviteEmail("");
    setInviteRole("doctor");
    setShowInviteModal(false);

    // In real app, send email with invite link
    const inviteLink = generateInviteLink();
    console.log(`Invite link for ${inviteRole}: ${inviteLink}`);
    alert(`Invitation sent to ${inviteEmail}. Share this link: ${inviteLink}`);
  };

  const copyInviteLink = () => {
    const link = generateInviteLink();
    navigator.clipboard.writeText(link);
    alert("Invite link copied to clipboard!");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
            <MdVerified className="mr-1" />
            Active
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <MdPendingActions className="mr-1" />
            Pending
          </span>
        );
      case "inactive":
        return (
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
            Inactive
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleIcon = (role) => {
    return role === "doctor" ? (
      <FaUserMd className="text-blue-500" />
    ) : (
      <FaUserNurse className="text-green-500" />
    );
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
            Staff Management
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Manage doctors and nurses at your clinic
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600"
        >
          <MdPersonAdd className="mr-2" />
          Invite Staff
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card extra="p-4">
          <p className="text-sm text-gray-600">Total Staff</p>
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {staffMembers.length}
          </p>
        </Card>
        <Card extra="p-4">
          <p className="text-sm text-gray-600">Active Doctors</p>
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {
              staffMembers.filter(
                (s) => s.role === "doctor" && s.status === "active"
              ).length
            }
          </p>
        </Card>
        <Card extra="p-4">
          <p className="text-sm text-gray-600">Nurses</p>
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {staffMembers.filter((s) => s.role === "nurse").length}
          </p>
        </Card>
        <Card extra="p-4">
          <p className="text-sm text-gray-600">Pending Invites</p>
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {staffMembers.filter((s) => s.status === "pending").length}
          </p>
        </Card>
      </div>

      {/* Staff List */}
      <Card extra="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Team Members
          </h4>
          <button
            onClick={copyInviteLink}
            className="flex items-center text-sm text-brand-500 hover:text-brand-600"
          >
            <MdContentCopy className="mr-1" />
            Copy Invite Link
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-navy-600">
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  Staff Member
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  Role
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  Last Active
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((staff) => (
                <tr
                  key={staff.id}
                  className="border-b border-gray-100 dark:border-navy-700"
                >
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
                        {getRoleIcon(staff.role)}
                      </div>
                      <div>
                        <p className="font-medium text-navy-700 dark:text-white">
                          {staff.name}
                        </p>
                        <p className="text-sm text-gray-600">{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        staff.role === "doctor"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      }`}
                    >
                      {staff.role === "doctor" ? "Doctor" : "Nurse"}
                    </span>
                  </td>
                  <td className="py-4">{getStatusBadge(staff.status)}</td>
                  <td className="py-4 text-sm text-gray-600">
                    {staff.lastActive}
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button className="rounded-lg p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <MdEdit />
                      </button>
                      <button className="rounded-lg p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-navy-800">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Invite Staff Member
            </h4>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Email Address
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="staff@example.com"
                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 dark:border-navy-600 dark:bg-navy-700"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-navy-600 dark:bg-navy-700"
                >
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  An invitation email with a registration link will be sent to
                  this address. The new staff member will be added to your
                  clinic after they complete registration.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteStaff}
                className="linear rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
