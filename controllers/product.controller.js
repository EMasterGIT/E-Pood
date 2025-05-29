// controllers/product.controller.js

const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize'); // Keep Op for operators like Op.like
const db = require('../models'); // Import the db object which contains models and the sequelize instance
const { Toode } = db; // Destructure Toode model from db
const sequelize = db.sequelize; // <--- Import the sequelize instance

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Toode.findAll({
      attributes: [
        'ToodeID',
        'Nimi',
        'Kirjeldus',
        'Hind',
        'Kategooria',
        'Laoseis',
        'PiltURL'
      ]
    });

    const withUrl = products.map(p => {
      const j = p.toJSON();
      j.PiltUrl = j.PiltURL
        ? `${req.protocol}://${req.get('host')}/${j.PiltURL}`
        : null;
      return j; // Keep PiltURL for editing purposes
    });

    return res.json(withUrl);
  } catch (err) {
    console.error('Failed to load products:', err);
    return res.status(500).json({ error: 'Failed to load products' });
  }
};

// POST /api/products
exports.addProduct = async (req, res) => {
  try {
    const { Nimi, Kirjeldus, Hind, Kategooria, Laoseis } = req.body;
    const Pilt = req.file ? path.join('uploads', 'products', req.file.filename) : null;

    if (!Nimi || !Kategooria || !Hind || !Laoseis) {
      return res.status(400).json({
        error: 'Fields Nimi, Kategooria, Hind and Laoseis are all required.'
      });
    }

    const newProduct = await Toode.create({
      Nimi,
      Kirjeldus: Kirjeldus || '',
      Hind,
      Kategooria,
      Laoseis,
      PiltURL: Pilt,
    });

    const result = newProduct.toJSON();
    result.PiltUrl = Pilt
      ? `${req.protocol}://${req.get('host')}/${Pilt}`
      : null;

    return res.status(201).json(result);

  } catch (err) {
    console.error('Add product error in controller:', err);
    return res.status(500).json({ error: 'Server Error', detail: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log('Updating product ID:', productId);
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    // Use consistent field names - expecting frontend to send DB field names
    const { Nimi, Kategooria, Hind, Laoseis, Kirjeldus } = req.body;
    if (!Nimi || !Kategooria || !Hind || !Laoseis) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Prepare update data with DB columns
    const updateData = {
      Nimi,
      Kategooria,
      Hind,
      Laoseis,
      Kirjeldus: Kirjeldus || ''
    };

    // Handle image update
    if (req.file) {
      // Delete old image if exists
      const oldProduct = await Toode.findOne({ where: { ToodeID: productId } });
      if (oldProduct && oldProduct.PiltURL) {
        const imagePath = path.join(__dirname, '..', oldProduct.PiltURL);
        console.log('Old image path:', imagePath);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      updateData.PiltURL = path.join('uploads', 'products', req.file.filename);
    }

    const [updated] = await Toode.update(updateData, {
      where: { ToodeID: productId }
    });

    console.log('Updated rows count:', updated);

    if (updated) {
      const updatedProduct = await Toode.findOne({ where: { ToodeID: productId } });
      const productWithUrl = {
        ...updatedProduct.toJSON(),
        PiltUrl: updatedProduct.PiltURL ? `${req.protocol}://${req.get('host')}/${updatedProduct.PiltURL}` : null
      };
      return res.json(productWithUrl);
    } else {
      return res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Update error:', error);
    return res.status(400).json({ error: 'Could not update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log('Delete request received for ID:', productId);

    // Find product by ToodeID
    const product = await Toode.findOne({ where: { ToodeID: productId } });
    console.log('Found product:', product);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete associated image if exists
    if (product.PiltURL) {
      const imagePath = path.join(__dirname, '..', product.PiltURL);
      console.log('Trying to delete image at:', imagePath);

      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.warn('Failed to delete image:', err.message);
      }
    }

    // Delete product from DB
    const deleted = await Toode.destroy({
      where: { ToodeID: productId }
    });

    console.log('Deleted count:', deleted);

    if (deleted) {
      return res.json({ message: 'Product deleted' });
    } else {
      return res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Could not delete product' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    // Fetch distinct categories (Kategooria)
    const categories = await Toode.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('Kategooria')), 'Kategooria']
      ],
      order: [['Kategooria', 'ASC']]
    });

    // Map to plain array of strings
    const categoryList = categories.map(cat => cat.Kategooria);

    res.json(categoryList);
  } catch (error) {
    console.error('Failed to load categories:', error);
    res.status(500).json({ error: 'Failed to load categories' });
  }
};