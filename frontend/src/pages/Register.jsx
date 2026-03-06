import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // 🔐 Save token after signup
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen flex bg-gray-50">

    {/* LEFT PANEL */}
    <div className="hidden md:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-16">
      
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          ExpenseTracker
        </h1>
      </div>

      <div className="max-w-md">
        <h2 className="text-4xl font-semibold leading-tight">
          Start managing your money smarter.
        </h2>

        <p className="mt-6 text-gray-300 text-lg">
          Create an account to track expenses, monitor spending habits,
          and gain insights into your finances.
        </p>
      </div>

      <div className="text-sm text-gray-400">
        © {new Date().getFullYear()} ExpenseTracker
      </div>

    </div>

    {/* RIGHT PANEL */}
    <div className="flex w-full md:w-1/2 items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">
            Create an account
          </h2>

          <p className="text-gray-500 mt-2">
            Enter your details to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Ayush Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-black transition duration-200 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-slate-900 font-medium cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>

      </div>

    </div>
  </div>
);
};

export default Register;
