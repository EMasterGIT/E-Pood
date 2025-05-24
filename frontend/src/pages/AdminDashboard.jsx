import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    Nimetus: '',
    Kategooria: '',
    Hind: '',
    Kogus: '',
    Asukoht: ''
  });
  const [newProductImage, setNewProductImage] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [editProductImage, setEditProductImage] = useState(null);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/products');
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to load products');
          return;
        }
        setProducts(data);
      } catch (err) {
        setError('Server error - please try again later');
      }
    };
    fetchProducts();
  }, []);

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
    Object.entries(newProduct).forEach(([key, value]) => formData.append(key, value));
    if (newProductImage) formData.append('image', newProductImage);

    try {
      const res = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Failed to add product');

      setProducts([...products, data]);
      setNewProduct({ Nimetus: '', Kategooria: '', Hind: '', Kogus: '', Asukoht: '' });
      setNewProductImage(null);
      setImagePreview(null);
    } catch (error) {
      setError('Server error - please try again later');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Failed to delete product');

      setProducts(products.filter(p => p.ToodeID !== id));
    } catch (error) {
      setError('Server error - please try again later');
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.ToodeID);
    setEditedProduct(product);
    setEditProductImage(null);
    setEditImagePreview(null);
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    Object.entries(editedProduct).forEach(([key, value]) => formData.append(key, value));
    if (editProductImage) formData.append('image', editProductImage);

    try {
      const res = await fetch(`http://localhost:3001/api/products/${editingProductId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Failed to update product');

      setProducts(products.map(p => p.ToodeID === editingProductId ? data : p));
      setEditingProductId(null);
      setEditedProduct({});
      setEditProductImage(null);
      setEditImagePreview(null);
    } catch (err) {
      setError('Server error - please try again later');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const getImageUrl = (imagePath) => imagePath ? `http://localhost:3001/${imagePath}` : null;



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
              <span className="me-2">🔓</span>
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
                        <th>Image</th>
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
                                <div className="d-flex flex-column align-items-center">
                                  {editImagePreview ? (
                                    <img 
                                      src={editImagePreview} 
                                      alt="Preview" 
                                      className="img-thumbnail mb-2"
                                      style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                    />
                                  ) : product.Pilt ? (
                                    <img 
                                      src={getImageUrl(product.Pilt)} 
                                      alt={product.Nimetus}
                                      className="img-thumbnail mb-2"
                                      style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div className="bg-light d-flex align-items-center justify-content-center mb-2" 
                                       style={{
                                         width: '60px', 
                                         height: '60px',
                                         display: product.Pilt && !editImagePreview ? 'none' : 'flex'
                                       }}>
                                    📦
                                  </div>
                                  <input
                                    type="file"
                                    className="form-control form-control-sm"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, true)}
                                    style={{fontSize: '0.75rem'}}
                                  />
                                </div>
                              </td>
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
                                    onClick={() => {
                                      setEditingProductId(null);
                                      setEditImagePreview(null);
                                      setEditProductImage(null);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>
                                {product.Pilt ? (
                                  <img 
                                    src={getImageUrl(product.Pilt)} 
                                    alt={product.Nimetus}
                                    className="img-thumbnail"
                                    style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div className="bg-light d-flex align-items-center justify-content-center" 
                                     style={{
                                       width: '60px', 
                                       height: '60px',
                                       display: product.Pilt ? 'none' : 'flex'
                                     }}>
                                  📦
                                </div>
                              </td>
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
              <div>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label htmlFor="productImage" className="form-label">Product Image</label>
                    <input
                      type="file"
                      className="form-control"
                      id="productImage"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, false)}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="img-thumbnail"
                          style={{maxWidth: '200px', maxHeight: '200px', objectFit: 'cover'}}
                        />
                      </div>
                    )}
                  </div>
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
                  <form onSubmit={handleAddProduct}>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary">➕Add Product</button>
                  </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;