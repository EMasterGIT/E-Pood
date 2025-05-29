// Favorites.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, ShoppingCart } from 'lucide-react'; // For consistency with EpoodPage icons

export default function Favorites() {
  const [favoriteProductIds, setFavoriteProductIds] = useState([]); // Stores just the IDs from localStorage
  const [favoriteProducts, setFavoriteProducts] = useState([]); // Stores full product objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartItemsCount, setCartItemsCount] = useState(0); // To update cart count if adding from favorites

  // Load favorite IDs from localStorage on mount
  useEffect(() => {
    const storedIds = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavoriteProductIds(storedIds);
  }, []);

  // Fetch full product details once favorite IDs are loaded or change
  useEffect(() => {
    const fetchFavoriteProductDetails = async () => {
      if (favoriteProductIds.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Assuming your backend has an endpoint to fetch products by ID or a list of IDs
        // For simplicity, we'll fetch all products and filter. A better way is a dedicated backend endpoint.
        const response = await axios.get('http://localhost:3001/api/products'); // Fetch all products
        const allProducts = response.data;
        
        const filteredFavorites = allProducts.filter(product =>
          favoriteProductIds.includes(product.ToodeID)
        );
        setFavoriteProducts(filteredFavorites);
        setError('');
      } catch (err) {
        console.error('Error fetching favorite product details:', err);
        setError('Failed to load favorite product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProductDetails();
  }, [favoriteProductIds]); // Rerun when favorite IDs change

  // Function to remove from favorites (consistent with EpoodPage)
  const removeFromFavorites = (productId) => {
    setFavoriteProductIds(prev => {
      const updatedIds = prev.filter(id => id !== productId);
      localStorage.setItem('favorites', JSON.stringify(updatedIds));
      return updatedIds;
    });
    // Also update the displayed products immediately
    setFavoriteProducts(prev => prev.filter(product => product.ToodeID !== productId));
  };

  const addToCart = (product) => {
    try {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const updatedCart = [...storedCart, product];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItemsCount(updatedCart.length); // Update count
      alert(`${product.Nimetus} added to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Your Favorites</h2> {/* Changed title */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading favorites...</p>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && favoriteProducts.length === 0 ? (
        <p>You have no favorite products yet.</p>
      ) : (
        <div className="row g-4">
          {favoriteProducts.map((product) => (
            <div key={product.ToodeID} className="col-lg-3 col-md-4 col-sm-6">
              <div className="card h-100 shadow-sm position-relative">
                <button
                  className="btn btn-sm position-absolute top-0 end-0 m-2 border-0 bg-white rounded-circle shadow-sm"
                  onClick={() => removeFromFavorites(product.ToodeID)}
                >
                  <Heart
                    size={20}
                    className="text-danger" // Always show as filled/red in favorites page
                    fill="currentColor"
                  />
                </button>

                <div className="d-flex justify-content-center align-items-center bg-light">
                  <img
                    src={
                      product.Pilt
                        ? `http://localhost:3001/${product.Pilt}`
                        : '/uploads/placeholder.jpg'
                    }
                    alt={product.Nimetus}
                    className="img-fluid"
                    style={{ height: '200px', objectFit: 'contain' }}
                  />
                </div>

                <div className="card-body d-flex flex-column">
                  <span className="badge bg-secondary mb-2 align-self-start">
                    {product.Kategooria}
                  </span>
                  <h6 className="card-title">{product.Nimetus}</h6>
                  <div className="small text-muted mb-2">
                    <span>📍 {product.Asukoht}</span>
                    <span className="ms-2">📦 {product.Kogus} tk laos</span>
                  </div>
                  <div className="mt-auto">
                    <div className="d-flex align-items-center mb-2">
                      <span className="h5 text-danger mb-0">
                        {parseFloat(product.Hind).toFixed(2)}€
                      </span>
                    </div>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => addToCart(product)}
                      disabled={product.Kogus === 0}
                    >
                      <ShoppingCart size={16} className="me-2" />
                      {product.Kogus === 0 ? 'Otsas' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}