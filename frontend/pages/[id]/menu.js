import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaEdit, FaTrashAlt } from "react-icons/fa";
import MenuModal from "../../components/MenuModal";
import axios from "axios";
import DeleteConfirmModal from "../../components/TableQRGeneration/DeleteConfirmModal";
import { useRouter } from "next/router";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const router = useRouter();
  const { id } = router.query; 
  const [showModal, setShowModal] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); 
  const [itemToDelete, setItemToDelete] = useState(null); 
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    isVeg: false,
    halfPrice: "",
    fullPrice: "",
    category: "",
    prepTime: "",
  });
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/menu/getMenuItems");
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleAddItem = () => {
    setEditItemId(null); 
    setFormData({
      title: "",
      description: "",
      image: null,
      isVeg: false,
      halfPrice: "",
      fullPrice: "",
      category: "",
      prepTime: "",
    });
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setEditItemId(item._id);
    setFormData({
      title: item.title,
      description: item.description,
      image: item.image,
      isVeg: item.isVeg,
      halfPrice: item.halfPrice,
      fullPrice: item.fullPrice,
      category: item.category,
      prepTime: item.prepTime,
    });
    setShowModal(true);
  };

  const handleDeleteItem = async () => {
    try {
      await axios.delete(`http://localhost:5000/menu/deleteMenuItem/${itemToDelete}`);
      setMenuItems(menuItems.filter((item) => item._id !== itemToDelete));
      setDeleteModalVisible(false); 
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("image", formData.image);
      data.append("isVeg", formData.isVeg);
      data.append("halfPrice", formData.halfPrice);
      data.append("fullPrice", formData.fullPrice);
      data.append("category", formData.category);
      data.append("prepTime", formData.prepTime);

      if (editItemId) {
        await axios.put(`http://localhost:5000/menu/updateMenuItem/${editItemId}`, data);
        setMenuItems((prevItems) =>
          prevItems.map((item) =>
            item._id === editItemId ? { ...item, ...formData } : item
          )
        );
      } else {
        const response = await axios.post("http://localhost:5000/menu/saveMenuItem", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setMenuItems([...menuItems, response.data]);
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
    console.log('frontend request');
    try {
      const response = await axios.post("http://localhost:5000/menu/uploadExcel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      setMenuItems([...menuItems, ...response.data]);
      alert("Menu items successfully added from the Excel file!");
    } catch (error) {
      console.error("Error uploading Excel file:", error);

    if (error.response && error.response.status === 404) {
      const errorMessage = error.response.data;

      alert(`Please add these missing fields in your excel sheet: ${errorMessage}`);
    } else {
      alert("Failed to upload Excel file. Please try again.");
    }
    }
  };
  
  return (
    <div>
     <div className="flex justify-center items-center mb-6 space-x-6 mt-6">
        <button
          className="rounded-3xl bg-black text-white p-4 flex items-center"
          onClick={handleAddItem}
        >
          <FaPlusCircle />
          <span className="ml-2 font-bold">Add item</span>
        </button>
        <label htmlFor="upload-file" className="rounded-3xl bg-black text-white p-4 flex items-center cursor-pointer">
          <FaPlusCircle />
          <span className="ml-2 font-bold">Upload Excel</span>
        </label>
        <input
          type="file"
          id="upload-file"
          className="hidden"
          accept=".xlsx, .xls"
          onChange={handleUploadFile}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
          >
            <img
              src={`http://localhost:5000${item.image}`}
              alt={item.title}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="text-sm font-semibold">₹{item.fullPrice} (Full)</p>
            <p className="text-sm font-semibold">₹{item.halfPrice} (Half)</p>
            <div className="flex mt-4 space-x-4">
              <button
                className="px-3 py-1 bg-yellow-400 text-white rounded-md"
                onClick={() => handleEditItem(item)}
              >
                <FaEdit />
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded-md"
                onClick={() => {
                  setItemToDelete(item._id);
                  setDeleteModalVisible(true); 
                }}
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
      <MenuModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        formData={formData}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
      />
      {deleteModalVisible && (
        <DeleteConfirmModal
          onConfirm={handleDeleteItem}
          onCancel={() => setDeleteModalVisible(false)} 
        />
      )}
    </div>
  );
};

export default Menu;
