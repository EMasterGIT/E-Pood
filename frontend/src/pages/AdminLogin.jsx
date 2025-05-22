import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Login() {
  const navigate = useNavigate();
  const [emailOrName, setEmailOrName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'admin') {
      navigate('/dashboard');
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

      // Save token and role
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.roll);

      if (data.user.roll === 'admin') {
        navigate('/dashboard');
      } else {
        setError('Access denied: only admins can use this login');
      }
    } catch (err) {
      setError('Server error - please try again later');
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
                  <h2 className="card-title text-center mb-2">Admin Login</h2>
                  <p className="text-muted">Sign in to access the admin dashboard</p>
                </div>

                {/* Error Alert */}
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

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="emailOrName" className="form-label">
                      <i className="bi bi-person-fill me-2"></i>
                      Email or Username
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="emailOrName"
                      placeholder="Enter your email or username"
                      value={emailOrName}
                      onChange={(e) => setEmailOrName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock-fill me-2"></i>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      placeholder="Enter your password"
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
                          Signing in...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Sign In
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Admin access only
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