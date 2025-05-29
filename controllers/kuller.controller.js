// controllers/kuller.controller.js
const { Kuller,Tellimus,Ostukorv } = require('../models');

exports.getAllKullers = async (req, res) => {
  try {
    const kullers = await Kuller.findAll();
    res.json(kullers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignKuller = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { KullerID } = req.body;
    
    console.log('Assigning Kuller to cart:', cartId, { KullerID });
    
    if (!KullerID) {
      return res.status(400).json({ error: 'KullerID is required' });
    }
    
    // Find the cart with its associated tellimus
    const cart = await Ostukorv.findByPk(cartId, {
      include: [{
        model: Tellimus,
        as: 'tellimus'
      }]
    });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    let tellimus = cart.tellimus;
    
    // Create tellimus if it doesn't exist
    if (!tellimus) {
      tellimus = await Tellimus.create({
        KasutajaID: cart.KasutajaID,
        OstukorvID: cart.OstukorvID,
        Staatus: 'Pending',
        Asukoht: 'To be determined',
        KullerID: KullerID
      });
    } else {
      // Update existing tellimus
      await tellimus.update({ KullerID: KullerID });
    }
    
    // Also update any existing Teenindaja records with the new KullerID
    await Teenindaja.update(
      { KullerID: KullerID },
      { where: { TellimusID: tellimus.TellimusID } }
    );
    
    res.json({
      success: true,
      message: 'Kuller assigned successfully'
    });
    
  } catch (err) {
    console.error('Assign Kuller error:', err);
    res.status(500).json({ error: err.message });
  }
};