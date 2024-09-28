import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const history = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HOST}/api/product/`)
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleDelete = (productId) => {
    axios.delete(`${process.env.REACT_APP_HOST}/api/product/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setProducts(products.filter(product => product.productId !== productId));
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

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
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Product List</h2>
            {token && (
              <Link to="/add-product">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                  Add Product
                </button>
              </Link>
            )}
          </div>
          <ul className="space-y-4">
            {products.map((product) => (
              <li
                key={product.productId}
                className="border-b pb-2 flex justify-between items-center"
              >
                <div>
                  <span className="font-semibold">{product.name}</span> - $
                  {product.price}
                </div>
                {token && (
                  <button
                    onClick={() => handleDelete(product.productId)}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ProductList;