import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [featuredFilter, setFeaturedFilter] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    price: "",
    featured: false,
    company: "",
  });
  const history = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token, priceFilter, ratingFilter, featuredFilter]);

  const fetchProducts = async () => {
    try {
      let response;
      if (featuredFilter) {
        response = await axios.get(`${process.env.REACT_APP_HOST}/api/product/featured`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (priceFilter) {
        response = await axios.get(`${process.env.REACT_APP_HOST}/api/product/price/${priceFilter}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (ratingFilter) {
        response = await axios.get(`${process.env.REACT_APP_HOST}/api/product/rating/${ratingFilter}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.get(`${process.env.REACT_APP_HOST}/api/product/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = (productId) => {
    axios
      .delete(`${process.env.REACT_APP_HOST}/api/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts(
          products.filter((product) => product.productId !== productId)
        );
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

  const handleUpdate = (product) => {
    setEditingProduct(product);
    setUpdatedProduct({
      name: product.name,
      price: product.price,
      featured: product.featured,
      company: product.company,
    });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `${process.env.REACT_APP_HOST}/api/product/${editingProduct.productId}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setProducts(
          products.map((product) =>
            product.productId === editingProduct.productId
              ? response.data
              : product
          )
        );
        setEditingProduct(null);
      })
      .catch((error) => console.error("Error updating product:", error));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    history("/login");
  };

  const filteredProducts = products.filter((product) =>
    product && product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <div>
            {token ? (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 ml-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 ml-4">
                    Signup
                  </button>
                </Link>
                <Link to="/login">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 ml-4">
                    Login
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {token ? (
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Product List</h2>
              <Link to="/add-product">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                  Add Product
                </button>
              </Link>
            </div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border rounded-lg mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="number"
                placeholder="Filter by price less than..."
                className="w-full px-4 py-2 border rounded-lg mb-4"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              />
              <div className="mb-4">
                <label className="block mb-2">Filter by rating greater & equal then:</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full"
                />
                <div className="text-center mt-2">{ratingFilter}</div>
              </div>
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={featuredFilter}
                  onChange={(e) => setFeaturedFilter(e.target.checked)}
                />
                Featured
              </label>
            </div>
            <ul className="space-y-4">
              {filteredProducts.map((product) => (
                <li
                  key={product.productId}
                  className="border-b pb-2 flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold">{product.name}</span> - $
                    {product.price}
                  </div>
                  <div>
                    <button
                      onClick={() => handleUpdate(product)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 transition duration-200 mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(product.productId)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {editingProduct && (
              <form onSubmit={handleUpdateSubmit} className="mt-6">
                <h3 className="text-xl font-bold mb-4">Update Product</h3>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                  value={updatedProduct.name}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                  value={updatedProduct.price}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, price: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Company"
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                  value={updatedProduct.company}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, company: e.target.value })
                  }
                />
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={updatedProduct.featured}
                    onChange={(e) =>
                      setUpdatedProduct({
                        ...updatedProduct,
                        featured: e.target.checked,
                      })
                    }
                  />
                  Featured
                </label>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Update Product
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold">
              Please log in to see the products
            </h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductList;