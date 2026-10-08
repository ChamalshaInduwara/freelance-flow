import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post(
        "/auth/login",
        formData
      );

      login(
        response.data.user,
        response.data.token
      );

      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>FreelanceFlow</h1>

      <h2>Welcome Back</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">
          Create Account
        </Link>
      </p>
    </div>
  );
};

export default Login;