// App.jsx
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/AdminLogin';
import Dashboard from './pages/AdminDashboard';
import EpoodPage from './pages/EpoodPage';
import Favorites from './pages/Favorites';
import Cart from './pages/Cart';
import UserLogin from './pages/UserLogin';
import SignUp from './pages/SignUp'; 
import { Heart, ShoppingCart, User } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = () => {
    console.log('App.jsx: Initiating logout...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); // This makes 'user' null
    console.log('App.jsx: User state set to null. Navigating to /store.');
    navigate('/store');
  };
  
  // In App.jsx, at the top of the App function (after all state declarations)
  // to see the user state during renders:
  console.log('App.jsx: Current user state:', user);
  
  // In App.jsx, inside the PrivateRoute component:
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

  // Determine if the current path is a login-related page
  const isLoginPage = location.pathname === '/admin' || location.pathname === '/user-login';

  // NEW: Determine if the current path is the admin dashboard
  const isAdminDashboard = location.pathname === '/dashboard';

  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-white shadow-sm">
        {/* Top Header (common across app) */}
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

        {/* Main Header (common: Logo and User Actions) */}
        <div className="container py-3">
          <div className="row align-items-center">
            <div className="col-md-2">
              <h2 className="text-danger fw-bold mb-0">E-RIMI</h2>
            </div>

            {/* Conditionally render User Actions based on route */}
            {!isLoginPage && ( // Only show user actions if not on a login page
              <div className="col-md-4 offset-md-6">
                <div className="d-flex justify-content-end gap-3">
                  {user ? (
                    <>
                      <span className="me-2">Tere, {user.name|| user.email || (user.role === 'admin' ? 'Admin' : 'Kasutaja')}</span>
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

                  {/* Conditionally render Favorites and Cart buttons */}
                  {!isAdminDashboard && ( // <--- Only show if NOT on admin dashboard
                    <>
                      <button className="btn btn-outline-danger me-2" onClick={() => navigate('/favorites')}>
                        <Heart size={20} />
                      </button>
                      <button className="btn btn-danger" onClick={() => navigate('/cart')}>
                        <ShoppingCart size={20} />
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
        <Route path="/store" element={<EpoodPage user={user} handleLogout={handleLogout} />} />
        <Route path="/user-login" element={<UserLogin setUser={setUser} />} />

        {/* MAKE FAVORITES AND CART PRIVATE */}
        {/* Assuming 'user' and 'admin' roles can access Favorites and Cart.
            Adjust roles based on your application's requirements. */}
        <Route
          path="/favorites"
          element={<PrivateRoute element={<Favorites />} roles={['admin', 'user']} />}
        />
        <Route
          path="/cart"
          element={<PrivateRoute element={<Cart user={user} />} roles={['admin', 'user']} />}
        />
        <Route path="/register" element={<SignUp setUser={setUser} />} /> {/* Pass setUser to SignUp */}
        {/* This catch-all route should remain last */}
        <Route path="*" element={<div className="container mt-5 text-center"><h2>Page not found</h2></div>} />
      
      </Routes>
    </div>
  );
}

export default App;