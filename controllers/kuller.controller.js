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
    
    // Leia ostukorv ID järgi
    const cart = await Ostukorv.findByPk(cartId, {
      include: [{
        model: Tellimus,
        as: 'tellimus'
      }]
    });
    
    if (!cart) {
      return res.status(404).json({ error: 'Ostukorvi ei leitud' });
    }
    
    let tellimus = cart.tellimus;
    
    // Loo uus tellimus, kui seda pole olemas
    if (!tellimus) {
      tellimus = await Tellimus.create({
        KasutajaID: cart.KasutajaID,
        OstukorvID: cart.OstukorvID,
        Staatus: 'Ootel',
        Asukoht: 'Pole kinnitatud',
        KullerID: KullerID
      });
    } else {
      // Uue tellimuse puhul, uuendame tellimuse KullerID
      await tellimus.update({ KullerID: KullerID });
    }
    
    // Uue tellimuse puhul, uuendame ka Teenindaja tabelit
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