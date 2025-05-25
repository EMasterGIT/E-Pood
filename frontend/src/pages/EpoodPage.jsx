import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, User, Heart } from 'lucide-react'; // Make sure User is imported here if you use it locally in EpoodPage
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EpoodPage = ({ user, handleLogout }) => { // user and handleLogout are passed as props
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState(0); // This state should ideally come from a global context/prop for a real cart
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Kõik tooted']);
  const [selectedCategory, setSelectedCategory] = useState('Kõik tooted');
  const [favorites, setFavorites] = useState([]); // This state should ideally be linked to a user's favorites
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
      // In a real application, you'd send this to a backend cart API
      setCartItems(cartItems + 1); // Simple local update for now
      console.log(`Added ${product.Nimetus} to cart`);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const toggleFavorite = (productId) => {
    // In a real application, this would interact with a user's favorite list on the backend
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* EpoodPage specific header content (Search and Navigation) */}
      {/* We are placing this *outside* the <header> of App.jsx,
          so it will appear *below* the global header from App.jsx */}
      <div className="container py-3">
        <div className="row align-items-center">
          {/* Search Bar */}
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

          {/* This empty div takes up space next to the search bar for alignment.
              Adjust or remove if your layout needs change. */}
          <div className="col-md-6 d-flex justify-content-end">
            {/* If you wanted to place user actions here instead of App.jsx, you would move them.
                For now, keeping them in App.jsx's global header. */}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-light border-top">
        <div className="container">
          <nav className="py-2">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary btn-sm dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Menu size={16} className="me-1" />
                  Tooted
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setSelectedCategory('Kõik tooted')}
                    >
                      Kõik tooted
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className={`dropdown-item ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
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

      {/* Main Content */}
      <main className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          {/* Breadcrumb content goes here */}
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
              style={{ width: 'auto' }}
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

                    {/* Product Image */}
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
};

export default EpoodPage;