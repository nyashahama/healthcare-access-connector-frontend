import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import SidebarCard from "components/sidebar/components/SidebarCard";
import { patientRoutes } from "routes.js";
import { useAuth } from "hooks/useAuth";

const PatientSidebar = ({ open, onClose }) => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const userRole = user?.role;

  // Only render for patient role
  if (userRole !== "patient") return null;

  // Filter out routes that should not appear in sidebar
  const filteredRoutes = patientRoutes.filter((route) => {
    return route.sidebar !== false;
  });

  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full w-[313px] flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        <div className="ml-1 mt-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          Health<span className="font-medium text-brand-500">Connect</span>
        </div>
      </div>
      <div className="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />

      {/* Navigation Links - Pass filtered routes */}
      <ul className="mb-auto pt-1">
        <Links routes={filteredRoutes} />
      </ul>

      {/* Health Tips Card */}
      <div className="flex justify-center">
        <div className="relative mt-14 flex w-[256px] justify-center rounded-[20px] bg-gradient-to-br from-blue-500 to-brand-500 pb-4">
          <div className="absolute -top-12 flex h-24 w-24 items-center justify-center rounded-full border-[4px] border-white bg-gradient-to-b from-blue-400 to-brand-500 dark:!border-navy-800">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
          <div className="mt-16 flex h-fit flex-col items-center">
            <p className="text-lg font-bold text-white">Health Tip</p>
            <p className="mt-1 px-4 text-center text-sm text-white">
              Remember to drink 8 glasses of water daily for better health!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSidebar;
