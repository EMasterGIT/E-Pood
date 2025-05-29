const { Teenindaja, Ostukorv, Tellimus } = require('../models');
const { Op } = require('sequelize');



exports.getAllTeenindajad = async (req, res) => {
  try {
    const teenindajad = await Teenindaja.findAll();
    res.json(teenindajad);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.assignTeenindaja = async (req, res) => {
  try {
    const { orderId } = req.params;  
    const { TeenindajaID } = req.body;

    console.log('Assigning Teenindaja to order:', orderId, { TeenindajaID });

    if (!TeenindajaID) {
      return res.status(400).json({ error: 'TeenindajaID is required' });
    }
    
    // Find the cart with its associated tellimus
    const cart = await Ostukorv.findByPk(orderId, {
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
        Asukoht: 'To be determined'
      });
    }
    
    // Find the Teenindaja master record to get the name
    const teenindajaMaster = await Teenindaja.findByPk(TeenindajaID);
    if (!teenindajaMaster) {
      return res.status(404).json({ error: 'Teenindaja not found' });
    }
    
    // Check if Teenindaja assignment already exists
    let teenindajaAssignment = await Teenindaja.findOne({
      where: { TellimusID: tellimus.TellimusID }
    });
    
    if (teenindajaAssignment) {
      // Update existing assignment
      await teenindajaAssignment.update({
        Nimi: teenindajaMaster.Nimi,
        Tootelisamine: teenindajaMaster.Tootelisamine
      });
    } else {
      // Create new assignment
      await Teenindaja.create({
        Nimi: teenindajaMaster.Nimi,
        Tootelisamine: teenindajaMaster.Tootelisamine,
        TellimusID: tellimus.TellimusID,
        KullerID: tellimus.KullerID // Preserve existing KullerID if any
      });
    }
    
    res.json({
      success: true,
      message: 'Teenindaja assigned successfully'
    });
    
  } catch (err) {
    console.error('Assign Teenindaja error:', err);
    res.status(500).json({ error: err.message });
  }
};

