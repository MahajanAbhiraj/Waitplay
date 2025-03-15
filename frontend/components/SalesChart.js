/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
  } from "recharts";

const data = [
    { month: "Jan", Veg: 30, NonVeg: 20 },
    { month: "Feb", Veg: 10, NonVeg: 25 },
    { month: "Mar", Veg: 15, NonVeg: 30 },
    { month: "Apr", Veg: 12, NonVeg: 45 },
    { month: "May", Veg: 40, NonVeg: 55 },
    { month: "Jun", Veg: 50, NonVeg: 65 },
    { month: "Jul", Veg: 55, NonVeg: 50 },
    { month: "Aug", Veg: 60, NonVeg: 75 },
    { month: "Sep", Veg: 85, NonVeg: 60 },
    { month: "Oct", Veg: 90, NonVeg: 65 },
    { month: "Nov", Veg: 75, NonVeg: 70 },
    { month: "Dec", Veg: 65, NonVeg: 90 },
  ];

const SalesChart = () => {
  const router = useRouter();
  const { id: restaurantId } = router.query;
    return (
      <div className="bg-gradient-to-b from-blue-600 to-purple-600 pr-12 rounded-lg shadow-lg">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            {/* <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.3)" /> */}
            <XAxis dataKey="month" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "10px",
              }}
              labelStyle={{ color: "#333" }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ color: "white" }}
            />
            <Line
              type="monotone"
              dataKey="Veg"
              stroke="#ffffff"
              strokeWidth={2}
              dot={{ fill: "#ffffff", r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="NonVeg"
              stroke="#fcd34d"
              strokeWidth={2}
              dot={{ fill: "#fcd34d", r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

export default SalesChart;
