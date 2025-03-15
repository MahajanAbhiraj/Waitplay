import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import waitplayLogo from "@/public/images/waitplay_logo.jpg";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  console.log("REY");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/superadmin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("restaurant_id", data.restaurant_id);
        localStorage.setItem("restaurantname", data.admin.restname);
        toast.success("Login Successful");

        if (data.role !== "superadmin") router.push(`/${data.restaurant_id}`);
        else router.push("/admin");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Login failed. Try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="loginpage-container">
      <form className="loginpage-form" onSubmit={handleSubmit}>
        <div className="imageholder">
          <Image src={waitplayLogo} className="loginpagelogo" alt="WaitPlay Logo" />
        </div>
        <h2 className="loginpage-title">Login</h2>

        <div className="loginpage-form-group">
          <label htmlFor="email" className="loginpage-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="loginpage-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="loginpage-form-group">
          <label htmlFor="password" className="loginpage-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="loginpage-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="loginpage-login-button">
          Login
        </button>
      </form>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default LoginPage;
