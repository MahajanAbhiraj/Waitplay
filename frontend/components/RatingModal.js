"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const RatingModal = ({ onClose }) => {
  const [ratings, setRatings] = useState(null);
  const searchParams = useSearchParams();
   const router = useRouter();
  const {id: restaurantId} = router.query // ✅ Correct way to get query params in Next.js 13+

  useEffect(() => {
    if (restaurantId) {
      axios.get(`http://localhost:5000/dashboard-metrics/ratings/${restaurantId}`)
        .then(response => {
          setRatings(response.data);
        })
        .catch(error => console.error("Error fetching ratings:", error));
    }
  }, [restaurantId]);

  return (
    <div className="absolute bg-white p-6 rounded-lg shadow-lg w-80 z-50 -bottom-52">
      <h2 className="text-xl font-bold mb-2 text-center text-black">Detailed Ratings</h2>

      {ratings ? (
        <>
          <div className="flex items-center space-x-4 mb-1">
            <p className="text-black font-semibold w-20">Quality :</p>
            <div className="flex-1 bg-green-200 h-4 rounded-lg relative">
              <div className="bg-green-500 h-4 rounded-lg" style={{ width: `${(ratings.qualityRating / 5) * 100}%` }}></div>
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-1">
            <p className="text-black font-semibold w-20">Service :</p>
            <div className="flex-1 bg-green-200 h-4 rounded-lg relative">
              <div className="bg-green-500 h-4 rounded-lg" style={{ width: `${(ratings.serviceRating / 5) * 100}%` }}></div>
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-1">
            <p className="text-black font-semibold w-20">Pricing :</p>
            <div className="flex-1 bg-green-200 h-4 rounded-lg relative">
              <div className="bg-green-500 h-4 rounded-lg" style={{ width: `${(ratings.pricingRating / 5) * 100}%` }}></div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center">Loading...</p>
      )}

      <button onClick={onClose} className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
        Close
      </button>
    </div>
  );
};

export default RatingModal;
