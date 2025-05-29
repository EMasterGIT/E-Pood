const { Tellimus, Ostukorv, OstukorviToode, Toode, Kasutaja, Teenindaja, Kuller } = require('../models');

// User creates an order
exports.createOrder = async (req, res) => {
  try {
    const { ostukorvId, location } = req.body;
    const userId = req.user.id;

    if (!ostukorvId || !location) {
      return res.status(400).json({ error: 'Cart ID and delivery location are required.' });
    }

    // Verify cart belongs to user and is active
    const cart = await Ostukorv.findOne({
      where: { 
        OstukorvID: ostukorvId, 
        KasutajaID: userId, 
        Staatus: 'Aktiivne' 
      },
      include: [{
        model: OstukorviToode,
        as: 'ostukorviTooted',
        include: [{ model: Toode, as: 'toode' }]
      }]
    });

    if (!cart) {
      return res.status(404).json({ error: 'Active cart not found.' });
    }

    if (!cart.ostukorviTooted || cart.ostukorviTooted.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    // Validate stock availability for all items
    for (const item of cart.ostukorviTooted) {
      const product = await Toode.findByPk(item.ToodeID);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.ToodeID} not found.` });
      }
      if (product.Kogus < item.Kogus) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.Nimi}. Available: ${product.Kogus}, Requested: ${item.Kogus}` 
        });
      }
    }

    // Create the order
    const order = await Tellimus.create({
      KasutajaID: userId,
      OstukorvID: ostukorvId,
      Asukoht: location,
      Staatus: 'Ootel',
      TellimuseKuupaev: new Date()
    });

    // Reduce stock for each item and update cart status
    for (const item of cart.ostukorviTooted) {
      const product = await Toode.findByPk(item.ToodeID);
      if (product) {
        const newStock = Math.max(0, product.Laoseis - item.Kogus);
        await product.update({ Laoseis: newStock });
      }
    }

    // Update cart status to completed
    await cart.update({ Staatus: 'Kinnitatud' });

    res.status(201).json({ 
      message: 'Order created successfully.', 
      order: order,
      orderId: order.TellimusID 
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order.', detail: error.message });
  }
};

// Admin gets all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { staatus } = req.query; // Get status filter from query params
    
    const whereClause = {};
    if (staatus) {
      whereClause.Staatus = staatus;
    }

    const orders = await Tellimus.findAll({
      where: whereClause,
      include: [
        { 
          model: Kasutaja, 
          as: 'kasutaja',
          attributes: ['KasutajaID', 'Nimi', 'Email'] 
        },
        {
          model: Ostukorv,
          as: 'ostukorv',
          attributes: ['OstukorvID', 'Staatus'],
          include: [{
            model: OstukorviToode,
            as: 'ostukorviTooted',
            attributes: ['OstukorviToodeID', 'Kogus', 'Hind'],
            include: [{ 
              model: Toode, 
              as: 'toode',
              attributes: ['ToodeID', 'Nimi', 'Kirjeldus', 'Hind', 'Kategooria', 'PiltURL']
            }]
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

// Admin updates order status
exports.updateOrderStatus = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { staatus } = req.body;
    console.log('Updating order status:', req.params.id, req.body);

    if (!staatus) {
      return res.status(400).json({ error: 'Order status is required.' });
    }

    const order = await Tellimus.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    order.Staatus = staatus
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
};

// User-specific orders
exports.getUserCarts = async (req, res) => {
  try {
    const userId = req.user.id;

    const carts = await Ostukorv.findAll({
      where: { KasutajaID: userId },
      include: [
        {
          model: OstukorviToode,
          as: 'ostukorviTooted',
          include: [{ model: Toode, as: 'toode' }]
        },
        {
          model: Tellimus,
          as: 'tellimus'  // Include the associated Tellimus
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    res.status(200).json(carts);
  } catch (error) {
    console.error('Error fetching user carts:', error);
    res.status(500).json({ error: 'Failed to fetch user carts.' });
  }
};

exports.getUnassignedOrders = async (req, res) => {
  try {
    const orders = await Tellimus.findAll({
      where: {
        [Op.or]: [
          { TeenindajaID: null },
          { KullerID: null }
        ],
        Staatus: 'Pending'
      }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




