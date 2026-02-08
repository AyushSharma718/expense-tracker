import { NavLink, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "text-indigo-400"
        : "text-gray-300 hover:text-white"
    }`;

  return (
    <nav className="w-full bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LEFT: LOGO + LINKS */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <span className="text-2xl font-bold text-indigo-500">₹</span>
            <span className="text-lg font-semibold text-white">
              Expense Tracker
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-2">
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

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
