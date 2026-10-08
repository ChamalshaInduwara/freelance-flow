import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please complete all fields");
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      );

      login(
        response.data.user,
        response.data.token
      );

      toast.success("Account created successfully");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>FreelanceFlow</h1>

      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

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

        <div>
          <label>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Creating..."
            : "Create Account"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Register;