 

import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const { setUser, navigate, backendUrl } = useAppContext();

  const [state, setState] = useState("Login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

console.log("BACKEND URL:", backendUrl);
console.log("CURRENT STATE:", state);
console.log("EMAIL:", email);

    if (loading) return;

    try {
      setLoading(true);

      // ================================
      // SIGN UP
      // ================================
      if (state === "Sign Up") {
        const { data } = await axios.post(
          `${backendUrl}/api/user/register`,
          {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password,
          }
        );

        if (data.success) {
          // Save token
          localStorage.setItem("token", data.token);

          // Save user
          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );

          // Update context
          setUser(data.user);

          toast.success("Account created successfully!");

          // Go home
          navigate("/");
        } else {
          toast.error(data.message || "Registration failed");
        }
      }

      // ================================
      // LOGIN
      // ================================
      else {
        const { data } = await axios.post(
          `${backendUrl}/api/user/login`,
          {
            email: email.trim(),
            password,
          }
        );

        if (data.success) {
          // Save token
          localStorage.setItem("token", data.token);

          // Save user
          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );

          // Update context
          setUser(data.user);

          toast.success("Login successful!");

          // Go home
          navigate("/");
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (error) {
      console.error("Authentication Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // SWITCH LOGIN / SIGN UP
  // ================================
  const switchState = () => {
    if (state === "Login") {
      setState("Sign Up");
    } else {
      setState("Login");
    }

    // Clear fields
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center justify-center px-4"
    >
      <div className="flex flex-col gap-4 w-full max-w-md p-8 border border-gray-200 rounded-xl text-gray-600 text-sm shadow-lg">

        {/* ================= HEADER ================= */}
        <div>
          <p className="text-3xl font-bold text-gray-900">
            {state === "Sign Up"
              ? "Create Account"
              : "Welcome Back"}
          </p>

          <p className="mt-2 text-gray-500">
            {state === "Sign Up"
              ? "Create an account to report and find lost items."
              : "Login to continue to Lost & Found Hub."}
          </p>
        </div>

        {/* ================= NAME ================= */}
        {state === "Sign Up" && (
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
              Full Name
            </label>

            <input
              className="border border-gray-300 rounded-lg w-full p-3 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        {/* ================= EMAIL ================= */}
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-1">
            Email
          </label>

          <input
            className="border border-gray-300 rounded-lg w-full p-3 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* ================= PHONE ================= */}
        {state === "Sign Up" && (
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-1">
              Phone Number
            </label>

            <input
              className="border border-gray-300 rounded-lg w-full p-3 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              required
            />
          </div>
        )}

        {/* ================= PASSWORD ================= */}
        <div className="w-full">
          <label className="block font-medium text-gray-700 mb-1">
            Password
          </label>

          <input
            className="border border-gray-300 rounded-lg w-full p-3 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        {/* ================= SUBMIT ================= */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-900 hover:bg-green-700 disabled:bg-gray-400 text-white w-full py-3 rounded-lg text-base font-medium transition"
        >
          {loading
            ? "Please wait..."
            : state === "Sign Up"
            ? "Create Account"
            : "Login"}
        </button>

        {/* ================= SWITCH ================= */}
        {state === "Sign Up" ? (
          <p className="text-center">
            Already have an account?{" "}

            <button
              type="button"
              onClick={switchState}
              className="text-green-700 font-medium underline cursor-pointer"
            >
              Login here
            </button>
          </p>
        ) : (
          <p className="text-center">
            Don't have an account?{" "}

            <button
              type="button"
              onClick={switchState}
              className="text-green-700 font-medium underline cursor-pointer"
            >
              Create account
            </button>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;