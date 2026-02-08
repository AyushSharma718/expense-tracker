import express from "express";
import {
  addExpense,
  getExpenses,
  deleteExpense,
} from "../controllers/expense.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/*
==============================
 🔐 PROTECTED EXPENSE ROUTES
==============================
*/

// Create new expense (logged-in user only)
router.post("/", protect, addExpense);

// Get all expenses of logged-in user
router.get("/", protect, getExpenses);

// Delete expense (only owner can delete)
router.delete("/:id", protect, deleteExpense);

export default router;
