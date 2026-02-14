import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import SidebarCard from "components/sidebar/components/SidebarCard";
import { providerRoutes } from "routes.js";
import { useAuth } from "context/AuthContext";
const ProviderSidebar = ({ open, onClose }) => {
  const { getCurrentUser } = useAuth();

  const currentUser = getCurrentUser();

  const filteredRoutes = providerRoutes.filter((route) => {
    // 1. Skip routes marked as not in sidebar
    if (route.sidebar === false) return false;

    // 2. Check if route has role restrictions
    if (route.roles) {
      // Check if user has any of the required roles
      const hasRequiredRole = route.roles.some(
        (role) =>
          currentUser?.role === role || currentUser?.roles?.includes(role)
      );
      if (!hasRequiredRole) return false;
    }

    // 3. Check specific email restrictions if they exist
    if (route.allowedEmails) {
      return route.allowedEmails.includes(currentUser?.email);
    }

    return true;
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
          Provider<span className="font-medium text-green-500">Portal</span>
        </div>
      </div>
      <div className="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />

      {/* Navigation Links */}
      <ul className="mb-auto pt-1">
        <Links routes={filteredRoutes} />
      </ul>

      {/* Quick Stats Card */}
      <div className="flex justify-center">
        <div className="to-emerald-600 relative mt-14 flex w-[256px] justify-center rounded-[20px] bg-gradient-to-br from-green-500 pb-4">
          <div className="to-emerald-500 absolute -top-12 flex h-24 w-24 items-center justify-center rounded-full border-[4px] border-white bg-gradient-to-b from-green-400 dark:!border-navy-800">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="mt-16 flex h-fit flex-col items-center">
            <p className="text-lg font-bold text-white">Quick Stats</p>
            <p className="mt-1 px-4 text-center text-sm text-white">
              12 appointments today, 3 patients waiting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderSidebar;
