import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, User, Heart } from 'lucide-react';
import axios from 'axios';

const EpoodPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Kõik tooted']);
  const [selectedCategory, setSelectedCategory] = useState('Kõik tooted');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('Nimetus');
  const [sortOrder, setSortOrder] = useState('ASC');

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when category, search, or sort changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy, sortOrder]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        category: selectedCategory,
        search: searchQuery,
        sortBy,
        sortOrder
      };
      
      const response = await axios.get('http://localhost:3001/api/products', { params });
      setProducts(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // fetchProducts will be called automatically due to useEffect dependency
  };

  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split('_');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const addToCart = async (product) => {
    try {
      // Here you would typically add to cart via API
      // For now, just increment counter
      setCartItems(cartItems + 1);
      
      // Optional: Show success message
      console.log(`Added ${product.Nimetus} to cart`);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm">
        {/* Top Header */}
        <div className="bg-danger text-white py-2">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-3">
                <small>🌍 Estonian</small>
                <small>📞 Klienditeenindus</small>
              </div>
              <div className="d-flex gap-3">
                <small>Tasuta tarne alates 29€</small>
                <small>⏰ Avatud 24/7</small>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container py-3">
          <div className="row align-items-center">
            {/* Logo */}
            <div className="col-md-2">
              <h2 className="text-danger fw-bold mb-0">E-POOD</h2>
            </div>

            {/* Search */}
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

            {/* User Actions */}
            <div className="col-md-4">
              <div className="d-flex justify-content-end gap-3">
                <button className="btn btn-outline-secondary">
                  <User size={20} className="me-2" />
                  Logi sisse
                </button>
                <button className="btn btn-outline-danger">
                  <Heart size={20} className="me-2" />
                  Lemmikud ({favorites.length})
                </button>
                <button className="btn btn-danger position-relative">
                  <ShoppingCart size={20} className="me-2" />
                  Ostukorv
                  {cartItems > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                      {cartItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-light border-top">
          <div className="container">
            <nav className="py-2">
              <div className="d-flex flex-wrap gap-1">
                <button className="btn btn-outline-primary btn-sm me-3">
                  <Menu size={16} className="me-1" />
                  Tooted
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`btn btn-sm me-2 mb-1 ${
                      selectedCategory === category 
                        ? 'btn-primary' 
                        : 'btn-outline-secondary'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#" className="text-decoration-none">Avaleht</a>
            </li>
            <li className="breadcrumb-item active">{selectedCategory}</li>
          </ol>
        </nav>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Products Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">
            {selectedCategory} 
            <span className="text-muted ms-2">({products.length} toodet)</span>
          </h3>
          <div className="d-flex gap-2">
            <select 
              className="form-select form-select-sm" 
              style={{width: 'auto'}}
              onChange={handleSortChange}
              value={`${sortBy}_${sortOrder}`}
            >
              <option value="Nimetus_ASC">Nimetus A-Z</option>
              <option value="Nimetus_DESC">Nimetus Z-A</option>
              <option value="Hind_ASC">Hind: odavam enne</option>
              <option value="Hind_DESC">Hind: kallim enne</option>
              <option value="Kogus_DESC">Kogus: rohkem enne</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Laadime tooteid...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="row g-4">
            {products.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p className="text-muted fs-5">Ühtegi toodet ei leitud</p>
                {searchQuery && (
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => setSearchQuery('')}
                  >
                    Tühjenda otsing
                  </button>
                )}
              </div>
            ) : (
              products.map(product => (
                <div key={product.ToodeID} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="card h-100 shadow-sm position-relative">
                    {/* Low stock warning */}
                    {product.Kogus <= 5 && (
                      <div className="position-absolute top-0 start-0 bg-warning text-dark px-2 py-1 rounded-end">
                        <small>Vähe laos</small>
                      </div>
                    )}
                    
                    <button 
                      className="btn btn-sm position-absolute top-0 end-0 m-2 border-0 bg-white rounded-circle shadow-sm"
                      onClick={() => toggleFavorite(product.ToodeID)}
                    >
                      <Heart 
                        size={20} 
                        className={favorites.includes(product.ToodeID) ? 'text-danger' : 'text-muted'}
                        fill={favorites.includes(product.ToodeID) ? 'currentColor' : 'none'}
                      />
                    </button>

                    {/* Product Image Placeholder */}
                    <div 
                      className="card-img-top d-flex align-items-center justify-content-center bg-light"
                      style={{ height: '200px' }}
                    >
                      <span className="text-muted fs-1">📦</span>
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
                          {product.Kogus === 0 ? 'Otsas' : 'Lisa ostukorvi'}
                        </button>
                      </div>
                    </div>
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
              <h5 className="text-danger">E-POOD</h5>
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
              <p className="text-muted mb-1">📞 +372 1234 5678</p>
              <p className="text-muted mb-1">✉️ info@epood.ee</p>
              <p className="text-muted">⏰ 24/7 avatud</p>
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
};

export default EpoodPage;