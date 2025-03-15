/* eslint-disable no-unused-vars */

import React, { useState, useEffect,  } from "react";
import axios from "axios";
import { FaRegStickyNote } from "react-icons/fa";
import { FaRegClipboard } from 'react-icons/fa';
import { FaCreditCard } from 'react-icons/fa';
import { useRouter } from "next/router";

const Orders = () => {
    const router = useRouter();
    const { id :restaurantId} = router.query;
  const [tableIds, setTableIds] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [billDetails, setBillDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/orders/tables-with-orders/${restaurantId}`) 
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTableIds(res.data);
        } else {
          console.error("Expected an array but got:", res.data);
          setTableIds([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching table IDs:", err);
        setTableIds([]);
      });
  }, []);

  const handleTableClick = (tableId) => {
    console.log("Table clicked:", tableId);
    setSelectedTable(tableId);
    axios
      .get(`http://localhost:5000/orders/fetchOrder/${tableId}`)
      .then((res) => {
        console.log("Bill Details:", res.data);
        setBillDetails(res.data);
      })
      .catch((err) => {
        console.error("Error fetching bill details:", err);
        setBillDetails(null);
      });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between p-6">
      <div className="w-full md:w-1/2 md:mt-6 float-left">
        <ul className="grid h-28 grid-cols-1 md:grid-cols-3 gap-4 gap-x-0">
          {tableIds.map((tableId) => (
            <li
              key={tableId}
              className="border px-4 py-2 rounded-lg shadow-sm flex items-center justify-between w-2/3 md:w-2/3 mx-auto bg-purple-300 hover:bg-purple-400 hover:cursor-pointer"
              onClick={() => handleTableClick(tableId)}
            >
              <div>
                <span className="font-semibold text-lg text-gray-700">
                  Table - {tableId}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {selectedTable && (
  <div className="w-1/3 p-4 bg-white shadow-md rounded-lg">
    <h2 className="text-lg font-semibold mb-4 text-center">
      Order Details for Table - {selectedTable}
    </h2>
    {billDetails ? (
      <div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border border-gray-300">Item Name</th>
                <th className="py-2 px-4 border border-gray-300">Qty</th>
                <th className="py-2 px-4 border border-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {billDetails.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border border-gray-300">{item.name}</td>
                  <td className="py-2 px-4 border border-gray-300 text-center">
                    {item.quantity}
                  </td>
                  <td className="py-2 px-4 border border-gray-300 text-right">
                    ₹{item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-2"> 
            <FaRegClipboard
                // onClick={handleIconClick}
                style={{ cursor: "pointer" }}
                title="Click to view instructions"
              />
              <FaCreditCard
                      style={{ cursor: "pointer"}}
                      color={true ? "green" : "red"} 
                />
        </div>

          <div className="text-right font-semibold text-lg">
          Total: ₹{billDetails.totalPrice}
          </div>
        </div>
      </div>
    ) : (
      <p className="text-gray-500">Loading bill details...</p>
    )}
  </div>
)}

    </div>
  );
};

export default Orders;
