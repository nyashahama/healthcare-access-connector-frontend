import React, { useState, useEffect } from "react";
import { IoMdPeople, IoMdTime, IoMdChatbubbles } from "react-icons/io";
import { MdCalendarToday, MdCheckCircle } from "react-icons/md";
import { FaUserMd } from "react-icons/fa";
import Widget from "components/widget/Widget";
import TodaySchedule from "../components/TodaySchedule";
import PatientQueue from "../components/PatientQueue";
import RecentConsultations from "../components/RecentConsultations";
import QuickActions from "../components/QuickActions";
import { useAuth } from "hooks/useAuth";
import { useStaff } from "hooks/useStaff";
import { useAppointment } from "hooks/useAppointment";
import { useToast } from "hooks/useToast";

/**
 * Doctor Dashboard - For doctors/physicians
 * Displays appointments, patient queue, and consultation history
 */
const DoctorDashboard = ({ clinicId }) => {
  const { showToast } = useToast();
  const { getCurrentUser } = useAuth();
  const {
    listClinicStaff,
    getStaff,
    staff,
    loading: staffLoading,
  } = useStaff();
  const {
    getTodayAppointments,
    getAppointmentsByClinic,
    todayAppointments,
    appointments,
    loading: appointmentsLoading,
  } = useAppointment();

  const [dashboardStats, setDashboardStats] = useState({
    todayAppointments: 0,
    completedToday: 0,
    waitingPatients: 0,
    completionRate: "0%",
    totalAppointments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Get authenticated user
        const currentUser = getCurrentUser();
        if (!currentUser) {
          showToast("User not authenticated", "error");
          setLoading(false);
          return;
        }

        // 2. Get all staff of this clinic
        const staffListResult = await listClinicStaff(clinicId);
        if (!staffListResult.success) {
          showToast(
            staffListResult.error || "Failed to load clinic staff",
            "error"
          );
          setLoading(false);
          return;
        }

        // 3. Find the staff record that belongs to the current user
        const currentStaff = staffListResult.data.staff?.find(
          (s) => s.user_id === currentUser.id
        );

        if (!currentStaff) {
          showToast("You are not registered as staff for this clinic", "error");
          setLoading(false);
          return;
        }

        // 4. (Optional) Fetch full staff details – this populates the `staff` state in the hook
        await getStaff(currentStaff.id);

        // 5. Set doctor info from the staff record
        setDoctorInfo({
          firstName: currentStaff.first_name || currentUser.first_name,
          lastName: currentStaff.last_name || currentUser.last_name,
          professionalTitle:
            currentStaff.professional_title || "General Practitioner",
          specialization: currentStaff.specialization || "",
        });

        // 6. Fetch today's appointments
        const todayResult = await getTodayAppointments(clinicId);
        if (!todayResult.success) {
          showToast(
            todayResult.error || "Failed to load today's appointments",
            "error"
          );
        }

        // 7. Fetch all appointments for stats
        const allApptResult = await getAppointmentsByClinic(clinicId);
        if (!allApptResult.success) {
          showToast(
            allApptResult.error || "Failed to load appointments",
            "error"
          );
        }

        // 8. Filter appointments belonging to this doctor
        const doctorAppointments =
          todayResult.data?.appointments?.filter(
            (appt) =>
              appt.staff_id === currentStaff.id ||
              appt.doctor_id === currentUser.id
          ) || [];

        const completedToday = doctorAppointments.filter(
          (a) => a.status === "completed"
        ).length;

        const waitingPatients = doctorAppointments.filter(
          (a) => a.status === "confirmed" || a.status === "checked_in"
        ).length;

        const todayCount = doctorAppointments.length;
        const completionRate =
          todayCount > 0 ? Math.round((completedToday / todayCount) * 100) : 0;

        setDashboardStats({
          todayAppointments: todayCount,
          completedToday,
          waitingPatients,
          completionRate: `${completionRate}%`,
          totalAppointments: allApptResult.data?.appointments?.length || 0,
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
  }, [
    clinicId,
    getCurrentUser,
    listClinicStaff,
    getStaff,
    getTodayAppointments,
    getAppointmentsByClinic,
    showToast,
  ]);

  if (loading || staffLoading || appointmentsLoading) {
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
            <FaUserMd className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
              Welcome back, Dr. {doctorInfo?.lastName || "Doctor"}! 👨‍⚕️
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {doctorInfo?.professionalTitle || "General Practitioner"}
              {doctorInfo?.specialization && ` - ${doctorInfo.specialization}`}
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
          icon={<IoMdPeople className="h-7 w-7" />}
          title={"Waiting Patients"}
          subtitle={dashboardStats.waitingPatients.toString()}
          link="/provider/queue"
        />
        <Widget
          icon={<MdCheckCircle className="h-7 w-7" />}
          title={"Completed Today"}
          subtitle={dashboardStats.completedToday.toString()}
          link="/provider/appointments?status=completed"
        />
        <Widget
          icon={<IoMdTime className="h-7 w-7" />}
          title={"Completion Rate"}
          subtitle={dashboardStats.completionRate}
          link="/provider/appointments"
        />
      </div>

      {/* Alert for waiting patients */}
      {dashboardStats.waitingPatients > 0 && (
        <div className="mt-5 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-center">
            <IoMdPeople className="mr-3 h-6 w-6 text-blue-500" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                Patients Waiting
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                You have {dashboardStats.waitingPatients} patient
                {dashboardStats.waitingPatients !== 1 ? "s" : ""} waiting to be
                seen
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "/provider/queue")}
              className="ml-auto rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              View Queue
            </button>
          </div>
        </div>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Today's Schedule - Takes 2 columns */}
        <div className="lg:col-span-2">
          <TodaySchedule
            clinicId={clinicId}
            appointments={todayAppointments}
            loading={appointmentsLoading}
            showDoctorView={true}
          />
        </div>

        {/* Patient Queue - Takes 1 column */}
        <div>
          <PatientQueue
            clinicId={clinicId}
            appointments={todayAppointments}
            loading={appointmentsLoading}
            showDoctorView={true}
          />
        </div>
      </div>

      {/* Recent Consultations */}
      <div className="mt-5">
        <RecentConsultations
          clinicId={clinicId}
          appointments={appointments}
          loading={appointmentsLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-5">
        <QuickActions userRole="doctor" clinicId={clinicId} />
      </div>
    </div>
  );
};

export default DoctorDashboard;
