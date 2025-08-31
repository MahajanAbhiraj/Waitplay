import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { useRouter } from "next/router";


const socket = io("http://localhost:5000");

function NotificationPage() {
  const router = useRouter();
    const { id: restaurantId } = router.query;
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();

    socket.on("waiter-called", (data) => {
      if (data.restaurantId === restaurantId) {
        setNotifications((prev) => [data, ...prev]); 

        toast.info(`🚨 ${data.description}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    });

    return () => {
      socket.off("waiter-called"); 
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/notifications/${restaurantId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/notifications/${restaurantId}/${id}/mark-as-read`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  return (
    <div className="h-screen bg-blue-950 text-white p-6 flex flex-col overflow-scroll">
      <h1 className="text-2xl font-bold mb-4 text-center">Notifications</h1>

      <ToastContainer />

      <div className="bg-gradient-to-b from-blue-600 to-purple-600 shadow-lg rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-800">
              <th className="border border-black p-2 text-lime-500">#</th>
              <th className="border border-black p-2 text-lime-500">Event</th>
              <th className="border border-black p-2 text-lime-500">Description</th>
              <th className="border border-black p-2 text-lime-500">Time</th>
              <th className="border border-black p-2 text-lime-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <tr key={notif.id} className={notif.read ? "bg-gray-100" : "bg-yellow-50"}>
                  <td className="border border-black p-2 text-black font-semibold text-center">{index + 1}</td>
                  <td className="border border-black p-2 text-black font-semibold">{notif.eventName}</td>
                  <td className="border border-black p-2 text-black font-semibold">{notif.description}</td>
                  <td className="border border-black p-2 text-black font-semibold">
                    {new Date(notif.time).toLocaleString()}
                  </td>
                  <td className="border border-black p-2 text-black font-semibold text-center">
                    {!notif.read ? (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="bg-green-500 text-black px-3 py-1 rounded hover:bg-green-600"
                      >
                        Mark as Read
                      </button>
                    ) : (
                      <span className="text-gray-500">Read</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No notifications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NotificationPage;
