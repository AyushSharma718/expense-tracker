import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import api from "../api/axios";
import Navbar from "../components/Navbar";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔹 FETCH EXPENSES */
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get("/api/expenses");
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  /* 🔹 CATEGORY TOTALS */
  const categoryTotals = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;
  });

  const totalSpent = expenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  /* 🔹 PIE DATA */
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#6366F1", // indigo
          "#22C55E", // green
          "#F59E0B", // amber
          "#EF4444", // red
          "#8B5CF6", // purple
          "#06B6D4", // cyan
        ],
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#94a3b8",
          padding: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.raw;
            const percent = totalSpent
              ? ((value / totalSpent) * 100).toFixed(1)
              : 0;
            return ` ₹${value} (${percent}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  /* 🔹 TOP CATEGORY */
  const topCategory =
    Object.entries(categoryTotals).length > 0
      ? Object.entries(categoryTotals).sort(
          (a, b) => b[1] - a[1]
        )[0]
      : null;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 py-10">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold">
              Analytics
            </h1>
            <p className="text-slate-400 mt-2">
              Category-wise breakdown of your expenses
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <p className="text-center text-slate-400">
              Loading analytics...
            </p>
          )}

          {!loading && expenses.length === 0 && (
            <p className="text-center text-slate-400">
              No expenses found. Add some data first.
            </p>
          )}

          {!loading && expenses.length > 0 && (
            <>
              {/* SUMMARY CARDS */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-xl">
                  <p className="text-sm opacity-80">
                    Total Spent
                  </p>
                  <h2 className="text-3xl font-bold mt-2">
                    ₹{totalSpent}
                  </h2>
                </div>

                <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <p className="text-sm text-slate-400">
                    Categories
                  </p>
                  <h2 className="text-2xl font-bold mt-2">
                    {Object.keys(categoryTotals).length}
                  </h2>
                </div>

                <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <p className="text-sm text-slate-400">
                    Expenses Count
                  </p>
                  <h2 className="text-2xl font-bold mt-2">
                    {expenses.length}
                  </h2>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 shadow-xl">
                  <p className="text-sm opacity-80">
                    Top Category
                  </p>
                  <h2 className="text-xl font-bold mt-2">
                    {topCategory?.[0] || "N/A"}
                  </h2>
                  <p className="text-sm mt-1">
                    ₹{topCategory?.[1] || 0}
                  </p>
                </div>
              </div>

              {/* CHART + LIST */}
              <div className="grid lg:grid-cols-3 gap-8">

                {/* PIE CHART */}
                <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-xl font-semibold mb-6">
                    Category Distribution
                  </h2>
                  <div className="h-[420px] flex items-center justify-center">
                    <Pie data={pieData} options={pieOptions} />
                  </div>
                </div>

                {/* CATEGORY LIST */}
                <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-xl font-semibold mb-6">
                    Category Summary
                  </h2>

                  <div className="space-y-4">
                    {Object.entries(categoryTotals).map(
                      ([cat, amount]) => (
                        <div
                          key={cat}
                          className="flex justify-between items-center bg-slate-700 rounded-xl px-4 py-3"
                        >
                          <span className="text-slate-300">
                            {cat}
                          </span>
                          <span className="font-semibold text-indigo-400">
                            ₹{amount}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Analytics;
