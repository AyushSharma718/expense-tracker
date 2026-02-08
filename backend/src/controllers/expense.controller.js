import Expense from "../models/expense.model.js";

/* =========================
   ADD EXPENSE (JWT BASED)
========================= */
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    // Safety check (optional but good)
    if (!title || !amount || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      userId: req.user.id, // 🔥 VERY IMPORTANT (from JWT)
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

/* =========================
   GET EXPENSES (USER ONLY)
========================= */
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user.id, // 🔥 Only logged-in user's data
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

/* =========================
   DELETE EXPENSE
========================= */
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // 🔐 prevent deleting others' data
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};
