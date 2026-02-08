import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import expenseRoutes from "./routes/expense.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API running...");
});

export default app;
