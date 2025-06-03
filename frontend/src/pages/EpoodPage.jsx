import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, Heart, Menu } from 'lucide-react';
import axios from 'axios';
import api from '../api'; 
import ProductCard from '../components/ProductCard'; 

const EpoodPage = ({ loadCart }) => {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Kõik tooted');
  const [sortBy, setSortBy] = useState('Nimi'); 
  const [sortOrder, setSortOrder] = useState('ASC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Saad kategooriad unikaalsete toodete loendist
  const categories = ['Kõik tooted', ...new Set(originalProducts.map(p => p.Kategooria))];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory, sortBy, sortOrder, originalProducts]);

  // Laeb ostukorvi, kui see on saadaval
  useEffect(() => {
    if (loadCart) {
      loadCart();
    }
  }, [loadCart]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3001/api/products');
      setOriginalProducts(res.data);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError('Toodete laadimine ebaõnnestus.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...originalProducts];
    
    if (searchQuery) {
      filtered = filtered.filter(p =>
        (p.Nimi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.Kirjeldus || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'Kõik tooted') {
      filtered = filtered.filter(p => p.Kategooria === selectedCategory);
    }
    
    // Filtreeri välja tooted, mille laoseis on 0 või vähem
    filtered = filtered.filter(p => (p.Laoseis || 0) > 0);
    
    filtered.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (typeof valA === 'string') {
        return sortOrder === 'ASC'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortOrder === 'ASC' ? valA - valB : valB - valA;
    });
    
    setProducts(filtered);
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('_');
    setSortBy(field);
    setSortOrder(order);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const toggleFavorite = (id) => {
    let updatedFavorites = [...favorites];
    if (favorites.includes(id)) {
      updatedFavorites = updatedFavorites.filter(fid => fid !== id);
    } else {
      updatedFavorites.push(id);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const user = JSON.parse(localStorage.getItem('user'));
  
  // Edukas ostukorvi lisamine
  const handleAddToCartSuccess = () => {
    if (loadCart) {
      loadCart(); // Värskenda ostukorvi, kui see on saadaval
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Laeb...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Otsingu ja kategooria filter */}
      <div className="container py-3">
        <div className="row align-items-center">
          <div className="col-md-6">
            <form onSubmit={handleSearch}>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control form-control-lg pe-5"
                  placeholder="Otsi toodet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn position-absolute top-50 end-0 translate-middle-y me-2 border-0"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            {/* Parempolne äär */}
          </div>
        </div>
      </div>
  
      {/* Kategooria Nav */}
      <div className="bg-light border-top">
        <div className="container">
          <nav className="py-2">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary btn-sm dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <Menu size={16} className="me-1" />
                  Tooted
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" onClick={() => setSelectedCategory('Kõik tooted')}>
                      Kõik tooted
                    </button>
                  </li>
                  {categories.filter(cat => cat !== 'Kõik tooted').map((cat) => (
                    <li key={cat}>
                      <button
                        className={`dropdown-item ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <span className="ms-2 small text-muted">
                Valitud: <strong>{selectedCategory}</strong>
              </span>
            </div>
          </nav>
        </div>
      </div>
  
      {/* Main  */}
      <main className="container py-4">
        {error && <div className="alert alert-danger">{error}</div>}
  
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>
            {selectedCategory} <span className="text-muted ms-2">({products.length} toodet)</span>
          </h3>
          <div>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={`${sortBy}_${sortOrder}`}
              onChange={handleSortChange}
            >
              <option value="Nimi_ASC">Nimi A-Z</option>
              <option value="Nimi_DESC">Nimi Z-A</option>
              <option value="Hind_ASC">Hind: odavam enne</option>
              <option value="Hind_DESC">Hind: kallim enne</option>
              <option value="Kogus_DESC">Kogus: rohkem enne</option>
            </select>
          </div>
        </div>
  
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Laadime tooteid...</p>
          </div>
        ) : (
          <div className="row g-4">
            {products.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p className="text-muted fs-5">Ühtegi toodet ei leitud</p>
                {searchQuery && (
                  <button className="btn btn-outline-primary" onClick={() => setSearchQuery('')}>
                    Tühjenda otsing
                  </button>
                )}
              </div>
            ) : (
              products.map((product) => (
                <div key={product.ToodeID} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="position-relative">
                    {/* Lemmiku nupp */}
                    <button
                      className="btn btn-sm position-absolute top-0 end-0 m-2 border-0 bg-white rounded-circle shadow-sm"
                      style={{ zIndex: 10 }}
                      onClick={() => toggleFavorite(product.ToodeID)}
                    >
                      <Heart
                        size={20}
                        className={favorites.includes(product.ToodeID) ? 'text-danger' : 'text-muted'}
                        fill={favorites.includes(product.ToodeID) ? 'currentColor' : 'none'}
                      />
                    </button>
                    
                    {/* Kui on madal laoseis */}
                    {product.Laoseis <= 5 && (
                      <div className="position-absolute top-0 start-0 bg-warning text-dark px-2 py-1 rounded-end" style={{ zIndex: 10 }}>
                        <small>Vähe laos</small>
                      </div>
                    )}
                    
                    {/* Toote kaardi komponent */}
                    <ProductCard 
                      product={product} 
                      user={user} 
                      onAddToCartSuccess={handleAddToCartSuccess}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
  
      {/* Footer */}
      <footer className="bg-dark text-white py-5 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <h5 className="text-danger">E-RIMI</h5>
              <p className="text-muted">Teie usaldusväärne toidupood internetis</p>
            </div>
            <div className="col-md-3">
              <h6>Teenused</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-light text-decoration-none">Tarneviisid</a></li>
                <li><a href="#" className="text-light text-decoration-none">Makseviisid</a></li>
                <li><a href="#" className="text-light text-decoration-none">Tagastamine</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>Abi</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-light text-decoration-none">KKK</a></li>
                <li><a href="#" className="text-light text-decoration-none">Kontakt</a></li>
                <li><a href="#" className="text-light text-decoration-none">Tingimused</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>Kontakt</h6>
              <p className="text-light mb-1">📞 +372 1234 5678</p>
              <p className="text-light mb-1">✉️ info@erimi.ee</p>
              <p className="text-light">⏰ 24/7 avatud</p>
            </div>
          </div>
          <hr className="my-4" />
          <div className="text-center text-muted">
            <p>&copy; 2025 E-POOD. Kõik õigused kaitstud.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default EpoodPage;