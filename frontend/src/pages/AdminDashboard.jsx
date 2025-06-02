// src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    Nimi: '',
    Kirjeldus: '',
    Hind: '',
    Kategooria: '',
    Laoseis: ''
  });
  const [tellimused, setTellimused] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [statusError, setStatusError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [newProductImage, setNewProductImage] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [editProductImage, setEditProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Lae tooted
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/products');
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products');
      }
    })();
  }, []);

  // Lae tellimused filtriga või ilma
  useEffect(() => {
    (async () => {
      try {
        const url = statusFilter
          ? `http://localhost:3001/api/orders/all?staatus=${statusFilter}`
          : 'http://localhost:3001/api/orders/all';
  
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTellimused(res.data);
        setStatusError('');
      } catch (err) {
        setStatusError('Toodete laadimine nurjus');
        console.error('Viga toodete laadimisel:', err);
      }
    })();
  }, [statusFilter, token]);

  const handleStatusChange = async (tellimusId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/api/orders/${tellimusId}/status`,
        { staatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the tellimus in the frontend state
      setTellimused(prev =>
        prev.map(t => (t.TellimusID === tellimusId ? { ...t, Staatus: newStatus } : t))
      );
      setStatusError('');
    } catch (err) {
      setStatusError('Toote uuendamine nurjus');
      console.error('Error toote uuendamisel', err);
    }
  };

  const handleDeleteTellimus = async (tellimusId) => {
    if (!window.confirm('Olete kindel, et soovite selle tellimuse kustutada?')) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3001/api/orders/${tellimusId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Remove the tellimus from frontend state
      setTellimused(prev => prev.filter(t => t.TellimusID !== tellimusId));
      setStatusError('');
    } catch (err) {
      setStatusError('Toote kustutamine nurjus');
      console.error('Error toote lisamisel:', err);
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.ToodeID);
    setEditedProduct({ ...product });
  };

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEdit) {
        setEditProductImage(file);
        setEditImagePreview(reader.result);
      } else {
        setNewProductImage(file);
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Nimi', newProduct.Nimi);
    formData.append('Kirjeldus', newProduct.Kirjeldus);
    formData.append('Hind', parseFloat(newProduct.Hind));
    formData.append('Kategooria', newProduct.Kategooria);
    formData.append('Laoseis', parseInt(newProduct.Laoseis, 10));
    if (newProductImage) {
      formData.append('image', newProductImage);
    }

    try {
      const res = await axios.post(
        'http://localhost:3001/api/products',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(prev => [...prev, res.data]);
      setNewProduct({ Nimi: '', Kirjeldus: '', Hind: '', Kategooria: '', Laoseis: '' });
      setNewProductImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error('Error uue toote lisamisel:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Uue toote lisamine nurjus');
    }
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    formData.append('Nimi', editedProduct.Nimi);
    formData.append('Kirjeldus', editedProduct.Kirjeldus);
    formData.append('Hind', parseFloat(editedProduct.Hind));
    formData.append('Kategooria', editedProduct.Kategooria);
    formData.append('Laoseis', parseInt(editedProduct.Laoseis, 10));
    if (editProductImage) {
      formData.append('image', editProductImage);
    }

    try {
      const res = await axios.put(
        `http://localhost:3001/api/products/${editingProductId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(prev =>
        prev.map(p => (p.ToodeID === editingProductId ? res.data : p))
      );
      setEditingProductId(null);
      setEditProductImage(null);
      setEditImagePreview(null);
    } catch (err) {
      console.error('Save product error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to update product');
    }
  };

  const handleCancelClick = () => {
    setEditingProductId(null);
    setEditProductImage(null);
    setEditImagePreview(null);
  };

  const handleDeleteProduct = async (toodeID) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3001/api/products/${toodeID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(prev => prev.filter(p => p.ToodeID !== toodeID));
    } catch (err) {
      setError('Toote kustutamine nurjus');
    }
  };

  const toggleOrderDetails = (tellimusId) => {
    setExpandedOrderId(expandedOrderId === tellimusId ? null : tellimusId);
  };

  const calculateOrderTotal = (ostukorv) => {
    if (!ostukorv || !ostukorv.ostukorviTooted) return 0;
    return ostukorv.ostukorviTooted.reduce((total, item) => {
      return total + (parseFloat(item.Hind) * item.Kogus);
    }, 0).toFixed(2);
  };

  const tellimusStatuses = ['Ootel', 'Töös', 'Tühistatud', 'Välja saadetud', 'Lõpetatud'];

  return (
    <div className="container mt-3">
      <h2>Admin Dashboard - Toote & Tellimuse haldus</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAddProduct} className="mb-4">
        <h4>Lisa uus toode</h4>
        <input
          type="text"
          placeholder="Nimi"
          value={newProduct.Nimi}
          onChange={(e) => setNewProduct({ ...newProduct, Nimi: e.target.value })}
          required
          className="form-control mb-2"
        />
        <textarea
          placeholder="Kirjeldus"
          value={newProduct.Kirjeldus}
          onChange={(e) => setNewProduct({ ...newProduct, Kirjeldus: e.target.value })}
          required
          className="form-control mb-2"
        />
        <input
          type="number"
          placeholder="Hind"
          value={newProduct.Hind}
          onChange={(e) => setNewProduct({ ...newProduct, Hind: e.target.value })}
          required
          min="0"
          step="0.01"
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Kategooria"
          value={newProduct.Kategooria}
          onChange={(e) => setNewProduct({ ...newProduct, Kategooria: e.target.value })}
          required
          className="form-control mb-2"
        />
        <input
          type="number"
          placeholder="Laoseis"
          value={newProduct.Laoseis}
          onChange={(e) => setNewProduct({ ...newProduct, Laoseis: e.target.value })}
          required
          min="0"
          className="form-control mb-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e, false)}
          className="form-control mb-2"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="New product preview"
            style={{ maxWidth: '150px', marginBottom: '10px' }}
          />
        )}
        <button type="submit" className="btn btn-primary">Lisa</button>
      </form>

      <h4>Olemasolevad tooted</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nimi</th>
            <th>Kirjeldus</th>
            <th>Hind</th>
            <th>Kategooria</th>
            <th>Laoseis</th>
            <th>Pilt</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.ToodeID}>
              {editingProductId === p.ToodeID ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editedProduct.Nimi}
                      onChange={(e) => setEditedProduct({ ...editedProduct, Nimi: e.target.value })}
                      required
                      className="form-control"
                    />
                  </td>
                  <td>
                    <textarea
                      value={editedProduct.Kirjeldus}
                      onChange={(e) => setEditedProduct({ ...editedProduct, Kirjeldus: e.target.value })}
                      required
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editedProduct.Hind}
                      onChange={(e) => setEditedProduct({ ...editedProduct, Hind: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editedProduct.Kategooria}
                      onChange={(e) => setEditedProduct({ ...editedProduct, Kategooria: e.target.value })}
                      required
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editedProduct.Laoseis}
                      onChange={(e) => setEditedProduct({ ...editedProduct, Laoseis: e.target.value })}
                      required
                      min="0"
                      className="form-control"
                    />
                  </td>
                  <td>
                    {editImagePreview ? (
                      <img src={editImagePreview} alt="Edit preview" style={{ maxWidth: '100px' }} />
                    ) : (
                      editedProduct.PiltURL && (
                        <img
                          src={`http://localhost:3001/${editedProduct.PiltURL}`}
                          alt="Product"
                          style={{ maxWidth: '100px' }}
                        />
                      )
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, true)}
                      className="form-control mt-1"
                    />
                  </td>
                  <td>
                    <button className="btn btn-success me-1" onClick={handleSaveClick}>Salvesta</button>
                    <button className="btn btn-secondary" onClick={handleCancelClick}>Tühista</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{p.Nimi}</td>
                  <td>{p.Kirjeldus}</td>
                  <td>{p.Hind}</td>
                  <td>{p.Kategooria}</td>
                  <td>{p.Laoseis}</td>
                  <td>
                    {p.PiltURL && (
                      <img
                        src={`http://localhost:3001/${p.PiltURL}`}
                        alt={p.Nimi}
                        style={{ maxWidth: '100px' }}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary me-1"
                      onClick={() => handleEditClick(p)}
                    >
                      Muuda
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteProduct(p.ToodeID)}
                    >
                      Kustuta
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <hr />
      <h3>Tellimuste haldus (Tellimus)</h3>
      <button
        className="btn btn-outline-primary mb-2"
        onClick={() => setShowFilter(!showFilter)}
      >
        {showFilter ? 'Peida Filter' : 'Näita Filter'}
      </button>
      {showFilter && (
        <div className="mb-3">
          <label htmlFor="statusFilter" className="form-label">
            Filtreeri staatuse järgi:
          </label>
          <select
            id="statusFilter"
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Kõik</option>
            {tellimusStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      )}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Tellimuse ID</th>
            <th>Klient</th>
            <th>Kuhu</th>
            <th>Staatus</th>
            <th>Maksumus kokku</th>
            <th>Loodud</th>
            <th>Tegevused</th>
          </tr>
        </thead>
        <tbody>
          {tellimused.map(tellimus => (
            <React.Fragment key={tellimus.TellimusID}>
              <tr>
                <td>
                  <button
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => toggleOrderDetails(tellimus.TellimusID)}
                  >
                    {expandedOrderId === tellimus.TellimusID ? '▼' : '▶'} {tellimus.TellimusID}
                  </button>
                </td>
                <td>
                  <div>
                    <strong>{tellimus.kasutaja?.Nimi || 'N/A'}</strong>
                    <br />
                    <small className="text-muted">{tellimus.kasutaja?.Email || 'N/A'}</small>
                  </div>
                </td>
                <td>{tellimus.Asukoht}</td>
                <td>
                  <select
                    value={tellimus.Staatus || ''}
                    onChange={(e) => handleStatusChange(tellimus.TellimusID, e.target.value)}
                    className="form-select"
                  >
                    <option value="">Vali staatus</option>
                    {tellimusStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td>€{calculateOrderTotal(tellimus.ostukorv)}</td>
                <td>{new Date(tellimus.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteTellimus(tellimus.TellimusID)}
                  >
                    Kustuta
                  </button>
                </td>
              </tr>
              {expandedOrderId === tellimus.TellimusID && tellimus.ostukorv && (
                <tr>
                  <td colSpan="7" className="p-0">
                    <div className="bg-light p-3">
                      <h6>Ostukorvi tooted:</h6>
                      {tellimus.ostukorv.ostukorviTooted && tellimus.ostukorv.ostukorviTooted.length > 0 ? (
                        <table className="table table-sm table-striped mb-0">
                          <thead>
                            <tr>
                              <th>Pilt</th>
                              <th>Toode</th>
                              <th>Kategooria</th>
                              <th>Toote hind</th>
                              <th>Kogus</th>
                              <th>Kokku</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tellimus.ostukorv.ostukorviTooted.map(item => (
                              <tr key={item.OstukorviToodeID}>
                                <td>
                                  {item.toode?.PiltURL && (
                                    <img
                                      src={`http://localhost:3001/${item.toode.PiltURL}`}
                                      alt={item.toode.Nimi}
                                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                  )}
                                </td>
                                <td>
                                  <strong>{item.toode?.Nimi || 'Tundmatu toode'}</strong>
                                  <br />
                                  <small className="text-muted">{item.toode?.Kirjeldus}</small>
                                </td>
                                <td>{item.toode?.Kategooria || 'N/A'}</td>
                                <td>€{parseFloat(item.Hind).toFixed(2)}</td>
                                <td>{item.Kogus}</td>
                                <td>€{(parseFloat(item.Hind) * item.Kogus).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-muted mb-0">Tooted puuduvad</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {statusError && <div className="alert alert-danger">{statusError}</div>}
    </div>
  );
};

export default AdminDashboard;