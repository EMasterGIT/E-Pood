// App.jsx
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/AdminLogin';
import Dashboard from './pages/AdminDashboard';
import EpoodPage from './pages/EpoodPage';
import Favorites from './pages/Favorites';
import Cart from './pages/Cart';
import UserLogin from './pages/UserLogin';
import SignUp from './pages/SignUp'; 
import UserPage from './pages/UserPage';
import { Heart, ShoppingCart, User } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  // Load user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  

  // Update cart count based on cart items array
  const updateCartCount = (cartItems) => {
    console.log("Raw cart items in updateCartCount:", cartItems);
    const count = cartItems.length; // count number of unique products
    console.log("Cart count:", count);
    setCartCount(count);
  };

  // Load cart data for current user
  const loadCart = async () => {
    if (!user || user.role === 'admin') return; // ⬅️ Skip loading for admin
  
    try {
      const response = await axios.get(`http://localhost:3001/api/cart/${user.id}`);
      const cart = response.data;
      updateCartCount(cart.ostukorviTooted || []);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  // Reload cart whenever user changes (login/logout)
  useEffect(() => {
    loadCart();
  }, [user]);
  

  const handleLogout = () => {
    console.log('App.jsx: Initiating logout...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); // This sets user state to null
    console.log('App.jsx: User state set to null. Navigating to /store.');
    navigate('/store');
  };

  // For debugging
  console.log('App.jsx: Current user state:', user);

  // PrivateRoute wrapper for protected routes
  const PrivateRoute = ({ element, roles }) => {
    console.log('PrivateRoute: Checking user:', user);
    if (!user) {
      console.log('PrivateRoute: User is null, redirecting to /user-login');
      return <Navigate to="/user-login" />;
    }
    if (roles && user && !roles.includes(user.role)) {
      console.log('PrivateRoute: User role not allowed, redirecting to /store');
      return <Navigate to="/store" />;
    }
    return element;
  };

  // Determine if current page is a login page (hide some UI elements)
  const isLoginPage = location.pathname === '/admin' || location.pathname === '/user-login';
  const isAdminDashboard = location.pathname === '/dashboard';

  return (
    <div className="min-vh-100 bg-light">
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
            <div className="col-md-2">
              <h2 className="text-danger fw-bold mb-0" style={{cursor: 'pointer'}} onClick={() => navigate('/store')}>E-RIMI</h2>
            </div>

            {!isLoginPage && (
              <div className="col-md-4 offset-md-6">
                <div className="d-flex justify-content-end gap-3">
                  {user ? (
                    <>
                      <Link
                        to="/user"
                        className="me-2 text-decoration-none fw-bold text-danger"
                        style={{ cursor: 'pointer' }}
                      >
                        Tere, {user.name || user.email || (user.role === 'admin' ? 'Admin' : 'Kasutaja')}
                      </Link>
                      <button
                        className="btn btn-outline-danger"
                        onClick={handleLogout}
                      >
                        <span className="me-2">🔓</span>
                        Logout
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-outline-primary me-2" onClick={() => navigate('/user-login')}>
                      <User size={20} className="me-1" />
                      Logi sisse
                    </button>
                  )}

                  {!isAdminDashboard && (
                    <>
                      <button className="btn btn-outline-danger me-2" onClick={() => navigate('/favorites')}>
                        <Heart size={20} />
                      </button>
                      <button className="btn btn-danger position-relative" onClick={() => navigate('/cart')}>
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                          <span
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                            style={{ fontSize: '0.9rem', border: '1px solid black' }}
                          >
                            {cartCount}
                            <span className="visually-hidden">cart items</span>
                          </span>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/store" />} />
        <Route path="/admin" element={<Login setUser={setUser} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard handleLogout={handleLogout} />} roles={['admin']} />} />
        <Route
          path="/store"
          element={
            <EpoodPage
              user={user}
              handleLogout={handleLogout}
              loadCart={loadCart}
              updateCartCount={updateCartCount}
            />
          }
        />
        <Route path="/user-login" element={<UserLogin setUser={setUser} />} />
        <Route path="/register" element={<SignUp setUser={setUser} />} />

        {/* Private routes */}
        <Route
          path="/favorites"
          element={<PrivateRoute element={<Favorites />} roles={['admin', 'user']} />}
        />
        <Route
          path="/cart"
          element={<PrivateRoute element={<Cart user={user} />} roles={['admin', 'user']} />}
        />
        <Route
          path="/user"
          element={<PrivateRoute element={<UserPage user={user} />} roles={['admin', 'user']} />}
        />

        {/* Catch-all */}
        <Route path="*" element={<div className="container mt-5 text-center"><h2>Page not found</h2></div>} />
      </Routes>
    </div>
  );
}

export default App;
