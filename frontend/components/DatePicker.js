"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const DateSelect = ({ setStartDate, setEndDate, isit }) => {
  const router = useRouter(); 

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [showPopup, setShowPopup] = useState(false);
  const [startDate, setLocalStartDate] = useState(today);
  const [endDate, setLocalEndDate] = useState(today);
  const [selectedOption, setSelectedOption] = useState("Today");

  useEffect(() => {
    switch (selectedOption) {
      case "Today":
        setStartDate(today);
        setEndDate(today);
        break;
      case "Yesterday":
        setStartDate(yesterday);
        setEndDate(yesterday);
        break;
      case "Last 7 Days":
        setStartDate(new Date(today.setDate(today.getDate() - 7)));
        setEndDate(new Date());
        break;
      case "Last 30 Days":
        setStartDate(new Date(today.setDate(today.getDate() - 30)));
        setEndDate(new Date());
        break;
      case "This Month":
        setStartDate(new Date(today.getFullYear(), today.getMonth(), 1));
        setEndDate(new Date());
        break;
      case "Last Month":
        setStartDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));
        setEndDate(new Date(today.getFullYear(), today.getMonth(), 0));
        break;
      case "Custom":
        setShowPopup(true);
        break;
      default:
        break;
    }
  }, [selectedOption]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSelectedOption("--Select--");
    setShowPopup(false);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <div className="relative p-4 w-full flex justify-end">
      {(selectedOption === "Custom" || selectedOption === "--Select--") &&
        isit === 1 && (
          <div className="w-full flex justify-center">
            <span className="ml-2 text-2xl font-semibold">
              Filtered Statistics ({format(startDate, "dd-MM-yy")} to{" "}
              {format(endDate, "dd-MM-yy")})
            </span>
          </div>
        )}

      <select
        className="bg-green-400 rounded-xl p-1 pl-2 text-black text-xs"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <option value="--Select--">--Select--</option>
        <option value="Today">Today</option>
        <option value="Yesterday">Yesterday</option>
        <option value="Last 7 Days">Last 7 Days</option>
        <option value="Last 30 Days">Last 30 Days</option>
        <option value="This Month">This Month</option>
        <option value="Last Month">Last Month</option>
        <option value="Custom">Custom</option>
      </select>

      {showPopup && (
        <div className="fixed right-0 top-12 p-6 bg-blue-950 shadow-lg rounded-xl w-80">
          <form onSubmit={handleSubmit}>
            <label className="block mb-1 font-medium text-white text-xs">
              Start Date:
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setLocalStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="w-full p-2 border rounded-md text-black text-xs"
            />
            <label className="block mt-3 mb-1 font-medium text-white text-xs">
              End Date:
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setLocalEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="w-full p-2 border rounded-md text-black text-xs"
            />
            <button
              type="submit"
              className="mt-4 text-xs w-full bg-green-500 text-black p-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DateSelect;
