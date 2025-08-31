import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import Modal from "react-modal";

function OrdersSocket() {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const restaurantId = "678763459ea65f8fedf5a8c0";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintView, setIsPrintView] = useState(false);

  const handlePrintAndSave = () => {
    setIsModalOpen(true);
    setIsPrintView(false);
  };

  const handlePrint = () => {
    setIsPrintView(true);
  };

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.emit("joinRestaurant", restaurantId);

    socket.on("tablesWithOrders", (tablesWithOrders) => {
      setTables(tablesWithOrders);
      setIsLoading(false);
    });

    socket.on("newOrder", (newOrder) => {
      toast.success(`New order received on Table ${newOrder.table.tableId}`);
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    });

    socket.on("orderStatusUpdate", (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    socket.on("fetchAllOrders", (Orders) => {
      setOrders(Orders);
    });

    socket.emit("getTablesWithOrders", restaurantId);
    socket.emit("findAllOrders", restaurantId);

    return () => {
      socket.disconnect();
    };
  }, [restaurantId]);

  const handleTableClick = (tableId) => {
    setSelectedTable(tableId);
    const tableOrders = orders.filter((order) => order.table._id === tableId);
    const itemsMap = new Map();

    tableOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (itemsMap.has(item.name)) {
          itemsMap.get(item.name).quantity += item.quantity;
        } else {
          itemsMap.set(item.name, { ...item });
        }
      });
    });

    setFilteredItems(Array.from(itemsMap.values()));
  };

  const calculateTotal = () => {
    return filteredItems.reduce((total, order) => {
      return (
        total +
        order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      );
    }, 0);
  };

  if (isLoading) {
    return <p className="text-center text-lg text-gray-600">Loading...</p>;
  }

  return (
    <div className="flex h-screen  bg-blue-950">
      {/* Left Panel - Tables */}
      <div className="w-2/4 p-5 m-3 rounded bg-gradient-to-b from-blue-600 to-purple-600">
        <h1 className="text-2xl font-semibold text-white mb-4 text-center">Tables</h1>
        <div className="grid grid-cols-3 gap-4">
          {tables.map((table) => (
            <div
              key={table._id}
              className={`p-6 rounded-lg text-center cursor-pointer font-medium text-lg border border-gray-300 transition-all duration-200 ${
                selectedTable === table._id
                  ? "bg-blue-950 text-lime-500 font-semibold"
                  : "bg-blue-950 hover:bg-blue-400 hover:text-white text-white font-semibold"
              }`}
              onClick={() => handleTableClick(table._id)}
            >
              Table {table.tableId}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Items Table */}
      <div className="m-3 rounded bg-gradient-to-b from-blue-600 to-purple-600 flex-1 p-5">
  {selectedTable ? (
    <>
      <h1 className="text-2xl font-semibold pb-2  mb-1 pt-2 bg-blue-950 text-white text-center">
        Table {tables.find((t) => t._id === selectedTable)?.tableId}
      </h1>
      {filteredItems.length > 0 ? (
        <div className="h-[calc(100vh-200px)] rounded bg-white">
        <table className="w-full bg-white shadow-md rounded-lg border overflow-y-auto">
          <thead>
            <tr className="bg-gray-200 h-10">
              <th className="p-3 border border-gray-300 text-left">Item Name</th>
              <th className="p-3 border border-gray-300 text-left">Quantity</th>
              <th className="p-3 border border-gray-300 text-left">Price</th>
              <th className="p-3 border border-gray-300 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <tr key={index} className="border-t h-10">
                <td className="p-3 border border-gray-300">{item.name}</td>
                <td className="p-3 border border-gray-300">{item.quantity}</td>
                <td className="p-3 border border-gray-300">${(item.price * item.quantity).toFixed(2)}</td>
                <td className="p-3 border border-gray-300 text-center">
                  <select className="bg-green-400 rounded-xl p-1 pl-2 text-black text-xs">
                    <option>Received</option>
                    <option>Cooking</option>
                    <option>Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <p className="text-gray-600">No items for this table.</p>
      )}

      <div className="text-center w-full bg-white font-semibold text-lg mt-3">
        Total: ${filteredItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
      </div>

      <div className="mt-4 space-x-2 text-center">
        <button className="bg-blue-950 text-white rounded-lg py-2 px-6" onClick={handlePrintAndSave}>Print & Save Bill</button>
        <button className="bg-blue-950 text-white rounded-lg py-2 px-6">Payment</button>
        <button className="bg-blue-950 text-white rounded-lg py-2 px-6">Settle Bill</button>
      </div>
    </>
  ) : (
    <p className="text-gray-500 text-lg text-center mt-10">Click on a table to view items.</p>
  )}
</div>
<Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="p-6 bg-white rounded shadow-lg w-1/3 mx-auto">
        {!isPrintView ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Does's PFC</h2>
            <p className="text-center">C-52, Janpath Rd, Atul Grove Road, Janpath, Connaught Place, New Delhi, Delhi 110001</p>
            <p className="text-center">Contact No: 9075444888</p>
            <p className="text-center">{Date.now()}</p>
            <hr className="my-2" />
            <p><strong>Bill No:</strong> WP00027</p>
            <p><strong>Order ID:</strong> 7e736ugTwEDhdMC2929</p>
            <p><strong>Table:</strong> Table 3</p>
            <p><strong>Status:</strong> Pending</p>
            <p><strong>User:</strong> admin</p>
            <hr className="my-2" />
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Item</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">{item.price}</td>
                    <td className="text-right">{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr className="my-2" />
            <p className="text-right font-semibold">Total Amount: Rs {filteredItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
            <p className="text-right font-semibold">Grand Total: Rs {filteredItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
            <p className="text-right">Rounded Amount: Rs 0.00</p>
            <p className="text-center font-semibold">Four Hundred Indian Rupee</p>
            <div className="flex justify-between mt-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handlePrint}>Print</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Printing Bill...</h2>
            <p>Please wait while the bill is being processed.</p>
          </div>
        )}
      </Modal>


      <ToastContainer position="top-center" />
    </div>
  );
}
const buttonStyle = {
  padding: "10px 20px",
  marginRight: "10px",
  backgroundColor: "#198754",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

export default OrdersSocket;
