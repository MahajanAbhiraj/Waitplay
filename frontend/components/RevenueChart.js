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
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", Sales: 50 },
  { month: "Mar", Sales: 1000 },
  { month: "Apr", Sales: 300 },
  { month: "May", Sales: 200 },
  { month: "June", Sales: 190 },
  { month: "July", Sales: 500 },
  { month: "Aug", Sales: 700 },
  { month: "Sep", Sales: 380 },
  { month: "Oct", Sales: 290 },
  { month: "Nov", Sales: 1050 },
  { month: "Dec", Sales: 950 },
];

const RevenueChart = ({ startDate,endDate,interval,calculationType }) => {
  const [revenueData, setRevenueData] = useState([]);
  const router = useRouter();
  const { id: restaurantId } = router.query;
  console.log(startDate,endDate,interval,calculationType);
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/dashboard-metrics/sales1/${restaurantId}`,
          { params: { startDate, endDate, interval, calculationType } }
        );
        setRevenueData(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
  }, [interval,startDate]);

  const currentMonth = new Date().toLocaleString("default", { month: "short" });

  return (
    <div className="mt-5">
      <ResponsiveContainer width="100%" height={95}>
        <LineChart data={revenueData}>
          <XAxis dataKey="date" stroke="#ffffff" fontSize={10} />
            <YAxis stroke="#ffffff" width={30} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(107, 16, 164, 0.8)",
              borderRadius: "10px",
              color: "White",
            }}
            labelStyle={{ color: "#000" }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#ffffff"
            strokeWidth={2}
            dot={(dotProps) => (
              <circle
                cx={dotProps.cx}
                cy={dotProps.cy}
                r={4}
                fill={
                  dotProps.payload.month === currentMonth ? "#f00" : "#ffffff"
                }
              />
            )}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
