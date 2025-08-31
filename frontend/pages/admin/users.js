import React, { useEffect, useState } from "react";


function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [visitDetails, setVisitDetails] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", mobileNumber: "" });

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleVisitDetails = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/users/visit-details/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setVisitDetails(data.visitDetails);
        setShowVisitModal(true);
      } else {
        console.error("Failed to fetch visit details.");
      }
    } catch (error) {
      console.error("Error fetching visit details:", error);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, mobileNumber: user.mobileNumber });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/users/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowEditModal(false);
        fetchUsers(); // Refresh user list
      } else {
        console.error("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="userpage-container">
      <h1 className="userpage-title">User Management</h1>
      <div className="userpage-table-container">
        <table className="userpage-table">
          <thead>
            <tr>
              <th className="userpage-th">Name</th>
              <th className="userpage-th">Email</th>
              <th className="userpage-th">Phone Number</th>
              <th className="userpage-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="userpage-row">
                <td className="userpage-td">{user.name}</td>
                <td className="userpage-td">{user.email}</td>
                <td className="userpage-td">{user.mobileNumber}</td>
                <td className="userpage-td userpage-actions">
                  <button
                    className="userpage-btn userpage-edit-btn"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="userpage-btn userpage-visit-btn"
                    onClick={() => handleVisitDetails(user._id)}
                  >
                    Visit Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="userpage-modal">
          <div className="userpage-modal-content">
            <h2 className="userpage-modal-title">Edit User</h2>
            <form onSubmit={handleEditSubmit}>
              <label className="userpage-form-label">Name</label>
              <input
                type="text"
                className="userpage-form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <label className="userpage-form-label">Email</label>
              <input
                type="email"
                className="userpage-form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <label className="userpage-form-label">Phone Number</label>
              <input
                type="text"
                className="userpage-form-input"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                required
              />

              <button type="submit" className="userpage-form-submit-btn">Save</button>
              <button
                type="button"
                className="userpage-modal-close-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Visit Details Modal */}
      {showVisitModal && visitDetails && (
        <div className="userpage-modal">
          <div className="userpage-modal-content">
            <h2 className="userpage-modal-title">Visit Details</h2>
            <ul className="userpage-visit-list">
            {visitDetails.map((detail, index) => (
          <li key={index} className="visit-details-item">
            <span className="visit-details-id">{index + 1}. </span>
            <strong>{detail.restaurantName}</strong>: {detail.visitCount} visits
          </li>
        ))}
            </ul>
            <button
              className="userpage-modal-close-btn"
              onClick={() => setShowVisitModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
