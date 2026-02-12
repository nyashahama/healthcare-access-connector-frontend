import React, { useState, useEffect } from "react";
import { IoMdPeople, IoMdTime, IoMdCall } from "react-icons/io";
import { MdCalendarToday, MdCheckCircle, MdAccessTime } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import Widget from "components/widget/Widget";
import TodaySchedule from "../components/TodaySchedule";
import PatientQueue from "../components/PatientQueue";
import QuickActions from "../components/QuickActions";
import { useAuth } from "hooks/useAuth";
import { useAppointment } from "hooks/useAppointment";
import { useToast } from "hooks/useToast";

/**
 * Receptionist Dashboard - For front desk staff
 * Displays patient check-ins, appointments, and scheduling
 */
const ReceptionistDashboard = ({ clinicId }) => {
  const { showToast } = useToast();
  const { getCurrentUser } = useAuth();
  const {
    getTodayAppointments,
    getPendingAppointments,
    todayAppointments,
    pendingAppointments,
    loading: appointmentsLoading,
  } = useAppointment();

  const [dashboardStats, setDashboardStats] = useState({
    todayAppointments: 0,
    checkedIn: 0,
    pending: 0,
    upcoming: 0,
    waitingPatients: 0,
  });

  const [loading, setLoading] = useState(true);
  const [receptionistInfo, setReceptionistInfo] = useState(null);

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

        setReceptionistInfo({
          firstName: currentUser.first_name || "Receptionist",
          lastName: currentUser.last_name || "",
        });

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

        const appointments = todayResult.data?.appointments || [];
        const todayCount = appointments.length;

        const checkedInCount = appointments.filter(
          (a) => a.status === "checked_in"
        ).length;

        const pendingCount = pendingResult.data?.appointments?.length || 0;

        const upcomingCount = appointments.filter(
          (a) => a.status === "confirmed" || a.status === "scheduled"
        ).length;

        const waitingCount = appointments.filter(
          (a) => a.status === "checked_in" || a.status === "in_progress"
        ).length;

        setDashboardStats({
          todayAppointments: todayCount,
          checkedIn: checkedInCount,
          pending: pendingCount,
          upcoming: upcomingCount,
          waitingPatients: waitingCount,
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
            <FaUserCheck className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
              Welcome, {receptionistInfo?.firstName}! 📋
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Front Desk - Patient Check-in & Scheduling
            </p>
          </div>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<MdCalendarToday className="h-7 w-7" />}
          title={"Today's Appointments"}
          subtitle={dashboardStats.todayAppointments.toString()}
          link="/provider/appointments"
        />
        <Widget
          icon={<MdCheckCircle className="h-7 w-7" />}
          title={"Checked In"}
          subtitle={dashboardStats.checkedIn.toString()}
          link="/provider/queue"
        />
        <Widget
          icon={<MdAccessTime className="h-7 w-7" />}
          title={"Upcoming Today"}
          subtitle={dashboardStats.upcoming.toString()}
          link="/provider/appointments?status=confirmed"
        />
        <Widget
          icon={<IoMdPeople className="h-7 w-7" />}
          title={"Waiting Patients"}
          subtitle={dashboardStats.waitingPatients.toString()}
          link="/provider/queue"
        />
      </div>

      {/* Pending Appointments Alert */}
      {dashboardStats.pending > 0 && (
        <div className="mt-5 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-center">
            <IoMdCall className="mr-3 h-6 w-6 text-blue-500" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                Pending Confirmations
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {dashboardStats.pending} appointment
                {dashboardStats.pending !== 1 ? "s need" : " needs"} to be
                confirmed
              </p>
            </div>
            <button
              onClick={() =>
                (window.location.href = "/provider/appointments?status=pending")
              }
              className="ml-auto rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Confirm Now
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-5">
        <QuickActions userRole="receptionist" clinicId={clinicId} />
      </div>

      {/* Two Column Layout */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Today's Schedule - Takes 2 columns */}
        <div className="lg:col-span-2">
          <TodaySchedule
            clinicId={clinicId}
            appointments={todayAppointments}
            loading={appointmentsLoading}
            showReceptionistView={true}
          />
        </div>

        {/* Patient Queue - Takes 1 column */}
        <div>
          <PatientQueue
            clinicId={clinicId}
            appointments={todayAppointments}
            loading={appointmentsLoading}
            showReceptionistView={true}
          />
        </div>
      </div>

      {/* Check-in Status Board */}
      <div className="mt-5">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-navy-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-navy-700 dark:text-white">
              Check-in Status
            </h3>
            <div className="flex space-x-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                {dashboardStats.checkedIn} Checked In
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {dashboardStats.upcoming} Upcoming
              </span>
            </div>
          </div>

          {todayAppointments && todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.slice(0, 6).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-700"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        appointment.status === "checked_in"
                          ? "bg-green-100 dark:bg-green-900"
                          : appointment.status === "confirmed"
                          ? "bg-blue-100 dark:bg-blue-900"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      {appointment.status === "checked_in" ? (
                        <MdCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <MdAccessTime className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-navy-700 dark:text-white">
                        {appointment.patient_name || "Patient"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {appointment.appointment_time} -{" "}
                        {appointment.doctor_name || "Doctor"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        appointment.status === "checked_in"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : appointment.status === "confirmed"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {appointment.status === "checked_in"
                        ? "Checked In"
                        : appointment.status === "confirmed"
                        ? "Confirmed"
                        : appointment.status}
                    </span>
                    {appointment.status !== "checked_in" && (
                      <button
                        onClick={() =>
                          (window.location.href = `/provider/appointments/${appointment.id}/checkin`)
                        }
                        className="rounded-lg bg-brand-500 px-3 py-1 text-sm text-white hover:bg-brand-600"
                      >
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                No appointments scheduled for today
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
