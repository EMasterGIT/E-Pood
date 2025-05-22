const { toode } = require('../models');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await toode.findAll();
    res.json(products);
  } catch (error) {
    console.error('Failed to load products:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { Nimetus, Kategooria, Hind, Kogus, Asukoht } = req.body;
    const newProduct = await toode.create({ Nimetus, Kategooria, Hind, Kogus, Asukoht });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const [updated] = await toode.update(req.body, {
      where: { ToodeID: req.params.id }
    });

    if (updated) {
      const updatedProduct = await toode.findOne({ where: { ToodeID: req.params.id } });
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ error: 'Could not update product' });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await toode.destroy({
      where: { ToodeID: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Could not delete product' });
  }
};
