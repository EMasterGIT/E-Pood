import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Cart({ user }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const handleOrder = async () => {
    if (!user) {
      alert('Palun logi sisse, et tellimus esitada');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/orders', { items: cart }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Tellimus esitatud edukalt!');
      localStorage.removeItem('cart');
      setCart([]);
    } catch (error) {
      console.error('Order error:', error);
      alert('Tellimuse esitamine ebaõnnestus');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Ostukorv</h2>
      {cart.length === 0 ? (
        <p>Ostukorv on tühi</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map((item, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                {item.Nimetus}
                <span>{item.Hind}€</span>
              </li>
            ))}
          </ul>
          <button className="btn btn-success" onClick={handleOrder}>Esita tellimus</button>
        </>
      )}
    </div>
  );
}