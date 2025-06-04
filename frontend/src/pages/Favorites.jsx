// Favorites.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, ShoppingCart } from 'lucide-react'; // Ikoonid lemmikute ja ostukorvi jaoks

export default function Favorites() {
  const [favoriteProductIds, setFavoriteProductIds] = useState([]); // Hoiab ainult lemmikute ID-sid
  const [favoriteProducts, setFavoriteProducts] = useState([]); // Hoaib täielikke lemmiktooteid
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState({}); // Jälgib, kas toode on lisamisel ostukorvi

  // Lae lemmikute ID-d kohalikust salvestusest
  useEffect(() => {
    const storedIds = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavoriteProductIds(storedIds);
  }, []);

  // Peamine lemmiktoodete üksikasjade laadimine
  useEffect(() => {
    const fetchFavoriteProductDetails = async () => {
      if (favoriteProductIds.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        
        const response = await axios.get('http://localhost:3001/api/products'); 
        const allProducts = response.data;
        
        const filteredFavorites = allProducts.filter(product =>
          favoriteProductIds.includes(product.ToodeID)
        );
        setFavoriteProducts(filteredFavorites);
        setError('');
      } catch (err) {
        console.error('Error lemmikute toodete kättesaamisel', err);
        setError('Lemmikute laadimine nurjus. Palun proovi hiljem uuesti.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProductDetails();
  }, [favoriteProductIds]); 

  // Funktsioon lemmikute eemaldamiseks
  const removeFromFavorites = (productId) => {
    setFavoriteProductIds(prev => {
      const updatedIds = prev.filter(id => id !== productId);
      localStorage.setItem('favorites', JSON.stringify(updatedIds));
      return updatedIds;
    });
    // Uuenda kuvatud lemmikute nimekiri
    setFavoriteProducts(prev => prev.filter(product => product.ToodeID !== productId));
  };

  // Funktsioon toote lisamiseks ostukorvi
  const addToCart = async (product) => {
    try {
      setAddingToCart(prev => ({ ...prev, [product.ToodeID]: true }));
      
      // Kontrolli, kas kasutaja on sisse logitud
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        alert('Palun logi sisse, et tooteid ostukorvi lisada.');
        return;
      }

      const response = await axios.post(
        'http://localhost:3001/api/cart',
        {
          toodeId: product.ToodeID,
          kogus: 1 
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        alert(`${product.Nimi} lisati ostukorvi!`);
        
        
      }
    } catch (err) {
      console.error('Error ostukorvi lisamisel:', err);
      
      if (err.response?.status === 401) {
        alert('Palun logi sisse, et tooteid ostukorvi lisada.');
      } else if (err.response?.status === 400) {
        alert(err.response.data.error || 'Toote lisamine ostukorvi ebaõnnestus.');
      } else {
        alert('Toote lisamine ostukorvi ebaõnnestus. Palun proovi hiljem uuesti.');
      }
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.ToodeID]: false }));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lemmikud</h2> 
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Laen</span>
          </div>
          <p className="mt-2">Laen lemmikuid</p>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && favoriteProducts.length === 0 ? (
        <p>Sul pole lemmikuid veel</p>
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
                    className="text-danger" 
                    fill="currentColor"
                  />
                </button>

                <div 
                          className="d-flex justify-content-center align-items-center bg-light overflow-hidden"
                          style={{ height: '200px' }}
                        >
                          <img
                            src={
                              product.PiltUrl && product.PiltUrl.trim()
                                ? product.PiltUrl
                                : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI2MCIgcj0iMTAiIGZpbGw9IiNjY2MiLz48cGF0aCBkPSJNMzAgMTQwaDE0MGwtMzAtNDBMMTIwIDEyMGwtMjAgMjB6IiBmaWxsPSIjY2NjIi8+PC9zdmc+'
                            }
                            alt={
                              product.PiltUrl && product.PiltUrl.trim()
                                ? (product.Nimi || 'Toode')
                                : 'Pilt' 
                            }
                            className="img-fluid"
                            style={{ 
                              maxHeight: '100%', 
                              maxWidth: '100%', 
                              objectFit: 'contain',
                              objectPosition: 'center'
                            }}
                          />
                        </div>



                <div className="card-body d-flex flex-column">
                  <span className="badge bg-secondary mb-2 align-self-start">
                    {product.Kategooria}
                  </span>
                  <h6 className="card-title">{product.Nimi}</h6>
                  <div className="small text-muted mb-2">
                    <span>📍 {product.Asukoht}</span>
                    <span className="ms-2">📦 {product.Laoseis} tk laos</span>
                  </div>
                  <div className="mt-auto">
                    <div className="d-flex align-items-center mb-2">
                      <span className="h5 text-danger mb-0">
                        {parseFloat(product.Hind || 0).toFixed(2)}€
                      </span>
                    </div>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => addToCart(product)}
                      disabled={product.Laoseis === 0 || addingToCart[product.ToodeID]}
                    >
                      <ShoppingCart size={16} className="me-2" />
                      {addingToCart[product.ToodeID] 
                        ? 'Lisan...' 
                        : product.Laoseis === 0 
                          ? 'Otsas' 
                          : 'Lisa ostukorvi'
                      }
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