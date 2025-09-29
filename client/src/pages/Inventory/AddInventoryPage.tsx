import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Package, Calendar, MapPin, DollarSign, Plus, Edit } from "lucide-react";
// import { getInventoryItemById, saveInventoryItem } from "../api/inventory"; // API placeholder

const AddEditInventoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // check if edit mode
  const isEdit = Boolean(id);

  // Role restriction: only admin & pharmacist can add/edit
  if (user?.role !== "admin" && user?.role !== "pharmacist") {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900">Access Denied 🚫</h2>
        <p className="text-gray-600">
          Only Admins and Pharmacists can add or edit inventory items.
        </p>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    name: "",
    category: "medicine",
    currentStock: "",
    minStock: "",
    unit: "pcs",
    expiryDate: "",
    location: "",
    supplier: "",
    price: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // Load data if editing
  useEffect(() => {
    if (isEdit) {
      // Replace with API call:
      // getInventoryItemById(id).then((data) => setFormData(data));
      // For now, mock pre-fill:
      setFormData({
        name: "Paracetamol",
        category: "medicine",
        currentStock: "50",
        minStock: "10",
        unit: "pcs",
        expiryDate: "2025-12-31",
        location: "Shelf A2",
        supplier: "MediLife Pharma",
        price: "15.00",
      });
    }
    setLoading(false);
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Item name is required";
    if (!formData.currentStock || isNaN(Number(formData.currentStock)))
      newErrors.currentStock = "Enter a valid stock quantity";
    if (!formData.minStock || isNaN(Number(formData.minStock)))
      newErrors.minStock = "Enter a valid minimum stock";
    if (!formData.price || isNaN(Number(formData.price)))
      newErrors.price = "Enter a valid price";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isEdit) {
      console.log("Updated Item:", { id, ...formData });
      alert("Item updated successfully ✅");
    } else {
      console.log("New Item Added:", formData);
      alert("Item added successfully ✅");
    }

    // saveInventoryItem(formData) -> API call

    navigate("/inventory");
  };

  if (loading) {
    return <p className="text-center py-6">Loading item details...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow border">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        {isEdit ? (
          <>
            <Edit className="w-6 h-6 text-blue-600 mr-2" /> Edit Inventory Item
          </>
        ) : (
          <>
            <Plus className="w-6 h-6 text-blue-600 mr-2" /> Add New Inventory Item
          </>
        )}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Item Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Item Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Paracetamol"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Category & Unit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="medicine">Medicine</option>
              <option value="equipment">Equipment</option>
              <option value="supplies">Supplies</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. pcs, ml, box"
            />
          </div>
        </div>

        {/* Stock & Min Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Stock
            </label>
            <input
              type="number"
              name="currentStock"
              value={formData.currentStock}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.currentStock && (
              <p className="text-sm text-red-600">{errors.currentStock}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Stock
            </label>
            <input
              type="number"
              name="minStock"
              value={formData.minStock}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.minStock && (
              <p className="text-sm text-red-600">{errors.minStock}</p>
            )}
          </div>
        </div>

        {/* Expiry & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-500" /> Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-gray-500" /> Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Pharmacy Shelf A2"
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Supplier & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Supplier Name"
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <DollarSign className="w-4 h-4 mr-1 text-gray-500" /> Unit Price
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="₹"
            />
            {errors.price && (
              <p className="text-sm text-red-600">{errors.price}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/inventory")}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isEdit ? "Update Item" : "Save Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditInventoryPage;
