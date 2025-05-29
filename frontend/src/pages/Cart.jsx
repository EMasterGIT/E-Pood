import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';

export default function Cart({ user }) {
  const [dbCart, setDbCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const sortedItems = [...cartItems].sort((a, b) => a.ToodeID - b.ToodeID);

  const calculateTotal = useCallback((items) => {
    if (!Array.isArray(items)) return setTotal(0);
    const sum = items.reduce((acc, item) => {
      // Use current price from the Toode table if available, otherwise use cart price
      const price = item.toode?.Hind ? parseFloat(item.toode.Hind) : parseFloat(item.Hind);
      const quantity = parseInt(item.Kogus);
      if (isNaN(price) || isNaN(quantity)) return acc;
      return acc + price * quantity;
    }, 0);
    setTotal(sum.toFixed(2));
  }, []);

  const fetchCart = useCallback(async () => {
    if (!user?.id) {
      setCartItems([]);
      setTotal(0);
      setDbCart(null);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/cart/${user.id}`);
      const ostukorv = response.data;
      const cartItems = ostukorv?.ostukorviTooted || [];

      setDbCart(ostukorv);
      setCartItems(cartItems);
      calculateTotal(cartItems);
      setOrderPlaced(false); // Reset order placed status when cart is found
    } catch (error) {
      if (error.response?.status === 404) {
        // No cart found – treat as empty cart
        setDbCart(null);
        setCartItems([]);
        setTotal(0);
        // Don't show "order placed" message if user just has no cart
        if (!orderPlaced) {
          setOrderPlaced(false);
        }
      } else {
        console.error('Error fetching cart:', error);
        setDbCart(null);
        setCartItems([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  }, [user, calculateTotal, orderPlaced]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  function updateCartCount(cart) {
    if (!cart || !cart.ostukorviTooted) return;
    const uniqueProductCount = cart.ostukorviTooted.length;
    console.log('Cart product count:', uniqueProductCount);
    // set this count to your state or display in UI
  }

  const removeItemFromCart = async (productId) => {
    try {
      setLoading(true);
      await api.delete(`/cart/${productId}`);
      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Toote eemaldamine ebaõnnestus.');
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setLoading(true);
      await api.put(`/cart/${productId}`, { quantity: newQuantity });
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Koguse uuendamine ebaõnnestus.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!user?.id || !dbCart || cartItems.length === 0) {
      alert('Tellimuse esitamine ebaõnnestus. Kontrolli, kas oled sisse logitud ja korv ei ole tühi.');
      return;
    }

    if (!deliveryLocation.trim()) {
      alert('Palun sisesta tarneaadress.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/orders', {
        ostukorvId: dbCart.OstukorvID,
        location: deliveryLocation,
      });
      
      setOrderPlaced(true);
      alert('Tellimus edukalt esitatud!');
      
      // Clear local state
      setCartItems([]);
      setDbCart(null);
      setTotal(0);
      setDeliveryLocation('');
      
    } catch (error) {
      console.error('Order submission error:', error);
      if (error.response?.data?.error) {
        alert(`Tellimuse esitamine ebaõnnestus: ${error.response.data.error}`);
      } else {
        alert('Tellimuse esitamine ebaõnnestus.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Display current price or cart price with indication
  const getDisplayPrice = (item) => {
    const currentPrice = item.toode?.Hind ? parseFloat(item.toode.Hind) : null;
    const cartPrice = parseFloat(item.Hind);
    
    if (currentPrice !== null && currentPrice !== cartPrice) {
      return {
        price: currentPrice,
        hasChanged: true,
        oldPrice: cartPrice
      };
    }
    
    return {
      price: cartPrice,
      hasChanged: false,
      oldPrice: null
    };
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h2>Ostukorv</h2>
        <p>Laeb...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Ostukorv</h2>
      {orderPlaced && cartItems.length === 0 ? (
        <div className="alert alert-success">
          <h4>Tellimus esitatud!</h4>
          <p>Teie tellimus on edukalt esitatud ja töösse võetud. Täname!</p>
        </div>
      ) : cartItems.length === 0 ? (
        <p>Ostukorv on tühi</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {sortedItems.map((item) => {
              const priceInfo = getDisplayPrice(item);
              const totalItemPrice = (priceInfo.price * item.Kogus).toFixed(2);
              
              return (
                <li key={item.ToodeID} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{item.toode?.Nimi || 'Tundmatu Toode'}</strong>
                    {priceInfo.hasChanged && (
                      <div className="text-warning small">
                        ⚠️ Hind on muutunud: {priceInfo.oldPrice.toFixed(2)}€ → {priceInfo.price.toFixed(2)}€
                      </div>
                    )}
                    {item.toode && item.Kogus > item.toode.Kogus && (
                      <div className="text-danger small">
                        ⚠️ Laos ainult {item.toode.Kogus} tk
                      </div>
                    )}
                    <div className="mt-1 d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => updateItemQuantity(item.ToodeID, item.Kogus - 1)}
                        disabled={loading}
                      >−</button>
                      <span>{item.Kogus} tk</span>
                      <button
                        className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={() => updateItemQuantity(item.ToodeID, item.Kogus + 1)}
                        disabled={loading || (item.toode && item.Kogus >= item.toode.Kogus)}
                      >+</button>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="mb-1">
                      <strong>{totalItemPrice}€</strong>
                      <br />
                      <small className="text-muted">{priceInfo.price.toFixed(2)}€ × {item.Kogus}</small>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeItemFromCart(item.ToodeID)}
                      disabled={loading}
                    >
                      Eemalda
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mb-3">
            <label htmlFor="deliveryLocationInput" className="form-label">Tarneaadress</label>
            <input
              type="text"
              className="form-control"
              id="deliveryLocationInput"
              placeholder="Sisesta tarneaadress"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Kokku:</h4>
            <h4>{total}€</h4>
          </div>

          <button 
            className="btn btn-success btn-lg w-100" 
            onClick={handleOrder}
            disabled={loading || cartItems.length === 0}
          >
            {loading ? 'Töötleb...' : 'Esita tellimus'}
          </button>
        </>
      )}
    </div>
  );
}