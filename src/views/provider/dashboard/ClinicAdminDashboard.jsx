import React, { useState, useEffect } from "react";
import { IoMdPeople, IoMdTime } from "react-icons/io";
import {
  MdCalendarToday,
  MdAssignment,
  MdBusiness,
  MdTrendingUp,
} from "react-icons/md";
import Widget from "components/widget/Widget";
import TodaySchedule from "../components/TodaySchedule";
import PatientQueue from "../components/PatientQueue";
import ClinicStats from "../components/ClinicStats";
import StaffAvailability from "../components/StaffAvailability";
import QuickActions from "../components/QuickActions";
import { useProvider } from "hooks/useProvider";
import { useStaff } from "hooks/useStaff";
import { useAppointment } from "hooks/useAppointment";
import { useToast } from "hooks/useToast";

/**
 * Clinic Admin Dashboard - For clinic owners and administrators
 * Displays overview of clinic operations, staff, and finances
 */
const ClinicAdminDashboard = ({ clinicId }) => {
  const { showToast } = useToast();
  const { getClinic, clinic, loading: clinicLoading } = useProvider();
  const {
    listActiveClinicStaff,
    staffList,
    loading: staffLoading,
  } = useStaff();
  const {
    getAppointmentsByClinic,
    getTodayAppointments,
    getPendingAppointments,
    appointments,
    todayAppointments,
    pendingAppointments,
    loading: appointmentsLoading,
  } = useAppointment();

  const [dashboardStats, setDashboardStats] = useState({
    totalStaff: 0,
    activeStaff: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    avgWaitTime: "0 min",
    completionRate: "0%",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch clinic details
        const clinicResult = await getClinic(clinicId);
        if (!clinicResult.success) {
          showToast(
            clinicResult.error || "Failed to load clinic data",
            "error"
          );
        }

        // Fetch staff list
        const staffResult = await listActiveClinicStaff(clinicId);
        if (!staffResult.success) {
          showToast(staffResult.error || "Failed to load staff data", "error");
        }

        // Fetch today's appointments
        const todayResult = await getTodayAppointments(clinicId);
        if (!todayResult.success) {
          showToast(
            todayResult.error || "Failed to load appointments",
            "error"
          );
        }

        // Fetch pending appointments
        const pendingResult = await getPendingAppointments(clinicId);
        if (!pendingResult.success) {
          showToast(
            pendingResult.error || "Failed to load pending appointments",
            "error"
          );
        }

        // Calculate stats - staffResult.data.staff is the array
        const staffArray = staffResult.data?.staff || [];
        const totalStaffCount = staffArray.length;
        const activeStaffCount = staffArray.filter(
          (s) => s.is_accepting_new_patients
        ).length;

        const todayApptCount = todayResult.data?.appointments?.length || 0;
        const completedToday =
          todayResult.data?.appointments?.filter(
            (a) => a.status === "completed"
          ).length || 0;

        const pendingApptCount = pendingResult.data?.appointments?.length || 0;

        // Calculate completion rate
        const completionRate =
          todayApptCount > 0
            ? Math.round((completedToday / todayApptCount) * 100)
            : 0;

        setDashboardStats({
          totalStaff: totalStaffCount,
          activeStaff: activeStaffCount,
          todayAppointments: todayApptCount,
          pendingAppointments: pendingApptCount,
          avgWaitTime: clinicResult.data?.average_wait_time_minutes
            ? `${clinicResult.data.average_wait_time_minutes} min`
            : "N/A",
          completionRate: `${completionRate}%`,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        showToast("Error loading dashboard data", "error");
        setLoading(false);
      }
    };

    if (clinicId) {
      fetchDashboardData();
    }
  }, [clinicId]);

  if (loading || clinicLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="border-t-transparent mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading clinic dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white">
              <MdBusiness className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
                {clinic?.clinic_name || "Clinic Administration"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {clinic?.city && clinic?.province
                  ? `${clinic.city}, ${clinic.province}`
                  : "Manage your clinic operations and staff"}
              </p>
            </div>
          </div>
          {clinic?.verification_status && (
            <div className="flex items-center space-x-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  clinic.verification_status === "verified"
                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                    : clinic.verification_status === "pending"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                    : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                }`}
              >
                {clinic.verification_status.charAt(0).toUpperCase() +
                  clinic.verification_status.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<IoMdPeople className="h-7 w-7" />}
          title={"Total Staff"}
          subtitle={`${dashboardStats.totalStaff} (${dashboardStats.activeStaff} active)`}
          link="/provider/staff"
        />
        <Widget
          icon={<MdCalendarToday className="h-7 w-7" />}
          title={"Today's Appointments"}
          subtitle={dashboardStats.todayAppointments.toString()}
          link="/provider/appointments"
        />
        <Widget
          icon={<IoMdTime className="h-7 w-7" />}
          title={"Avg. Wait Time"}
          subtitle={dashboardStats.avgWaitTime}
          link="/provider/queue"
        />
        <Widget
          icon={<MdTrendingUp className="h-7 w-7" />}
          title={"Completion Rate"}
          subtitle={dashboardStats.completionRate}
          link="/provider/appointments"
        />
      </div>

      {/* Pending Approvals Alert */}
      {dashboardStats.pendingAppointments > 0 && (
        <div className="mt-5 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <div className="flex items-center">
            <MdAssignment className="mr-3 h-6 w-6 text-yellow-500" />
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Pending Appointments
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                You have {dashboardStats.pendingAppointments} appointment
                {dashboardStats.pendingAppointments !== 1 ? "s" : ""} waiting
                for approval
              </p>
            </div>
            <button
              onClick={() =>
                (window.location.href = "/provider/appointments?status=pending")
              }
              className="ml-auto rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
            >
              Review Now
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-5">
        <QuickActions userRole="clinic_admin" clinicId={clinicId} />
      </div>

      {/* Staff Availability */}
      <div className="mt-5">
        <StaffAvailability
          clinicId={clinicId}
          staffList={staffList}
          loading={staffLoading}
        />
      </div>

      {/* Two Column Layout */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Today's Schedule - Takes 2 columns */}
        <div className="lg:col-span-2">
          <TodaySchedule
            clinicId={clinicId}
            appointments={todayAppointments}
            loading={appointmentsLoading}
          />
        </div>

        {/* Patient Queue - Takes 1 column */}
        <div>
          <PatientQueue
            clinicId={clinicId}
            appointments={todayAppointments}
            loading={appointmentsLoading}
          />
        </div>
      </div>

      {/* Clinic Performance Stats */}
      <div className="mt-5">
        <ClinicStats
          clinic={clinic}
          staffList={staffList}
          appointments={appointments}
        />
      </div>
    </div>
  );
};

export default ClinicAdminDashboard;
