import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/superadmin/requests`);
        setRequests(response.data.request);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch requests");
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);
  const handleAction = async (id, action) => {
    if (action === "accept") {
      try {
        await axios.delete(`http://localhost:5000/superadmin/requests/${id}`);
        toast.success("QR code has been generated and request accepted!");
        setRequests(requests.filter((request) => request._id !== id));
      } catch (err) {
        toast.error(`Failed to accept the request: ${err.response?.data?.error || err.message}`);
      }
    } else if (action === "reject") {
      try {
        await axios.delete(`http://localhost:5000/superadmin/requests/${id}`);
        toast.info("Request rejected successfully.");
        setRequests(requests.filter((request) => request._id !== id));
      } catch (err) {
        toast.error(`Failed to reject the request: ${err.response?.data?.error || err.message}`);
      }
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="requests-page">
      <h1>Requests</h1>
      <table className="requests-table">
        <thead>
          <tr>
            {/* <th>#</th> */}
            <th>TableNo</th>
            <th>Table Description</th>
            <th>Restaurant Name</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={request._id}>
              {/* <td>{index + 1}</td> */}
              <td>{request.tableNo}</td>
              <td>{request.tableDescription || "N/A"}</td>
              <td>{request.restaurantName}</td>
              <td>{new Date(request.time).toLocaleString()}</td>
              <td>
                <button
                  className="accept-btn"
                  onClick={() => handleAction(request._id, "accept")}
                >
                  Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleAction(request._id, "reject")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default RequestsPage;
