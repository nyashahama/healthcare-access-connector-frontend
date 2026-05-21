import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "hooks/useToast";
import StatsCards from "./components/StatsCards";
import Controls from "./components/Controls";
import RemindersList from "./components/RemindersList";
import SmsAlternative from "./components/SmsAlternative";
import AddReminderModal from "./components/AddReminderModal";
import EditReminderModal from "./components/EditReminderModal";
import DeleteReminderModal from "./components/DeleteReminderModal";
import SettingsModal from "./components/SettingsModal";
import DetailsModal from "./components/DetailsModal";

const MedicationReminders = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([
    {
      id: 1,
      medication: "Amoxicillin 250mg",
      dosage: "5ml",
      frequency: "Every 8 hours",
      times: ["08:00", "16:00", "00:00"],
      startDate: "2024-01-10",
      endDate: "2024-01-20",
      method: "sms",
      active: true,
      lastTaken: "2024-01-15 16:00",
    },
    {
      id: 2,
      medication: "Paracetamol 500mg",
      dosage: "1 tablet",
      frequency: "Every 6 hours",
      times: ["06:00", "12:00", "18:00", "00:00"],
      startDate: "2024-01-15",
      endDate: "2024-01-18",
      method: "push",
      active: true,
      lastTaken: "2024-01-15 18:00",
    },
    {
      id: 3,
      medication: "Vitamin D Drops",
      dosage: "0.5ml",
      frequency: "Daily",
      times: ["08:00"],
      startDate: "2024-01-01",
      endDate: "2024-03-01",
      method: "email",
      active: true,
      lastTaken: "2024-01-15 08:00",
    },
  ]);

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
    settings: false,
    details: false,
  });
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const { showToast } = useToast();

  const steps = [
    { number: 1, title: "Medication", icon: "MdAdd" },
    { number: 2, title: "Schedule", icon: "MdAccessTime" },
    { number: 3, title: "Confirm", icon: "MdCheckCircle" },
  ];

  const handleViewDetails = (reminder: any) => {
    setSelectedReminder(reminder);
    setModalState((prev: any) => ({ ...prev, details: true }));
  };

  const handleEditReminder = (reminder: any) => {
    setSelectedReminder(reminder);
    setModalState((prev: any) => ({ ...prev, edit: true }));
  };

  const handleDeleteReminder = (reminder: any) => {
    setSelectedReminder(reminder);
    setModalState((prev: any) => ({ ...prev, delete: true }));
  };

  const toggleReminder = (id: any) => {
    setReminders(
      reminders.map((reminder: any) =>
        reminder.id === id
          ? { ...reminder, active: !reminder.active }
          : reminder
      )
    );
    showToast("Reminder updated", "success");
  };

  const confirmDelete = () => {
    setReminders(reminders.filter((r: any) => r.id !== selectedReminder.id));
    setModalState((prev: any) => ({ ...prev, delete: false }));
    showToast("Reminder deleted", "warning");
  };

  const markAsTaken = (id: any) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setReminders(
      reminders.map((reminder: any) =>
        reminder.id === id
          ? {
              ...reminder,
              lastTaken: `${now.toISOString().split("T")[0]} ${timeString}`,
            }
          : reminder
      )
    );
    showToast("Medication marked as taken", "success");
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const confirmAddReminder = () => {
    setModalState((prev: any) => ({ ...prev, add: false }));
    setCurrentStep(1);
    showToast("Medication reminder added successfully!", "success");
  };

  const confirmEditReminder = () => {
    setModalState((prev: any) => ({ ...prev, edit: false }));
    showToast("Reminder updated successfully!", "success");
  };

  const confirmSettingsUpdate = () => {
    setModalState((prev: any) => ({ ...prev, settings: false }));
    showToast("Notification settings updated", "success");
  };

  const handleViewAll = () => {
    navigate({ to: "/patient/medication-reminders" });
  };

  const getMethodIcon = (method: any) => {
    if (method === "sms") return "FaMobileAlt";
    if (method === "push") return "FaBell";
    return "MdEmail";
  };

  const getMethodColor = (method: any) => {
    if (method === "sms") return "text-green-600 dark:text-green-400";
    if (method === "push") return "text-blue-600 dark:text-blue-400";
    return "text-purple-600 dark:text-purple-400";
  };

  const getMethodBgColor = (method: any) => {
    if (method === "sms") return "bg-green-100 dark:bg-green-900";
    if (method === "push") return "bg-blue-100 dark:bg-blue-900";
    return "bg-purple-100 dark:bg-purple-900";
  };

  return (
    <>
      <div className="rounded-[20px] bg-white p-6 shadow-sm dark:bg-navy-800">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h5 className="text-xl font-bold text-navy-700 dark:text-white">
              Medication Reminders
            </h5>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {reminders.length} reminder{reminders.length !== 1 ? "s" : ""} set
              up
            </p>
          </div>
          <button
            onClick={handleViewAll}
            className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
          >
            View All
          </button>
        </div>

        <StatsCards reminders={reminders} />

        <Controls
          onAdd={() => setModalState((prev: any) => ({ ...prev, add: true }))}
          onSettings={() =>
            setModalState((prev: any) => ({ ...prev, settings: true }))
          }
        />

        <RemindersList
          reminders={reminders}
          onViewDetails={handleViewDetails}
          onEdit={handleEditReminder}
          onDelete={handleDeleteReminder}
          onToggle={toggleReminder}
          onMarkTaken={markAsTaken}
          onAdd={() => setModalState((prev: any) => ({ ...prev, add: true }))}
          getMethodIcon={getMethodIcon}
          getMethodColor={getMethodColor}
          getMethodBgColor={getMethodBgColor}
        />

        <SmsAlternative />
      </div>

      {/* Modals */}
      <AddReminderModal
        isOpen={modalState.add}
        onClose={() => {
          setModalState((prev: any) => ({ ...prev, add: false }));
          setCurrentStep(1);
        }}
        currentStep={currentStep}
        steps={steps}
        onNext={handleNextStep}
        onBack={handleBackStep}
        onConfirm={confirmAddReminder}
      />

      <EditReminderModal
        isOpen={modalState.edit}
        onClose={() => setModalState((prev: any) => ({ ...prev, edit: false }))}
        reminder={selectedReminder}
        onConfirm={confirmEditReminder}
      />

      <DeleteReminderModal
        isOpen={modalState.delete}
        onClose={() => setModalState((prev: any) => ({ ...prev, delete: false }))}
        reminder={selectedReminder}
        onConfirm={confirmDelete}
      />

      <SettingsModal
        isOpen={modalState.settings}
        onClose={() => setModalState((prev: any) => ({ ...prev, settings: false }))}
        onConfirm={confirmSettingsUpdate}
      />

      <DetailsModal
        isOpen={modalState.details}
        onClose={() => setModalState((prev: any) => ({ ...prev, details: false }))}
        reminder={selectedReminder}
        onEdit={() => {
          setModalState((prev: any) => ({ ...prev, details: false, edit: true }));
        }}
        getMethodIcon={getMethodIcon}
        getMethodColor={getMethodColor}
        getMethodBgColor={getMethodBgColor}
      />
    </>
  );
};

export default MedicationReminders;
