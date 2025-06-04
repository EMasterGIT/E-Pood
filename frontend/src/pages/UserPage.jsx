import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserPage({ user }) {
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    const fetchUserCarts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/orders/my-carts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCarts(response.data);
      } catch (error) {
        console.error('Error fetching user carts:', error);
      }
    };

    if (user) fetchUserCarts();
  }, [user]);


  const activeCarts = carts.filter(c => c.Staatus === 'Aktiivne');
  const orderedCarts = carts.filter(c => c.Staatus === 'Kinnitatud');

  return (
    <div className="container mt-4">
      <h2>{user?.name || user?.email} - Konto info</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Telefon:</strong> {user.phone}</p>

      <hr />
      <h4>Aktivsed Ostukorvid</h4>
      {activeCarts.length === 0 ? <p>Aktiivset ostukorvi pole</p> : (
        activeCarts.map(cart => (
          <div key={cart.OstukorvID} className="mb-3 border rounded p-3">
            {cart.ostukorviTooted.map(item => (
              <p key={item.OstukorviToodeID}>
                <strong>{item.toode.Nimi}</strong> – {item.Kogus} tk – {item.Hind} €
              </p>
            ))}
          </div>
        ))
      )}

      <h4>Esitatud Tellimused</h4>
      {orderedCarts.length === 0 ? <p>Pole ühtegi tellimust</p> : (
        orderedCarts.map(cart => (
          <div key={cart.OstukorvID} className="mb-3 border rounded p-3 bg-light">
            <p><strong>Tellimuse Staatus:</strong> {cart.tellimus?.Staatus || 'Pole määratud'}</p>
            {cart.ostukorviTooted.map(item => (
              <p key={item.OstukorviToodeID}>
                <strong>{item.toode.Nimi}</strong> – {item.Kogus} tk – {item.Hind} €
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default UserPage;
