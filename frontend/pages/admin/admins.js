import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";


const AdminPage = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/superadmin")
      .then((response) => response.json())
      .then((data) => setAdmins(data))
      .catch((error) => console.error("Error fetching admins:", error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      fetch(`http://localhost:5000/superadmin/${id}`, { method: "DELETE" })
        .then((response) => {
          if (response.ok) {
            setAdmins(admins.filter((admin) => admin._id !== id));
            alert("Admin deleted successfully.");
          } else {
            alert("Failed to delete admin.");
          }
        })
        .catch((error) => console.error("Error deleting admin:", error));
    }
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setEditForm({ ...admin }); // Initialize the form with the current admin data
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    if (window.confirm("Are you sure you want to update this admin?")) {
      fetch(`http://localhost:5000/superadmin/${selectedAdmin._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      })
        .then((response) => {
          if (response.ok) {
            setAdmins((prev) =>
              prev.map((admin) =>
                admin._id === selectedAdmin._id
                  ? { ...admin, ...editForm }
                  : admin
              )
            );
            alert("Admin updated successfully.");
            setShowModal(false);
          } else {
            alert("Failed to update admin.");
          }
        })
        .catch((error) => console.error("Error updating admin:", error));
    }
  };

  return (
    <div className="admin-page">
      <h1>Admins List</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Restaurant Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.phoneNumber}</td>
              <td>{admin.restaurant_name}</td>
              <td className="admindetailsaction">
                <button
                  className="edit-button"
                  onClick={() => handleEdit(admin)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(admin._id)}
                >
                  <FaTrashAlt /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="adminpagemodal">
          <div className="adminpagemodal-content">
            <h2>Edit Admin</h2>
            <div className="adminpageform-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
              />
              <button
                className="adminpagechange-button"
                onClick={() => alert("Change name if needed.")}
              >
                Change
              </button>
            </div>
            <div className="adminpageform-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
              />
              <button
                className="adminpagechange-button"
                onClick={() => alert("Change email if needed.")}
              >
                Change
              </button>
            </div>
            <div className="adminpageform-group">
              <label>Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={editForm.phoneNumber}
                onChange={handleInputChange}
              />
              <button
                className="adminpagechange-button"
                onClick={() => alert("Change phone number if needed.")}
              >
                Change
              </button>
            </div>
            <div className="adminpageform-group">
              <label>Rest Name:</label>
              <input
                type="text"
                name="restaurant_name"
                value={editForm.restaurant_name}
                onChange={handleInputChange}
              />
              <button
                className="adminpagechange-button"
                onClick={() => alert("Change restaurant name if needed.")}
              >
                Change
              </button>
            </div>
            <button className="update-button" onClick={handleUpdate}>
              Update Details
            </button>
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
