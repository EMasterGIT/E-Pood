// src/pages/SignUp.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp({ setUser }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); 
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    
    if (password !== confirmPassword) {
      setError('Paroolid ei ole samad.');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
        setError('Parool peab olema vähemalt 6 tähemärki pikk.');
        setIsLoading(false);
        return;
    }
    if (!name.trim()) {
        setError('Nimi on nõutud.');
        setIsLoading(false);
        return;
    }
    if (!phoneNumber.trim()) {
        setError('Telefoninumber on nõutud.');
        setIsLoading(false);
        return;
    }
    // Telefoninumber
    const phoneRegex = /^(\+372|372|5\d{7}|\d{7,8})$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
        setError('Palun sisesta kehtiv telefoninumber.');
        setIsLoading(false);
        return;
    }
    

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        Nimi: name,       
        Email: email,
        Telefoninumber: phoneNumber, 
        Parool: password,
        Roll: 'user'      
      });

      const { token, user: userData } = response.data;

      const registeredUser = {
        id: userData.id,
        email: userData.email || userData.Email,
        name: userData.name || userData.Nimi,
        phoneNumber: userData.phoneNumber || userData.Telefoninumber,
        role: userData.roll || 'user',
      };
      console.log('Axios Full Response:', response);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(registeredUser));

      setUser(registeredUser);
      navigate('/store');

    } catch (err) {
      console.error('Kasutaja registreerimine nurjus:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Registreerimine nurjus. Palun proovi hiljem uuesti.');
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
                  <h2 className="card-title text-center mb-2">Loo kasutaja</h2>
                  
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

                <form onSubmit={handleSignUp}>
                  <div className="mb-3">
                    <label htmlFor="nameInput" className="form-label">Nimi</label> 
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="nameInput"
                      placeholder="Sisesta oma nimi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="emailInput" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="emailInput"
                      placeholder="Sisesta oma e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {/* Telefoninumber */}
                  <div className="mb-3">
                    <label htmlFor="phoneInput" className="form-label">Telefoninumber</label>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      id="phoneInput"
                      placeholder="Telefon"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    
                  </div>
                  <div className="mb-3">
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
                  <div className="mb-4">
                    <label htmlFor="confirmPasswordInput" className="form-label">Kinnita parool</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="confirmPasswordInput"
                      placeholder="Kinnita oma parool"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                          Registreerin...
                        </>
                      ) : (
                        'Registreeri'
                      )}
                    </button>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-muted mb-1">
                      On juba kasutaja? <a href="/user-login">Logi sisse</a>
                    </p>
                    <button
                      type="button"
                      className="btn btn-link mt-2"
                      onClick={() => navigate('/store')}
                    >
                      Edasi Poodi
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