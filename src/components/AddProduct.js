import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [featured, setFeatured] = useState(false);
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !company || !rating) {
      setError("All fields are required");
      return;
    }
    if (isNaN(price) || isNaN(rating)) {
      setError("Price and Rating must be numbers");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .post(
        `${process.env.REACT_APP_HOST}/api/product/add`,
        {
          name,
          price,
          featured,
          company,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Product added:", response.data);
        setName("");
        setPrice("");
        setFeatured(false);
        setCompany("");
        setRating("");
        setError("");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        setError("Error adding product");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Product</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price:</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Featured:</label>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Company:</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Rating:</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              min="1"
              max="5"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 mb-4"
            disabled={loading}
          >
            {loading ? (
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            ) : (
              "Add Product"
            )}
          </button>
        </form>
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default AddProduct;