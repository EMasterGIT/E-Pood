const { tellimus, kasutaja, ostukorv, kuller } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const newOrder = await tellimus.create({
      KasutajaID: req.user.id,
      OstukorvID: req.body.OstukorvID,
      KullerID: req.body.KullerID || null,
      Staatus: 'Ootel',
      Asukoht: req.body.Asukoht || ''
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: 'Could not create order' });
  }
};

exports.getAllOrders = async (req, res) => {
    try {
      const orders = await tellimus.findAll({
        include: [
          { model: kasutaja, attributes: ['KasutajaID', 'Eesnimi', 'Email'] },
          { model: ostukorv },
          { model: kuller, attributes: ['KullerID', 'Eesnimi'] }
        ]
      });
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not load orders' });
    }
  };

  exports.updateOrderStatus = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
  
      const [updated] = await tellimus.update(
        { Staatus: req.body.Staatus },
        { where: { TellimusID: req.params.id } }
      );
  
      if (updated) {
        res.json({ message: 'Order status updated' });
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Could not update order' });
    }
  };

exports.getUserOrders = async (req, res) => {
    try {
      const orders = await tellimus.findAll({
        where: { KasutajaID: req.user.id },
        include: [
          { model: ostukorv },
          { model: kuller, attributes: ['Eesnimi'] }
        ]
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Could not load user orders' });
    }
  };
  
