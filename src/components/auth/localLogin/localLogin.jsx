"use client";

import { useState } from "react";
import { useFeathers } from "@/services/feathers";
import "./localLogin.scss";

const LocalLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const app = useFeathers();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = await app.service("users").create(formData);
      console.log("User created successfully:", user);
      await handleLogin(e);
    } catch (error) {
      setError(error.message);
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await app.authenticate({
        strategy: "local",
        ...formData,
      });
      console.log("Authenticated successfully", response);
      window.location.href = "/";
    } catch (error) {
      setError(error.message);
      console.error("Authentication error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="modal">
        <h1>Smart Investor</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </button>
          <button type="button" onClick={handleSignup} disabled={isLoading}>
            {isLoading ? "Loading..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LocalLogin;
