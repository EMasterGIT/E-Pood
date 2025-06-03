const { Tellimus, Ostukorv, OstukorviToode, Toode, Kasutaja, Teenindaja, Kuller } = require('../models');

// Aitab juhusliku kulleri valimisel
const getRandomKuller = async () => {
  const kullers = await Kuller.findAll();
  if (kullers.length === 0) {
    throw new Error('No Kuller available');
  }
  // Juhuslik kulleri valimine
  return kullers[Math.floor(Math.random() * kullers.length)];
};

// Kasutaja loob tellimuse
exports.createOrder = async (req, res) => {
  try {
    const { ostukorvId, location } = req.body;
    const userId = req.user.id;

    if (!ostukorvId || !location) {
      return res.status(400).json({ error: 'Asukoht on vaja sisestada' });
    }

    // Tuvastakse, kas kasutajal on aktiivne ostukorv
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
      return res.status(404).json({ error: 'Aktiivset ostukorvi ei leitud' });
    }

    if (!cart.ostukorviTooted || cart.ostukorviTooted.length === 0) {
      return res.status(400).json({ error: 'Ostukorv on tühi' });
    }

    // Laoseisu kontrollimine
    for (const item of cart.ostukorviTooted) {
      const product = await Toode.findByPk(item.ToodeID);
      if (!product) {
        return res.status(400).json({ error: `Toodet ${item.ToodeID} ei leitud.` });
      }
      if (product.Kogus < item.Kogus) {
        return res.status(400).json({ 
          error: `Ebapiisav kogus ${product.Nimi}. Saadaval: ${product.Kogus}, Nõutud: ${item.Kogus}` 
        });
      }
    }

    // Vali juhuslik Kuller
    const assignedKuller = await getRandomKuller();

    // Tekita tellimus 
    const order = await Tellimus.create({
      KasutajaID: userId,
      OstukorvID: ostukorvId,
      KullerID: assignedKuller.KullerID, // Lisa kuller
      Asukoht: location,
      Staatus: 'Ootel'
    });

    // Automaatiliselt loo Teenindaja
    const teenindaja = await Teenindaja.create({
      Nimi: `Teenindaja tellimuse jaoks ${order.TellimusID}`,
      TellimusID: order.TellimusID,
      KullerID: assignedKuller.KullerID
    });

    // Vähenda laoseisu tellimuse kaupade jaoks
    for (const item of cart.ostukorviTooted) {
      const product = await Toode.findByPk(item.ToodeID);
      if (product) {
        const newStock = Math.max(0, product.Laoseis - item.Kogus);
        await product.update({ Laoseis: newStock });
      }
    }

    // Uuenda ostukorvi staatus
    await cart.update({ Staatus: 'Kinnitatud' });

    res.status(201).json({ 
      message: 'Tellimus edukalt loodud', 
      order: order,
      orderId: order.TellimusID,
      assignedKuller: assignedKuller,
      assignedTeenindaja: teenindaja
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Tellimuse loomine nurjus', detail: error.message });
  }
};

// Admin jaoks kõik tellimused
exports.getAllOrders = async (req, res) => {
  try {
    const { staatus } = req.query; // Staatus võib olla query parameeter, nt ?staatus=Ootel
    
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
          model: Kuller,
          as: 'kuller', 
          attributes: ['KullerID', 'Nimi', 'Telefoninumber']
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

// Admin uuendab tellimuse staatust
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { staatus } = req.body;

    console.log('Uuendan tellimuse staatust', req.params.id, req.body);

    if (!staatus) {
      return res.status(400).json({ error: 'Tellimuse staatus on nõutud' });
    }

    const order = await Tellimus.findByPk(id, {
      include: [{
        model: Ostukorv,
        as: 'ostukorv',
        include: [{
          model: OstukorviToode,
          as: 'ostukorviTooted',
          include: [{
            model: Toode,
            as: 'toode'
          }]
        }]
      }]
    });

    if (!order) {
      return res.status(404).json({ error: 'Tellimust ei leitud' });
    }

    const previousStatus = order.Staatus;

    // Kui tellimuse staatus on 'Tühistatud', siis taastame laoseisu
    if (staatus === 'Tühistatud' && previousStatus !== 'Tühistatud') {
      if (order.ostukorv && order.ostukorv.ostukorviTooted) {
        for (const item of order.ostukorv.ostukorviTooted) {
          const product = await Toode.findByPk(item.ToodeID);
          if (product) {
            const restoredStock = product.Laoseis + item.Kogus;
            await product.update({ Laoseis: restoredStock });
            console.log(`Taastati kogus: ${product.Nimi}: +${item.Kogus} (Uus laoseis: ${restoredStock})`);
          }
        }
      }
    }

    // Kui tellimuse staatus pannakse uuesti tühistatud siis vähenda taas laoseisu
    if (previousStatus === 'Tühistatud' && staatus !== 'Tühistatud') {
      if (order.ostukorv && order.ostukorv.ostukorviTooted) {
        for (const item of order.ostukorv.ostukorviTooted) {
          const product = await Toode.findByPk(item.ToodeID);
          if (product) {
            // Kontrolli, kas laoseis on piisav enne vähendamist
            if (product.Laoseis < item.Kogus) {
              return res.status(400).json({
                error: `Ebapiisav kogus ${product.Nimi}. Saadaval: ${product.Laoseis}, Nõutud: ${item.Kogus}`
              });
            }
            const newStock = Math.max(0, product.Laoseis - item.Kogus);
            await product.update({ Laoseis: newStock });
            console.log(`Vähendati kogust: ${product.Nimi}: -${item.Kogus} (Uus laoseis: ${newStock})`);
          }
        }
      }
    }

    // Kui tellimuse staatus on 'Lõpetatud', siis kustuta Teenindaja kirje
    if (staatus === 'Lõpetatud') {
      try {
        // Kustuta Teenindaja kirje, mis on seotud selle tellimusega
        const deletedRows = await Teenindaja.destroy({
          where: { TellimusID: id }
        });
        if (deletedRows > 0) {
          console.log(`Teenindaja kirje kustutatud tellimuse ${id} jaoks`);
        } else {
          console.log(`Teenindaja kirjet ei leitud tellimuse ${id} jaoks`);
        }

        
      } catch (teenindajaError) {
        console.error('Error handling Teenindaja record:', teenindajaError);
        
      }
    }

    // Uuenda tellimuse staatus
    order.Staatus = staatus;
    console.log('All changed fields before save:', order.changed());
    await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
};

// kasutaja saab oma ostukorvid
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
          as: 'tellimus',  
          include: [
            {
              model: Kuller,
              as: 'kuller',
              attributes: ['KullerID', 'Nimi', 'Telefoninumber']
            }
          ]
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


exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'TellimusID on nõutud' });
    }

    const order = await Tellimus.findByPk(id);
    
    if (!order) {
      return res.status(404).json({ error: 'Tellimust ei leitud' });
    }

    // Samuti kustuta seotud ostukorv ja teenindaja
    await Teenindaja.destroy({
      where: { TellimusID: id }
    });

    await order.destroy();

    res.status(200).json({ 
      message: 'Tellimus edukalt kustutatud',
      deletedOrderId: id 
    });

  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order.', detail: error.message });
  }
};