import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(5000);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH EXPENSES ================= */
  const fetchExpenses = async () => {
    try {
      const res = await api.get("/api/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  /* ================= ADD EXPENSE ================= */
  const addExpense = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/expenses", {
        title,
        amount: Number(amount),
        category,
      });

      setTitle("");
      setAmount("");
      setCategory("Food");
      setShowModal(false);
      fetchExpenses();
    } catch (err) {
      alert("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE EXPENSE ================= */
  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await api.delete(`/api/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch {
      alert("Failed to delete expense");
    }
  };

  /* ================= CALCULATIONS ================= */
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const progress = Math.min((totalSpent / budget) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track spending and manage your budget
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-black transition"
          >
            Add Expense
          </button>
        </div>

        {/* BUDGET CARD */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-10 shadow-sm">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Monthly Budget
            </h2>

            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 transition-all duration-500 ${
                progress < 70
                  ? "bg-green-500"
                  : progress < 100
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between mt-3 text-sm text-gray-600 dark:text-gray-300">
            <span>₹{totalSpent} spent</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* EXPENSE CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {expenses.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">
              No expenses added yet
            </p>
          )}

          {expenses.map((e) => (
            <div
              key={e._id}
              className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm hover:shadow-md transition"
            >

              {/* Delete Button */}
              <button
                onClick={() => deleteExpense(e._id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              >
                ✕
              </button>

              <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                {e.title}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {e.category}
              </p>

              <p className="text-2xl font-semibold text-indigo-600 mt-4">
                ₹{e.amount}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(e.date).toLocaleDateString()}
              </p>

            </div>
          ))}
        </div>

      </div>

      {/* ADD EXPENSE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <form
            onSubmit={addExpense}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 w-full max-w-md shadow-lg"
          >

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
              Add New Expense
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full mb-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full mb-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mb-5 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option>Food</option>
              <option>Travel</option>
              <option>Bills</option>
              <option>Shopping</option>
              <option>Other</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-slate-900 text-white font-medium hover:bg-black transition"
              >
                {loading ? "Saving..." : "Save Expense"}
              </button>
            </div>

          </form>

        </div>
      )}
    </div>
  );
};

export default Dashboard;