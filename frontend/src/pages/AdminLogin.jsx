// AdminLogin.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Sisselogimise leht, mis kontrollib kasutaja rolli ja suunab administraatori paneelile
function Login({ setUser }) {
  const navigate = useNavigate();

  const [emailOrName, setEmailOrName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // See kontrollib, kas kasutaja on juba sisse logitud ja suunab teda dashboardi, kui ta on administraator
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role === 'admin') {
          navigate('/dashboard');
        }
      } catch (e) {
        console.error("Ebaõnnestus saada token", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          EmailOrName: emailOrName,
          Parool: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      const loggedInUser = {
        id: data.user.id,
        name: data.user.name, 
        email: data.user.email, 
        role: data.user.role
      };

      // Salvesta token ja kasutaja andmed kohalikku salvestusse
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      
      setUser(loggedInUser); // Uuenda App.jsx state

      if (loggedInUser.role === 'admin') {
        navigate('/dashboard');
      } else {
        setError('Access denied: this login is for administrators only.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null); // Puhasta kasutaja olek
      }

    } catch (err) {
      console.error('Login request failed or parse error:', err);
      setError('Server error - proovi hiljem uuesti.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i className="bi bi-shield-lock text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h2 className="card-title text-center mb-2">Admin Sisselogimine</h2>
                  <p className="text-muted">Logi Admin paneeli sisse</p>
                </div>

                {/* Veateavitus */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError('')}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                {/* Login vorm */}
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="emailOrName" className="form-label">
                      <i className="bi bi-person-fill me-2"></i>
                      Email või Kasutajanimi
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="emailOrName"
                      placeholder="Email või Kasutajanimi"
                      value={emailOrName}
                      onChange={(e) => setEmailOrName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock-fill me-2"></i>
                      Parool
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      placeholder="Sisesta oma parool"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Login sisse...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Logi sisse
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Admin ligipääs ainut!
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;