"use client"; // Required for Next.js (Client Component)

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaBox,
  FaHome,
  FaUtensils,
  FaQrcode,
  FaReceipt,
  FaUserFriends,
  FaCog,
  FaBars,
  FaRegUserCircle,
  FaBell,
} from "react-icons/fa";
import axios from "axios";
import logowp from "@/public/images/logowp.png";
import Image from "next/image";

const SideBar = ({ restaurantname }) => {
  const id = typeof window !== "undefined" ? localStorage.getItem("restaurant_id") : null;
  const [unreadCount, setUnreadCount] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/notifications/${id}/unread-count`);
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    };

    if (id) fetchUnreadCount();
  }, [id]);

  const handleNavigation = (path) => {
    router.push(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`flex flex-col h-screen ${isCollapsed ? "w-20" : "w-64"} 
      bg-gradient-to-b from-blue-800 to-purple-700 text-white transition-all duration-300`}
    >
      <div className="flex justify-between items-center p-3">
        {!isCollapsed && <Image src={logowp} className="w-36" alt="WaitPlay Logo" />}
        <button className="text-white" onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>
      </div>

      <div className="flex items-center space-x-2 justify-center mt-6">
        <FaRegUserCircle size={36} />
        {!isCollapsed && <span className="text-lg">{restaurantname || "PFC"}</span>}
      </div>

      <nav className="flex-1 md:mt-5">
        <ul className="space-y-1">
          <li className={`flex items-center ${!isCollapsed ? "px-10" : "px-6"} py-2 cursor-pointer hover:bg-blue-500 text-xl`}
              onClick={() => handleNavigation(`/${id}/dashboard`)}>
            <FaHome className="mr-3" />
            {!isCollapsed && <span>Business</span>}
          </li>
          <li className={`flex items-center ${!isCollapsed ? "px-10" : "px-6"} py-2 cursor-pointer hover:bg-blue-500 text-xl`}
              onClick={() => handleNavigation(`/${id}/orders`)}>
            <FaBox className="mr-3" />
            {!isCollapsed && <span>Orders</span>}
          </li>
          <li className={`flex items-center ${!isCollapsed ? "px-10" : "px-6"} py-2 cursor-pointer hover:bg-blue-500 text-xl`}
              onClick={() => handleNavigation(`/${id}/tables`)}>
            <FaQrcode className="mr-3" />
            {!isCollapsed && <span>Tables</span>}
          </li>
          <li className={`flex items-center ${!isCollapsed ? "px-10" : "px-6"} py-2 cursor-pointer hover:bg-blue-500 text-xl`}>
            <FaReceipt className="mr-3" />
            {!isCollapsed && <span>Bills</span>}
          </li>
          <li className={`flex items-center ${!isCollapsed ? "px-10" : "px-6"} py-2 cursor-pointer hover:bg-blue-500 text-xl`}
              onClick={() => handleNavigation(`/${id}/notifications`)}>
            <FaBell />
            {unreadCount > 0 && (
              <span className="mb-5 p-0 bg-red-600 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
            {!isCollapsed && <span className="ml-1">Notifications</span>}
          </li>
          <li className={`flex items-center ${!isCollapsed ? "px-10" : "px-6"} py-2 cursor-pointer hover:bg-blue-500 text-xl`}
              onClick={() => handleNavigation(`/${id}/menu`)}>
            <FaUtensils className="mr-3" />
            {!isCollapsed && <span>Menu</span>}
          </li>
        </ul>
      </nav>

      {/* Settings */}
      <div className="mb-5">
        <div className={`flex items-center ${!isCollapsed ? "px-10" : "px-6"} py-2 text-xl`}>
          <FaCog className="mr-2" />
          {!isCollapsed && <span>Settings</span>}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
