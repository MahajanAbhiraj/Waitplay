import React, { useEffect, useState } from "react";
import axios from "axios";

function RestaurantPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/superadmin/restaurants")
      .then((response) => {
        setRestaurants(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch restaurants");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="restaurant-page">
        <div> 
            <h1>Restaurants</h1>
        </div>
      <div className="restaurant-container">
        {restaurants.map((restaurant) => (
          <div className="restaurant-box" key={restaurant._id}>
            <h2>{restaurant.name}</h2>
            <p>{restaurant.location}</p>
            <div className="restaurant-buttons">
              <button
                onClick={() => {
                  window.location.href = `/${restaurant._id}`;
                }}
              >
                Go to Panel
              </button>
              <button
                onClick={() => {
                  window.location.href = `/${restaurant.id}/sales`;
                }}
              >
                See Sales
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantPage;
