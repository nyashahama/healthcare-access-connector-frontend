import React, { useState, useEffect } from "react";
import { useAuth } from "context/AuthContext";
import { IoMdPeople, IoMdTime, IoMdChatbubbles } from "react-icons/io";
import {
  MdCalendarToday,
  MdLocalHospital,
  MdAssignment,
  MdBusiness,
} from "react-icons/md";
import { FaUserMd, FaUserNurse, FaStethoscope } from "react-icons/fa";
import Widget from "components/widget/Widget";
import TodaySchedule from "../components/TodaySchedule";
import PatientQueue from "../components/PatientQueue";
import ClinicStats from "../components/ClinicStats";
import StaffAvailability from "../components/StaffAvailability";
import RecentConsultations from "../components/RecentConsultations";
import QuickActions from "../components/QuickActions";
import Card from "components/card";

const ProviderDashboard = () => {
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    todayAppointments: 0,
    waitingPatients: 0,
    unreadMessages: 0,
    completionRate: "0%",
    clinicStats: {},
    recentActivity: [],
  });

  const fetchClinicAdminDashboard = async () => {
    return {
      todayAppointments: 12,
      waitingPatients: 5,
      unreadMessages: 3,
      completionRate: "94%",
      clinicStats: {
        totalStaff: 8,
        avgWaitTime: "18 min",
        revenue: "R45,800",
        vaccinations: 15,
        healthChecks: 8,
      },
      recentActivity: [],
    };
  };

  const fetchDoctorDashboard = async () => {
    return {
      todayAppointments: 8,
      waitingPatients: 3,
      unreadMessages: 2,
      completionRate: "96%",
      clinicStats: {},
      recentActivity: [],
    };
  };

  const fetchNurseDashboard = async () => {
    return {
      todayAppointments: 10,
      waitingPatients: 4,
      unreadMessages: 1,
      completionRate: "98%",
      clinicStats: {
        vaccinations: 15,
        healthChecks: 8,
      },
      recentActivity: [],
    };
  };

  // Load dashboard data based on role
  useEffect(() => {
    if (!user) return;
    const loadDashboardData = async () => {
      let data;
      if (user.role === "clinic_admin") {
        data = await fetchClinicAdminDashboard();
      } else if (user.role === "doctor") {
        data = await fetchDoctorDashboard();
      } else if (user.role === "nurse") {
        data = await fetchNurseDashboard();
      }
      setDashboardData(data);
    };
    loadDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="border-t-transparent mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Clinic Admin Dashboard
  const ClinicAdminDashboard = () => (
    <div>
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white">
            <MdBusiness className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
              Clinic Administration
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your clinic operations and staff
            </p>
          </div>
        </div>
      </div>

      {/* Stats Widgets for Admin */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<IoMdPeople className="h-7 w-7" />}
          title={"Total Staff"}
          subtitle={dashboardData.clinicStats?.totalStaff || "0"}
          link="/provider/staff"
        />
        <Widget
          icon={<MdCalendarToday className="h-7 w-7" />}
          title={"Today's Appointments"}
          subtitle={dashboardData.todayAppointments.toString()}
          link="/provider/appointments"
        />
        <Widget
          icon={<IoMdTime className="h-7 w-7" />}
          title={"Avg. Wait Time"}
          subtitle={dashboardData.clinicStats?.avgWaitTime || "0 min"}
          link="/provider/queue"
        />
        <Widget
          icon={<MdAssignment className="h-7 w-7" />}
          title={"Clinic Revenue"}
          subtitle={dashboardData.clinicStats?.revenue || "R0"}
          link="/provider/clinic-management"
        />
      </div>

      {/* Clinic Management Quick Actions */}
      <div className="mt-5">
        <QuickActions userRole="clinic_admin" />
      </div>

      {/* Staff Availability */}
      <div className="mt-5">
        <StaffAvailability />
      </div>

      {/* Clinic Performance */}
      <div className="mt-5">
        <ClinicStats />
      </div>
    </div>
  );

  // Doctor Dashboard
  const DoctorDashboard = () => (
    <div>
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white">
            <FaUserMd className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
              Welcome back, Dr. {user.name?.split(" ")[0] || ""}! 👨‍⚕️
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {user.specialization || "General Practitioner"} at{" "}
              {user.clinic || "Your Clinic"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Widgets for Doctor */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<MdCalendarToday className="h-7 w-7" />}
          title={"Today's Appointments"}
          subtitle={dashboardData.todayAppointments.toString()}
          link="/provider/appointments"
        />
        <Widget
          icon={<IoMdPeople className="h-7 w-7" />}
          title={"Waiting Patients"}
          subtitle={dashboardData.waitingPatients.toString()}
          link="/provider/queue"
        />
        <Widget
          icon={<IoMdTime className="h-7 w-7" />}
          title={"Completion Rate"}
          subtitle={dashboardData.completionRate}
          link="/provider/appointments"
        />
        <Widget
          icon={<IoMdChatbubbles className="h-7 w-7" />}
          title={"Telemedicine"}
          subtitle={dashboardData.unreadMessages.toString()}
          link="/provider/telemedicine"
        />
      </div>

      {/* Main Content */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <TodaySchedule />
        </div>

        {/* Patient Queue */}
        <div>
          <PatientQueue />
        </div>
      </div>

      {/* Recent Consultations */}
      <div className="mt-5">
        <RecentConsultations />
      </div>

      {/* Doctor Quick Actions */}
      <div className="mt-5">
        <QuickActions userRole="doctor" />
      </div>
    </div>
  );

  // Nurse Dashboard
  const NurseDashboard = () => (
    <div>
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white">
            <FaUserNurse className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
              Welcome, Nurse {user.name?.split(" ")[0] || ""}! 👩‍⚕️
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Ready to provide care at {user.clinic || "Your Clinic"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Widgets for Nurse */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<MdCalendarToday className="h-7 w-7" />}
          title={"Assigned Patients"}
          subtitle={dashboardData.todayAppointments.toString()}
          link="/provider/queue"
        />
        <Widget
          icon={<IoMdPeople className="h-7 w-7" />}
          title={"Vaccinations Today"}
          subtitle={dashboardData.clinicStats?.vaccinations || "0"}
        />
        <Widget
          icon={<FaStethoscope className="h-7 w-7" />}
          title={"Health Checks"}
          subtitle={dashboardData.clinicStats?.healthChecks || "0"}
        />
        <Widget
          icon={<IoMdChatbubbles className="h-7 w-7" />}
          title={"Messages"}
          subtitle={dashboardData.unreadMessages.toString()}
          link="/provider/telemedicine"
        />
      </div>

      {/* Patient Queue for Nurse */}
      <div className="mt-5">
        <PatientQueue showNurseView={true} />
      </div>

      {/* Quick Actions for Nurse */}
      <div className="mt-5">
        <QuickActions userRole="nurse" />
      </div>
    </div>
  );

  // Render based on role
  if (user.role === "clinic_admin") {
    return <ClinicAdminDashboard />;
  } else if (user.role === "doctor") {
    return <DoctorDashboard />;
  } else if (user.role === "nurse") {
    return <NurseDashboard />;
  }

  return <div>Loading...</div>;
};

export default ProviderDashboard;
