// App.jsx
import { Routes, Route } from 'react-router-dom';
import Login from './pages/AdminLogin';
import Dashboard from './pages/AdminDashboard';
import EpoodPage from './pages/EpoodPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/store" element={<EpoodPage />} />
      <Route path="*" element={<div className="container mt-5 text-center"><h2>Page not found</h2></div>} />
    </Routes>
  );
}

export default App;