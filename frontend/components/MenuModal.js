"use client"; 

import React from "react";
import Image from "next/image"; 

const MenuModal = ({ show, onClose, onSave, formData, handleInputChange }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-1/2">
        <h2 className="text-xl font-bold mb-4">Add Menu Item</h2>
        <form onSubmit={onSave}>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="block w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="block w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input
                type="file"
                name="image"
                onChange={(e) => {
                  const file = e.target.files[0]; 
                  handleInputChange({ target: { name: "image", value: file } });
                }}
                className="block w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isVeg"
                checked={formData.isVeg}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Is Veg</label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Half Price</label>
              <input
                type="number"
                name="halfPrice"
                value={formData.halfPrice}
                onChange={handleInputChange}
                className="block w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Price</label>
              <input
                type="number"
                name="fullPrice"
                value={formData.fullPrice}
                onChange={handleInputChange}
                className="block w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="block w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time</label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleInputChange}
                className="block w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuModal;
