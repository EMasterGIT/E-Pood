const { ostukorv, toode } = require('../models');

exports.addToCart = async (req, res) => {
  try {
    const { ToodeID, Kogus } = req.body;
    const KasutajaID = req.user.id;

    const product = await toode.findByPk(ToodeID);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existingItem = await ostukorv.findOne({ where: { KasutajaID, ToodeID } });

    if (existingItem) {
      existingItem.Kogus += Kogus;
      await existingItem.save();
    } else {
      await ostukorv.create({ KasutajaID, ToodeID, Kogus });
    }

    res.status(200).json({ message: 'Product added to cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const KasutajaID = req.user.id;
    const cartItems = await ostukorv.findAll({
      where: { KasutajaID },
      include: ['toode']  // You must define association in your model
    });

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ostukorv.destroy({ where: { id, KasutajaID: req.user.id } });
    if (!deleted) return res.status(404).json({ message: 'Item not found' });

    res.status(200).json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
