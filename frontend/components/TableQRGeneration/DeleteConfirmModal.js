"use client"; // Ensures it runs on the client in Next.js App Router

import React from "react";

const DeleteConfirmModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
          <button
            className="bg-gray-200 px-4 py-2 rounded-lg"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
