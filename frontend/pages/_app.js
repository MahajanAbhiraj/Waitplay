import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SideBar from "@/components/SideBar";
import AdminSideBar from "@/components/AdminSideBar";
import LoginPage from "./login";
import { ToastContainer } from "react-toastify";
import "@/styles/globals.css";

function isTokenExpired(token) {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return Date.now() > payload.exp * 1000;
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [token, setToken] = useState(null); 

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    console.log("hello");

    if (!storedToken || isTokenExpired(storedToken)) {
      localStorage.removeItem("token");
      setLoading(false);
      router.push("/login");
      return;
    }

    setToken(storedToken);
    const payload = JSON.parse(atob(storedToken.split(".")[1]));
    setRole(payload.role);

    if (router.query.id) {
      axios
        .get(`http://localhost:5000/superadmin/restaurants/${router.query.id}`)
        .then((response) => setRestaurant(response.data.data))
        .catch((error) => console.error("Error fetching restaurant details:", error.message))
        .finally(() => setLoading(false)); // Ensure loading state updates
    } else {
      setLoading(false); // Ensure loading state updates if no ID
    }
  }, [router.query.id]);

  // 🔹 Fix 2: Prevent hydration mismatch by showing a loading screen
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token || isTokenExpired(token)) {
    return <LoginPage />;
  }

  return (
    <div className="app flex">
      {router.pathname.startsWith("/admin") ? (
        <AdminSideBar />
      ) : (
        restaurant && <SideBar restaurantname={restaurant.name} />
      )}

      <div className="main-content flex-1">
        <Component {...pageProps} />
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
