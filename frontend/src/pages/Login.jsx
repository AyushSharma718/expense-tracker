import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen flex bg-gray-50">

    {/* LEFT SIDE - Branding */}
    <div className="hidden md:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-16">
      
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          ExpenseTracker
        </h1>
      </div>

      <div className="max-w-md">
        <h2 className="text-4xl font-semibold leading-tight">
          Take control of your finances.
        </h2>
        <p className="mt-6 text-gray-300 text-lg">
          Track spending, analyze trends, and make smarter financial decisions —
          all in one simple dashboard.
        </p>
      </div>

      <div className="text-sm text-gray-400">
        © {new Date().getFullYear()} ExpenseTracker
      </div>
    </div>

    {/* RIGHT SIDE - Login Form */}
    <div className="flex w-full md:w-1/2 items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">
            Welcome back
          </h2>
          <p className="text-gray-500 mt-2">
            Please enter your details to sign in
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
              placeholder="you@example.com"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-black transition duration-200 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-8">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-slate-900 font-medium cursor-pointer hover:underline"
          >
            Create account
          </span>
        </p>
      </div>
    </div>
  </div>
);
};

export default Login;
