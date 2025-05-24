const fs = require('fs');
const path = require('path');
const { toode } = require('../models');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, sortBy = 'ToodeID', sortOrder = 'ASC' } = req.query;

    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';

    const where = {};

    if (category && category !== 'Kõik tooted') {
      where.Kategooria = category;
    }

    if (search) {
      where.Nimetus = { [require('sequelize').Op.like]: `%${search}%` };
    }

    const products = await toode.findAll({
      where,
      order: [[sortBy, order]]
    });

    res.json(products);
  } catch (error) {
    console.error('Failed to load products:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
};


exports.addProduct = async (req, res) => {
  try {
    const { Nimetus, Kategooria, Hind, Kogus, Asukoht } = req.body;
    const Pilt = req.file ? path.join('uploads', 'products', req.file.filename) : null;

    const newProduct = await toode.create({ Nimetus, Kategooria, Hind, Kogus, Asukoht, Pilt });
    if (!Nimetus || !Kategooria || !Hind || !Kogus || !Asukoht) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Attach full URL for frontend (optional)
    const productWithUrl = {
      ...newProduct.toJSON(),
      PiltUrl: Pilt ? `${req.protocol}://${req.get('host')}/${Pilt}` : null
    };

    res.status(201).json(productWithUrl);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log('Updating product ID:', productId);
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    const updateData = {
      Nimetus: req.body.Nimetus,
      Kategooria: req.body.Kategooria,
      Hind: req.body.Hind,
      Kogus: req.body.Kogus,
      Asukoht: req.body.Asukoht
    };

    if (!Nimetus || !Kategooria || !Hind || !Kogus || !Asukoht) {
      return res.status(400).json({ error: 'Missing required fields' });
    }


    if (req.file) {
      const oldProduct = await toode.findOne({ where: { ToodeID: productId } });
      if (oldProduct && oldProduct.Pilt) {
        const imagePath = path.join(__dirname, '..', oldProduct.Pilt);
        console.log('Old image path:', imagePath);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      updateData.Pilt = `uploads/products/${req.file.filename}`;
    }

    const [updated] = await toode.update(updateData, {
      where: { ToodeID: productId }
    });

    console.log('Updated rows count:', updated);

    if (updated) {
      const updatedProduct = await toode.findOne({ where: { ToodeID: productId } });
      const productWithUrl = {
        ...updatedProduct.toJSON(),
        PiltUrl: updatedProduct.Pilt ? `${req.protocol}://${req.get('host')}/${updatedProduct.Pilt}` : null
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
    console.log('Delete request received for ID:', req.params.id);

    const product = await toode.findOne({ where: { ToodeID: req.params.id } });
    console.log('Found product:', product);

    if (product && product.Pilt) {
      const imagePath = path.join(__dirname, '..', product.Pilt);
      console.log('Trying to delete image at:', imagePath);

      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.warn('Failed to delete image:', err.message);
        }
      }
}

    const deleted = await toode.destroy({
      where: { ToodeID: req.params.id }
    });

    console.log('Deleted count:', deleted);

    if (deleted) {
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(400).json({ error: 'Could not delete product' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await toode.findAll({
      attributes: [
        [require('sequelize').fn('DISTINCT', require('sequelize').col('Kategooria')), 'Kategooria']
      ],
      order: [['Kategooria', 'ASC']]
    });

    res.json(categories.map(cat => cat.Kategooria));
  } catch (error) {
    console.error('Failed to load categories:', error);
    res.status(500).json({ error: 'Failed to load categories' });
  }
};