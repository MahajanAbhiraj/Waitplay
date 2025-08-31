"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const RatingBar = ({ label, value }) => (
  <div className="flex items-center space-x-4 mb-2">
    <p className="text-gray-700 font-semibold w-20 shrink-0">{label}:</p>
    <div className="flex-1 bg-gray-200 h-5 rounded-full relative">
      <div
        className="bg-green-500 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
        style={{ width: `${(value / 5) * 100}%` }}
      >
        {value}
      </div>
    </div>
  </div>
);

const RatingModal = ({ restaurantId, onClose }) => {
  const [ratings, setRatings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurantId) {
        setIsLoading(false);
        setError("Restaurant ID is missing.");
        return;
    }

    axios.get(`http://localhost:5000/dashboard-metrics/ratings/${restaurantId}`)
      .then(response => {
        setRatings(response.data);
      })
      .catch(err => {
        console.error("Error fetching ratings:", err);
        setError("Could not load ratings.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [restaurantId]);

  // Handle click on the backdrop to close the modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // This creates a proper modal overlay
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm transform transition-all">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Detailed Ratings</h2>

        {isLoading && <p className="text-center text-gray-500">Loading...</p>}

        {error && <p className="text-center text-red-500 font-semibold">{error}</p>}

        {ratings && (
          <div>
            <RatingBar label="Quality" value={ratings.qualityRating} />
            <RatingBar label="Service" value={ratings.serviceRating} />
            <RatingBar label="Pricing" value={ratings.pricingRating} />
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-60 toning-tight"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RatingModal;