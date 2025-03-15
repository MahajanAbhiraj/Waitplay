/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCodeModal from "./QRCodeModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { FaQrcode, FaTrash } from "react-icons/fa";

const TableTrial = () => {
  const [tables, setTables] = useState([]);
  const [showInputs, setShowInputs] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [description, setDescription] = useState("");
  const [qrData, setQrData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(null);

  const restaurantId = "123";

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tables")
      .then((res) => {
        console.log("API Response:", res.data);
        if (Array.isArray(res.data)) {
          setTables(res.data);
        } else {
          console.error("Expected an array but got:", res.data);
          setTables([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching tables:", err);
        setTables([]);
      });
  }, []);

  const handleAddTable = () => {
    if (!tableNumber || !description) {
      alert("Please fill in both fields.");
      return;
    }
    
    const qrData = `https://example.com?restaurantId=${encodeURIComponent(
      restaurantId
    )}&tableId=${encodeURIComponent(tableNumber)}`;
    const newTable = { tableId: tableNumber, description, restaurantId, qrData };
    axios.post("http://localhost:5000/api/tables", newTable).then((res) => {
      setTables([...tables, res.data]);
      setQrData(qrData);
      setShowModal(true);
      setShowInputs(false);
      setTableNumber("");
      setDescription("");
    });
  };

  const handleDeleteTable = (tableId) => {
    setSelectedTableId(tableId);
    console.log("Selected table ID:", tableId);
    setShowDeleteModal(true);
  };

  const confirmDeleteTable = () => {
    axios
      .delete(`http://localhost:5000/api/tables/${selectedTableId}`)
      .then((res) => {
        setTables(tables.filter((table) => table.tableId !== selectedTableId));
        setShowDeleteModal(false);
        setSelectedTableId(null);
      })
      .catch((err) => {
        console.error("Error deleting table:", err);
      });
  };

  const handleShowQRCode = (tableId) => {
    axios
      .get(`http://localhost:5000/api/tables/${tableId}/qrcode`)
      .then((res) => {
        setQrData(res.data.qrData);
        setShowModal(true);
      })
      .catch((err) => {
        console.error("Error fetching QR code data:", err);
      });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between p-6">
      <div className="w-full md:w-3/4 md:mt-6 mx-auto">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-0">
          {tables.map((table) => (
            <li
              key={table.tableId}
              className={`border px-4 py-2 rounded-lg shadow-sm flex items-center justify-between w-2/3 md:w-2/3 mx-auto ${
    table.isAvailable ? 'bg-gray-100' : 'bg-purple-300'
  }`}
            >
              <div>
                <span className="font-semibold text-gray-700">
                 Table - {table.tableId}
                </span>{" "}
              </div>
              <div className="flex items-center space-x-3 cursor-pointer">
                <FaQrcode
                  size={14}
                  color="black"
                  onClick={() => handleShowQRCode(table.tableId)}
                />
                <FaTrash
                  size={14}
                  color="lightcoral"
                  onClick={() => handleDeleteTable(table.tableId)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col w-full md:w-1/4 bg-gray-100 md:min-h-screen md:mt-0 mt-10 h-auto p-4 rounded-lg shadow-md gap-3">
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
          TABLES
        </h2>
        <hr className="border-gray-300 mb-6 " />

        <div className="flex flex-col md:justify-between md:gap-0 gap-2 flex-grow">
          {!showInputs ? (
            <button
              onClick={() => setShowInputs(true)}
              className="bg-black text-white px-4 py-2 rounded-full w-2/3 mx-auto"
            >
              Add Table
            </button>
          ) : (
            <div className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Table Number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="border px-4 py-2 rounded-lg w-full shadow-sm"
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border px-4 py-2 rounded-lg w-full shadow-sm"
              />
              <button
                onClick={handleAddTable}
                className="bg-black text-white px-4 py-2 rounded-lg w-full"
              >
                Generate QR Code
              </button>
            </div>
          )}
           <div className="space-y-4 flex flex-col items-center mb-4 mt-2">
          <button className="bg-gray-200 text-black px-4 py-2 rounded-full w-2/3 border-2 border-black text-sm font-semibold">
            GET TABLE QR CODES
          </button>
          <button className="bg-gray-200 text-black px-4 py-2 rounded-full w-2/3 border-black border-2 text-sm font-semibold">
            btn 2
          </button>
        </div>
        </div>
      </div>

      {showModal && (
        <QRCodeModal qrData={qrData} onClose={() => setShowModal(false)} />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          onConfirm={confirmDeleteTable}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default TableTrial;
