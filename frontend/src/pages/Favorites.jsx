import { useEffect, useState } from 'react';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(stored);
  }, []);

  return (
    <div className="container mt-4">
      <h2>Lemmikud</h2>
      {favorites.length === 0 ? (
        <p>Ei ole lemmiktooteid</p>
      ) : (
        <ul className="list-group">
          {favorites.map((item, idx) => (
            <li key={idx} className="list-group-item">
              {item.Nimetus} - {item.Hind}€
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}