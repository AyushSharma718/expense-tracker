import { NavLink, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "text-slate-900 dark:text-white"
        : "text-gray-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
    }`;

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-8">

          {/* LOGO */}
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-xl font-bold text-indigo-600">₹</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              ExpenseTracker
            </span>
          </div>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/analytics" className={linkClass}>
              Analytics
            </NavLink>

            <NavLink to="/analytics/monthly" className={linkClass}>
              Monthly
            </NavLink>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          <DarkModeToggle />

          <button
            onClick={logout}
            className="text-sm font-medium text-red-600 hover:text-red-700 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;