import React from 'react';
import api from '../api'; // Import your configured Axios instance

export default function ProductCard({ product, user, onAddToCartSuccess }) { // Add onAddToCartSuccess prop
  const handleAddToCart = async () => {
    if (!user || !user.id) {
      alert('You must be logged in to add items to cart.');
      return;
    }
    try {
      // Assuming you always add 1 quantity from the product list
      await api.post('/cart', {
        toodeId: product.ToodeID,
        quantity: 1, // Or let the user specify quantity
      });
      alert(`${product.Nimetus} lisati ostukorvi!`);
      if (onAddToCartSuccess) {
        onAddToCartSuccess(); // Callback to trigger cart re-fetch in parent if needed (e.g., in Cart.jsx)
      }
    } catch (error) {
      console.error('Error adding to cart:', error.response ? error.response.data : error.message);
      alert(`Toote lisamine ostukorvi ebaõnnestus: ${error.response?.data?.error || 'Server error'}`);
    }
  };

  return (
    <div className="card h-100">
      {/* ... product display ... */}
      <div className="card-body">
        <h5 className="card-title">{product.Nimetus}</h5>
        <p className="card-text">{product.Kategooria}</p>
        <p className="card-text">Hind: {parseFloat(product.Hind).toFixed(2)}€</p>
        <p className="card-text">Laos: {product.Kogus}</p>
        {user && user.id ? ( // Only show add to cart if user is logged in
          <button className="btn btn-primary" onClick={handleAddToCart} disabled={product.Kogus === 0}>
            {product.Kogus === 0 ? 'Laost otsas' : 'Lisa ostukorvi'}
          </button>
        ) : (
          <p className="text-muted">Logi sisse, et ostukorvi lisada</p>
        )}
      </div>
    </div>
  );
}