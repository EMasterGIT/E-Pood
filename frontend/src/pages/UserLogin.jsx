// UserLogin.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserLogin({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user) {
          navigate('/store');
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('handleLogin called!');

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        EmailOrName: email,
        Parool: password
      });

      const { token, user: userData } = response.data;

      const loggedInUser = {
        id: userData.id,
        email: userData.email || userData.Email,
        name: userData.name || userData.Nimi,
        role: userData.roll || 'user',
        phone: userData.phone || userData.Telefoninumber || '', 
      };

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      setUser(loggedInUser);
      navigate('/store');

    } catch (err) {
      console.error('User login failed:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Sisselogimine nurjus. Palun proovi uuesti.');
      }
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
                <div className="text-center mb-4">
                  <h2 className="card-title text-center mb-2">Sisselogimine</h2>
                  <p className="text-muted">Logi enda kontosse sisse</p>
                </div>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError('')}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="emailInput" className="form-label">Email või Kasutajanimi</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="emailInput"
                      placeholder="Email või kasutajanimi"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="passwordInput" className="form-label">Parool</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="passwordInput"
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
                          Sisselogimine...
                        </>
                      ) : (
                        'Logi sisse'
                      )}
                    </button>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-muted mb-1">
                      Pole kontot? <a href="/register">Liitu</a>
                    </p>
                    
                    <button
                      type="button" 
                      className="btn btn-link mt-2"
                      onClick={() => navigate('/store')}
                    >
                      Edasi poodi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}