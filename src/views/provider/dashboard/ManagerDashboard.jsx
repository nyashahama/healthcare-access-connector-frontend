import React, { useState, useEffect } from "react";
import { IoMdPeople, IoMdTime } from "react-icons/io";
import { MdCalendarToday, MdTrendingUp, MdAssignment } from "react-icons/md";
import { FaBriefcase } from "react-icons/fa";
import Widget from "components/widget/Widget";
import TodaySchedule from "../components/TodaySchedule";
import StaffAvailability from "../components/StaffAvailability";
import ClinicStats from "../components/ClinicStats";
import QuickActions from "../components/QuickActions";
import { useAuth } from "hooks/useAuth";
import { useProvider } from "hooks/useProvider";
import { useStaff } from "hooks/useStaff";
import { useAppointment } from "hooks/useAppointment";
import { useToast } from "hooks/useToast";

/**
 * Manager Dashboard - For clinic managers
 * Displays operational metrics, staff management, and scheduling
 */
const ManagerDashboard = ({ clinicId }) => {
  const { showToast } = useToast();
  const { getCurrentUser } = useAuth();
  const { getClinic, clinic } = useProvider();
  const {
    listActiveClinicStaff,
    staffList,
    loading: staffLoading,
  } = useStaff();
  const {
    getTodayAppointments,
    getPendingAppointments,
    todayAppointments,
    pendingAppointments,
    loading: appointmentsLoading,
  } = useAppointment();

  const [dashboardStats, setDashboardStats] = useState({
    totalStaff: 0,
    staffOnDuty: 0,
    todayAppointments: 0,
    pendingApprovals: 0,
    avgWaitTime: "0 min",
    completionRate: "0%",
  });

  const [loading, setLoading] = useState(true);
  const [managerInfo, setManagerInfo] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get current user
        const currentUser = getCurrentUser();
        if (!currentUser) {
          showToast("User not authenticated", "error");
          setLoading(false);
          return;
        }

        setManagerInfo({
          firstName: currentUser.first_name || "Manager",
          lastName: currentUser.last_name || "",
        });

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
        const staffOnDutyCount = staffArray.filter(
          (s) => s.is_accepting_new_patients
        ).length;

        const todayApptCount = todayResult.data?.appointments?.length || 0;
        const completedToday =
          todayResult.data?.appointments?.filter(
            (a) => a.status === "completed"
          ).length || 0;

        const pendingApprovalCount =
          pendingResult.data?.appointments?.length || 0;

        const completionRate =
          todayApptCount > 0
            ? Math.round((completedToday / todayApptCount) * 100)
            : 0;

        setDashboardStats({
          totalStaff: totalStaffCount,
          staffOnDuty: staffOnDutyCount,
          todayAppointments: todayApptCount,
          pendingApprovals: pendingApprovalCount,
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

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="border-t-transparent mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white">
            <FaBriefcase className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
              Welcome, {managerInfo?.firstName}! 💼
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Clinic Manager - {clinic?.clinic_name || "Healthcare Facility"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<IoMdPeople className="h-7 w-7" />}
          title={"Staff on Duty"}
          subtitle={`${dashboardStats.staffOnDuty}/${dashboardStats.totalStaff}`}
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
      {dashboardStats.pendingApprovals > 0 && (
        <div className="mt-5 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <div className="flex items-center">
            <MdAssignment className="mr-3 h-6 w-6 text-yellow-500" />
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Pending Approvals
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {dashboardStats.pendingApprovals} appointment
                {dashboardStats.pendingApprovals !== 1
                  ? "s require"
                  : " requires"}{" "}
                your approval
              </p>
            </div>
            <button
              onClick={() =>
                (window.location.href = "/provider/appointments?status=pending")
              }
              className="ml-auto rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-5">
        <QuickActions userRole="manager" clinicId={clinicId} />
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
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Today's Schedule */}
        <div>
          <TodaySchedule
            clinicId={clinicId}
            appointments={todayAppointments}
            loading={appointmentsLoading}
            showManagerView={true}
          />
        </div>

        {/* Clinic Performance */}
        <div>
          <ClinicStats
            clinic={clinic}
            staffList={staffList}
            appointments={todayAppointments}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
