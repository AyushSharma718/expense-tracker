import { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label="Toggle dark mode"
      className="
        relative w-14 h-14 rounded-full
        flex items-center justify-center
        bg-gradient-to-br from-indigo-500 to-purple-600
        dark:from-yellow-400 dark:to-orange-500
        shadow-xl
        hover:scale-110 transition-transform
        focus:outline-none
      "
    >
      {/* Glow */}
      <span className="
        absolute inset-0 rounded-full
        blur-lg opacity-40
        bg-gradient-to-br from-indigo-500 to-purple-600
        dark:from-yellow-400 dark:to-orange-500
      " />

      {/* Icon */}
      <span className="relative text-2xl text-white">
        {dark ? "☀️" : "🌙"}
      </span>
    </button>
  );
};

export default DarkModeToggle;
