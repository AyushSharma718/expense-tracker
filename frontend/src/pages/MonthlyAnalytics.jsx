import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../api/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MonthlyAnalytics = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get("/api/expenses");
        setExpenses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExpenses();
  }, []);

  /* =========================
     GROUP EXPENSES BY MONTH
  ========================== */
  const monthlyTotals = {};
  expenses.forEach((e) => {
    const date = new Date(e.date);
    const key = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    monthlyTotals[key] = (monthlyTotals[key] || 0) + e.amount;
  });

  const months = Object.keys(monthlyTotals).sort(
    (a, b) => new Date(a) - new Date(b)
  );
  const values = months.map((m) => monthlyTotals[m]);

  const totalSpent = values.reduce((a, b) => a + b, 0);
  const avgMonthly =
    months.length > 0 ? Math.round(totalSpent / months.length) : 0;
  const growth =
    months.length > 1
      ? values[values.length - 1] - values[values.length - 2]
      : 0;

  /* =========================
     CHART CONFIG
  ========================== */
  const data = {
    labels: months,
    datasets: [
      {
        label: "Monthly Spend (₹)",
        data: values,
        backgroundColor: "#6366F1",
        borderRadius: 10,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${ctx.raw}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (v) => `₹${v}`,
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Monthly Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Track how your spending changes over time
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Spent" value={`₹${totalSpent}`} gradient />
          <StatCard title="Avg Monthly" value={`₹${avgMonthly}`} />
          <StatCard title="Active Months" value={months.length} />
          <StatCard
            title="Growth"
            value={`${growth >= 0 ? "+" : ""}₹${growth}`}
            positive={growth >= 0}
          />
        </div>

        {/* CHART */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Spending Trend
          </h2>

          {months.length === 0 ? (
            <p className="text-center text-gray-400 py-16">
              No data available yet
            </p>
          ) : (
            <div className="h-[420px]">
              <Bar data={data} options={options} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================
   STAT CARD COMPONENT
========================== */
const StatCard = ({ title, value, gradient, positive }) => {
  return (
    <div
      className={`rounded-2xl p-6 shadow-lg ${
        gradient
          ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
          : positive === undefined
          ? "bg-white dark:bg-slate-800 text-gray-800 dark:text-white"
          : positive
          ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
          : "bg-gradient-to-br from-rose-500 to-red-600 text-white"
      }`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
};

export default MonthlyAnalytics;
