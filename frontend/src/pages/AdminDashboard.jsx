import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    Nimetus: '',
    Kategooria: '',
    Hind: '',
    Kogus: '',
    Asukoht: ''
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [error, setError] = useState('');
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
      setError('Failed to fetch products');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      setNewProduct({ Nimetus: '', Kategooria: '', Hind: '', Kogus: '', Asukoht: '' });
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Error adding product');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Error deleting product');
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.ToodeID);
    setEditedProduct(product);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`http://localhost:3001/api/products/${editingProductId}`, editedProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingProductId(null);
      setEditedProduct({});
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Error updating product');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/admin');
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">Product Management Dashboard</h1>
            <button 
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Products Table */}
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title mb-0">Product List</h3>
            </div>
            <div className="card-body">
              {products.length === 0 ? (
                <p className="text-muted">No products found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Nimetus</th>
                        <th>Kategooria</th>
                        <th>Hind</th>
                        <th>Kogus</th>
                        <th>Asukoht</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.ToodeID}>
                          {editingProductId === product.ToodeID ? (
                            <>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={editedProduct.Nimetus}
                                  onChange={(e) => setEditedProduct({ ...editedProduct, Nimetus: e.target.value })}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={editedProduct.Kategooria}
                                  onChange={(e) => setEditedProduct({ ...editedProduct, Kategooria: e.target.value })}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="form-control form-control-sm"
                                  value={editedProduct.Hind}
                                  onChange={(e) => setEditedProduct({ ...editedProduct, Hind: e.target.value })}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={editedProduct.Kogus}
                                  onChange={(e) => setEditedProduct({ ...editedProduct, Kogus: e.target.value })}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={editedProduct.Asukoht}
                                  onChange={(e) => setEditedProduct({ ...editedProduct, Asukoht: e.target.value })}
                                />
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm" role="group">
                                  <button 
                                    className="btn btn-success"
                                    onClick={handleSaveClick}
                                  >
                                    Save
                                  </button>
                                  <button 
                                    className="btn btn-secondary"
                                    onClick={() => setEditingProductId(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td><strong>{product.Nimetus}</strong></td>
                              <td><span className="badge bg-info">{product.Kategooria}</span></td>
                              <td><span className="text-success fw-bold">{product.Hind}€</span></td>
                              <td><span className="badge bg-warning text-dark">{product.Kogus} tk</span></td>
                              <td>{product.Asukoht}</td>
                              <td>
                                <div className="btn-group btn-group-sm" role="group">
                                  <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => handleEditClick(product)}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    className="btn btn-outline-danger"
                                    onClick={() => handleDelete(product.ToodeID)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Add Product Form */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title mb-0">Add New Product</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddProduct}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="nimetus" className="form-label">Nimetus</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nimetus"
                      placeholder="Enter product name"
                      value={newProduct.Nimetus}
                      onChange={(e) => setNewProduct({ ...newProduct, Nimetus: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="kategooria" className="form-label">Kategooria</label>
                    <input
                      type="text"
                      className="form-control"
                      id="kategooria"
                      placeholder="Enter category"
                      value={newProduct.Kategooria}
                      onChange={(e) => setNewProduct({ ...newProduct, Kategooria: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="hind" className="form-label">Hind (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      id="hind"
                      placeholder="0.00"
                      value={newProduct.Hind}
                      onChange={(e) => setNewProduct({ ...newProduct, Hind: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="kogus" className="form-label">Kogus</label>
                    <input
                      type="number"
                      className="form-control"
                      id="kogus"
                      placeholder="Enter quantity"
                      value={newProduct.Kogus}
                      onChange={(e) => setNewProduct({ ...newProduct, Kogus: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="asukoht" className="form-label">Asukoht</label>
                    <input
                      type="text"
                      className="form-control"
                      id="asukoht"
                      placeholder="Enter location"
                      value={newProduct.Asukoht}
                      onChange={(e) => setNewProduct({ ...newProduct, Asukoht: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary btn-lg">
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Product
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;