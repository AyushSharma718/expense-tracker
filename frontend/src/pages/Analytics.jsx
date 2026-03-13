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

  /* FETCH EXPENSES */
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

  /* CATEGORY TOTALS */
  const categoryTotals = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;
  });

  const totalSpent = expenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  /* PIE DATA */
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#6366F1",
          "#22C55E",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#06B6D4",
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
          color: "#64748b",
          padding: 16,
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

  /* TOP CATEGORY */
  const topCategory =
    Object.entries(categoryTotals).length > 0
      ? Object.entries(categoryTotals).sort(
          (a, b) => b[1] - a[1]
        )[0]
      : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Category breakdown of your expenses
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading analytics...
          </p>
        )}

        {!loading && expenses.length === 0 && (
          <p className="text-center text-gray-500">
            No expenses found. Add some data first.
          </p>
        )}

        {!loading && expenses.length > 0 && (
          <>
            {/* SUMMARY CARDS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Spent
                </p>
                <h2 className="text-2xl font-semibold mt-2 text-gray-900 dark:text-white">
                  ₹{totalSpent}
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Categories
                </p>
                <h2 className="text-2xl font-semibold mt-2 text-gray-900 dark:text-white">
                  {Object.keys(categoryTotals).length}
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Expenses Count
                </p>
                <h2 className="text-2xl font-semibold mt-2 text-gray-900 dark:text-white">
                  {expenses.length}
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Top Category
                </p>
                <h2 className="text-lg font-semibold mt-2 text-gray-900 dark:text-white">
                  {topCategory?.[0] || "N/A"}
                </h2>
                <p className="text-sm text-indigo-600 mt-1">
                  ₹{topCategory?.[1] || 0}
                </p>
              </div>

            </div>

            {/* CHART + CATEGORY LIST */}
            <div className="grid lg:grid-cols-3 gap-8">

              {/* PIE CHART */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  Category Distribution
                </h2>

                <div className="h-[400px]">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>

              {/* CATEGORY SUMMARY */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  Category Summary
                </h2>

                <div className="space-y-3">
                  {Object.entries(categoryTotals).map(
                    ([cat, amount]) => (
                      <div
                        key={cat}
                        className="flex justify-between items-center border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3"
                      >
                        <span className="text-gray-600 dark:text-gray-300">
                          {cat}
                        </span>
                        <span className="font-medium text-indigo-600">
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
  );
};

export default Analytics;