import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";


export default function HomePage() {
  const router = useRouter();
  const { id } = router.query;
  const [restaurant, setRestaurant] = useState(null);
  const [isAccessible, setIsAccessible] = useState(true);

  useEffect(() => {
    if (!id) return; 

    axios
      .get(`http://localhost:5000/superadmin/restaurants/${id}`)
      .then((response) => {
        setRestaurant(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching restaurant details:", error.message);
      });

    // Check role & access
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      const storedRestaurantId = localStorage.getItem("restaurant_id");

      if (role === "admin" && storedRestaurantId !== id) {
        setIsAccessible(false);
      }
    }
  }, [id]);

  if (!isAccessible) {
    return <div>NOT ACCESSIBLE</div>;
  }

  return (
    <div className="flex h-screen bg-slate-500">
      <div className="flex-1 overflow-scroll">
        <div className="home-header">
          <div>
            <h1>{restaurant?.name || "Loading..."}</h1>
            <p>Manage your business, orders, tables, bills, requests, and menu changes seamlessly.</p>
          </div>
        </div>

        <div className="home-section bg-slate-500">
          <h2 className="home-section-title">Features</h2>
          <div className="home-cards">
            {[
              { title: "Orders", img: "/images/orders.jpg", desc: "Track and manage all incoming orders effortlessly." },
              { title: "Table Management", img: "/images/tables.jpg", desc: "Generate and manage QR codes for table service." },
              { title: "Bills", img: "/images/bills.jpg", desc: "Handle billing processes with ease and accuracy." },
              { title: "Requests", img: "/images/requests.jpg", desc: "Review and address customer requests promptly." },
              { title: "Menu Changes", img: "/images/menu.jpg", desc: "Update and customize your menu to keep it fresh." },
            ].map((feature, index) => (
              <div className="home-card" key={index}>
                <img src={feature.img} alt={feature.title} />
                <div className="home-card-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="home-footer">
          <p>&copy; 2025 Restaurant Panel. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}
