import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(5000);

  // Add Expense modal state
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-500">
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Monitor spending, control budget, export reports
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            ➕ Add Expense
          </button>
        </div>

        {/* BUDGET CARD */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Monthly Budget
            </h2>

            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-28 px-3 py-2 rounded-xl border bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
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
              className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg"
            >
              <button
                onClick={() => deleteExpense(e._id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
              >
                🗑
              </button>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {e.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {e.category}
              </p>

              <p className="text-2xl font-bold text-indigo-500 mt-4">
                ₹{e.amount}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(e.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ADD EXPENSE MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50">
          <form
            onSubmit={addExpense}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Add New Expense
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full mb-3 px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full mb-3 px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
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
                className="px-4 py-2 rounded-xl bg-gray-300 dark:bg-gray-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
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
