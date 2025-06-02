import React, { useState } from 'react';
import { ShoppingCart, Eye, X } from 'lucide-react';
import api from '../api'; 

export default function ProductCard({ product, user, onAddToCartSuccess }) {
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = async () => {
    if (!user || !user.id) {
      alert('Palun logi sisse, et lisada tooteid ostukorvi.');
      return;
    }
    try {
      const response = await api.post('/cart', {
        userId: user.id,
        toodeId: product.ToodeID,
        kogus: 1, // Kui palju tooteid lisada, siin 1
      });
      alert(`${product.Nimi} lisati ostukorvi!`);
      if (onAddToCartSuccess) {
        onAddToCartSuccess(); 
      }
    } catch (error) {
      console.error('Error ostukorvi lisamisel:', error.response?.data || error.message);
      alert(`Toote lisamine ostukorvi ebaõnnestus: ${error.response?.data?.error || 'Server error'}`);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className="card h-100 shadow-sm">
        {/* Toote pilt */}
        <div className="d-flex justify-content-center align-items-center bg-light position-relative" style={{ height: '200px' }}>
          <img
            src={
              product.PiltUrl && product.PiltUrl.trim()
                ? product.PiltUrl
                : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI2MCIgcj0iMTAiIGZpbGw9IiNjY2MiLz48cGF0aCBkPSJNMzAgMTQwaDE0MGwtMzAtNDBMMTIwIDEyMGwtMjAgMjB6IiBmaWxsPSIjY2NjIi8+PC9zdmc+'
            }
            className="card-img-top"
            alt={
              product.PiltUrl && product.PiltUrl.trim()
                ? (product.Nimi || 'Toode')
                : 'Pilt'
            }
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              position: 'absolute',
              cursor: 'pointer'
            }}
            onClick={openModal}
          />
          
          <button
            className="btn btn-sm btn-light position-absolute"
            style={{ top: '10px', right: '10px', opacity: 0.9 }}
            onClick={openModal}
            title="Vaata detaile"
          >
            <Eye size={16} />
          </button>
        </div>
        
        {/* Toote üksikasjad*/}
        <div className="card-body d-flex flex-column">
          <span className="badge bg-secondary mb-2 align-self-start">
            {product.Kategooria}
          </span>
          <h6 className="card-title" style={{ cursor: 'pointer' }} onClick={openModal}>
            {product.Nimi}
          </h6>
          <div className="small text-muted mb-2">
            <span className="ms-2">📦 {product.Laoseis} tk</span>
          </div>
          <div className="mt-auto">
            <div className="h5 text-danger mb-2">{parseFloat(product.Hind).toFixed(2)}€</div>
            {user && user.id ? (
              <button
                className="btn btn-primary w-100"
                onClick={handleAddToCart}
                disabled={product.Laoseis === 0}
              >
                <ShoppingCart size={16} className="me-2" />
                {product.Laoseis === 0 ? 'Otsas' : 'Lisa ostukorvi'}
              </button>
            ) : (
              <div className="text-center">
                <p className="text-muted mb-2">Logi sisse, et ostukorvi lisada</p>
                <button className="btn btn-outline-secondary w-100" disabled>
                  <ShoppingCart size={16} className="me-2" />
                  Lisa ostukorvi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toote Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{product.Nimi}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    {/* Toote pilt */}
                    <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: '300px' }}>
                      <img
                        src={
                          product.PiltUrl && product.PiltUrl.trim()
                            ? product.PiltUrl
                            : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI2MCIgcj0iMTAiIGZpbGw9IiNjY2MiLz48cGF0aCBkPSJNMzAgMTQwaDE0MGwtMzAtNDBMMTIwIDEyMGwtMjAgMjB6IiBmaWxsPSIjY2NjIi8+PC9zdmc+'
                        }
                        alt={product.Nimi}
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/* Toote üksikasjad Modalis */}
                    <div className="mb-3">
                      <span className="badge bg-secondary">{product.Kategooria}</span>
                    </div>
                    
                    <h4 className="mb-3">{product.Nimi}</h4>
                    
                    <div className="mb-3">
                      <h5 className="text-danger">{parseFloat(product.Hind).toFixed(2)}€</h5>
                    </div>
                    
                    <div className="mb-3">
                      
                      <p className="text-muted mb-1">
                        <strong>Laoseis:</strong> 📦 {product.Laoseis} tk
                      </p>
                      {product.Laoseis === 0 && (
                        <span className="badge bg-danger">Otsas</span>
                      )}
                      {product.Laoseis > 0 && product.Laoseis <= 5 && (
                        <span className="badge bg-warning text-dark">Vähe laos</span>
                      )}
                    </div>
                    
                    {/* Toote kirjeldus */}
                    {product.Kirjeldus && (
                      <div className="mb-4">
                        <h6>Kirjeldus:</h6>
                        <p className="text-muted">{product.Kirjeldus}</p>
                      </div>
                    )}
                    
                    {/* Lisa ostukorvi nupp */}
                    {user && user.id ? (
                      <button
                        className="btn btn-primary btn-lg w-100"
                        onClick={() => {
                          handleAddToCart();
                          closeModal();
                        }}
                        disabled={product.Laoseis === 0}
                      >
                        <ShoppingCart size={20} className="me-2" />
                        {product.Laoseis === 0 ? 'Otsas' : 'Lisa ostukorvi'}
                      </button>
                    ) : (
                      <div className="text-center">
                        <p className="text-muted mb-3">Logi sisse, et ostukorvi lisada</p>
                        <button className="btn btn-outline-secondary btn-lg w-100" disabled>
                          <ShoppingCart size={20} className="me-2" />
                          Lisa ostukorvi
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Sulge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}