import React, { useState, useEffect } from "react";
import { IoMdPeople, IoMdChatbubbles } from "react-icons/io";
import { MdCalendarToday, MdLocalHospital } from "react-icons/md";
import { FaUserNurse, FaSyringe, FaStethoscope } from "react-icons/fa";
import Widget from "components/widget/Widget";
import PatientQueue from "../components/PatientQueue";
import QuickActions from "../components/QuickActions";
import { useAuth } from "hooks/useAuth";
import { useAppointment } from "hooks/useAppointment";
import { useToast } from "hooks/useToast";

/**
 * Nurse Dashboard - For nurses
 * Displays patient queue, vitals monitoring, and nursing tasks
 */
const NurseDashboard = ({ clinicId }) => {
  const { showToast } = useToast();
  const { getCurrentUser } = useAuth();
  const {
    getTodayAppointments,
    todayAppointments,
    loading: appointmentsLoading,
  } = useAppointment();

  const [dashboardStats, setDashboardStats] = useState({
    assignedPatients: 0,
    vitalsCompleted: 0,
    vaccinations: 0,
    healthChecks: 0,
    pendingTasks: 0,
  });

  const [loading, setLoading] = useState(true);
  const [nurseInfo, setNurseInfo] = useState(null);

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

        setNurseInfo({
          firstName: currentUser.first_name || "Nurse",
          lastName: currentUser.last_name || "",
          professionalTitle:
            currentUser.professional_title || "Registered Nurse",
        });

        // Fetch today's appointments
        const todayResult = await getTodayAppointments(clinicId);
        if (!todayResult.success) {
          showToast(
            todayResult.error || "Failed to load appointments",
            "error"
          );
        }

        // Filter appointments assigned to this nurse
        const nurseAppointments =
          todayResult.data?.appointments?.filter(
            (appt) =>
              appt.nurse_id === currentUser.id || appt.status === "checked_in"
          ) || [];

        // Count different types of nursing tasks
        const vitalsCompleted = nurseAppointments.filter(
          (a) => a.vitals_recorded
        ).length;

        const vaccinations = nurseAppointments.filter(
          (a) => a.appointment_type === "vaccination"
        ).length;

        const healthChecks = nurseAppointments.filter(
          (a) =>
            a.appointment_type === "health_check" ||
            a.appointment_type === "screening"
        ).length;

        const pendingTasks = nurseAppointments.filter(
          (a) =>
            !a.vitals_recorded &&
            (a.status === "checked_in" || a.status === "confirmed")
        ).length;

        setDashboardStats({
          assignedPatients: nurseAppointments.length,
          vitalsCompleted,
          vaccinations,
          healthChecks,
          pendingTasks,
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
            Loading your dashboard...
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
            <FaUserNurse className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
              Welcome, {nurseInfo?.firstName}! 👩‍⚕️
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {nurseInfo?.professionalTitle || "Registered Nurse"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<MdCalendarToday className="h-7 w-7" />}
          title={"Assigned Patients"}
          subtitle={dashboardStats.assignedPatients.toString()}
          link="/provider/queue"
        />
        <Widget
          icon={<FaSyringe className="h-7 w-7" />}
          title={"Vaccinations Today"}
          subtitle={dashboardStats.vaccinations.toString()}
          link="/provider/appointments?type=vaccination"
        />
        <Widget
          icon={<FaStethoscope className="h-7 w-7" />}
          title={"Health Checks"}
          subtitle={dashboardStats.healthChecks.toString()}
          link="/provider/appointments?type=health_check"
        />
        <Widget
          icon={<MdLocalHospital className="h-7 w-7" />}
          title={"Vitals Completed"}
          subtitle={`${dashboardStats.vitalsCompleted}/${dashboardStats.assignedPatients}`}
          link="/provider/queue"
        />
      </div>

      {/* Alert for pending tasks */}
      {dashboardStats.pendingTasks > 0 && (
        <div className="mt-5 rounded-lg border-l-4 border-purple-500 bg-purple-50 p-4 dark:bg-purple-900/20">
          <div className="flex items-center">
            <MdLocalHospital className="mr-3 h-6 w-6 text-purple-500" />
            <div>
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                Pending Vitals
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                {dashboardStats.pendingTasks} patient
                {dashboardStats.pendingTasks !== 1 ? "s need" : " needs"} vital
                signs recorded
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "/provider/queue")}
              className="ml-auto rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600"
            >
              Record Vitals
            </button>
          </div>
        </div>
      )}

      {/* Patient Queue with Nursing Focus */}
      <div className="mt-5">
        <PatientQueue
          clinicId={clinicId}
          appointments={todayAppointments}
          loading={appointmentsLoading}
          showNurseView={true}
        />
      </div>

      {/* Nursing Tasks Today */}
      <div className="mt-5">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-navy-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-navy-700 dark:text-white">
              Today's Nursing Tasks
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {todayAppointments?.length || 0} patients
            </span>
          </div>

          {todayAppointments && todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments
                .filter(
                  (appt) =>
                    appt.appointment_type === "vaccination" ||
                    appt.appointment_type === "health_check" ||
                    !appt.vitals_recorded
                )
                .slice(0, 5)
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-700"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
                        {appointment.appointment_type === "vaccination" ? (
                          <FaSyringe className="h-5 w-5 text-brand-500" />
                        ) : appointment.appointment_type === "health_check" ? (
                          <FaStethoscope className="h-5 w-5 text-brand-500" />
                        ) : (
                          <IoMdPeople className="h-5 w-5 text-brand-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-navy-700 dark:text-white">
                          {appointment.patient_name || "Patient"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {appointment.appointment_type?.replace("_", " ") ||
                            "General"}{" "}
                          - {appointment.appointment_time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!appointment.vitals_recorded && (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Vitals Pending
                        </span>
                      )}
                      <button
                        onClick={() =>
                          (window.location.href = `/provider/appointments/${appointment.id}`)
                        }
                        className="rounded-lg bg-brand-500 px-3 py-1 text-sm text-white hover:bg-brand-600"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                No nursing tasks for today
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions for Nurses */}
      <div className="mt-5">
        <QuickActions userRole="nurse" clinicId={clinicId} />
      </div>
    </div>
  );
};

export default NurseDashboard;
