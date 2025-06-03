const { Ostukorv, Teenindaja, Kuller, Tellimus, Toode, OstukorviToode } = require('../models');
const { Op } = require('sequelize');

// Helper function to check and clean up empty cart
const checkAndCleanupEmptyCart = async (cartId) => {
  try {
    const remainingItems = await OstukorviToode.count({
      where: { OstukorvID: cartId }
    });
    
    if (remainingItems === 0) {
      // No items left, delete the cart
      await Ostukorv.destroy({
        where: { OstukorvID: cartId }
      });
      return true; // Cart was deleted
    }
    return false; // Cart still has items
  } catch (error) {
    console.error('Error checking/cleaning empty cart:', error);
    return false;
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { toodeId, kogus } = req.body;

    if (!toodeId || !kogus || kogus <= 0) {
      return res.status(400).json({ error: 'Product ID and valid quantity are required.' });
    }

    let cart = await Ostukorv.findOne({
      where: { KasutajaID: userId, Staatus: 'Aktiivne' }
    });

    if (!cart) {
      cart = await Ostukorv.create({ KasutajaID: userId, Staatus: 'Aktiivne' });
    }

    const product = await Toode.findByPk(toodeId);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    if (product.Laoseis < kogus) {
      return res.status(400).json({ error: `Only ${product.Laoseis} units available.` });
    }

    let productPrice = parseFloat(product.Hind);
    if (isNaN(productPrice)) {
      productPrice = parseFloat(product.getDataValue('Hind'));
    }

    if (isNaN(productPrice)) {
      return res.status(500).json({ error: 'Invalid product price.' });
    }

    let cartItem = await OstukorviToode.findOne({
      where: { OstukorvID: cart.OstukorvID, ToodeID: toodeId }
    });

    if (cartItem) {
      const total = cartItem.Kogus + kogus;
      if (total > product.Laoseis) {
        return res.status(400).json({
          error: `Adding ${kogus} would exceed available stock. Current in cart: ${cartItem.Kogus}, Available: ${product.Laoseis}`
        });
      }
      cartItem.Kogus = total;
      // Update price to current price when adding more items
      cartItem.Hind = productPrice;
      await cartItem.save();
    } else {
      cartItem = await OstukorviToode.create({
        OstukorvID: cart.OstukorvID,
        ToodeID: toodeId,
        Kogus: kogus,
        Hind: productPrice
      });
    }

    res.status(201).json({ message: 'Product added to cart.', cartItem });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error', detail: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: 'Kasutaja ID on nõutud' });
    }

    const cart = await Ostukorv.findOne({
      where: {
        KasutajaID: userId,
        Staatus: 'Aktiivne' 
      },
      include: [{
        model: OstukorviToode,
        as: 'ostukorviTooted',
        attributes: ['OstukorvID', 'ToodeID', 'Kogus', 'Hind'],
        include: [{ 
          model: Toode, 
          as: 'toode',
          attributes: ['ToodeID', 'Nimi', 'Hind', 'Laoseis'] 
        }],
        order: [['ToodeID', 'ASC']],
      }]
    });
  
    if (!cart) {
      return res.status(200).json({ 
        message: 'Aktiivset ostukorvi ei leitud.',
        cart: null,
        ostukorviTooted: []
      });
    }

    // Kontrolli kas ostukorvis on tooteid
    if (!cart.ostukorviTooted || cart.ostukorviTooted.length === 0) {
      await checkAndCleanupEmptyCart(cart.OstukorvID);
      return res.status(200).json({ 
        message: 'Cart was empty and has been cleaned up.',
        cart: null,
        ostukorviTooted: []
      });
    }

    // Track items to remove (out of stock)
    const itemsToRemove = [];

    // Uuenda ostukorvi tooteid vastavalt laoseisule
    for (let item of cart.ostukorviTooted) {
      if (item.toode) {
        const currentPrice = parseFloat(item.toode.Hind);
        const availableStock = item.toode.Laoseis;
        
        // Uuenda toote hinda, kui see on muutunud
        if (!isNaN(currentPrice) && currentPrice !== parseFloat(item.Hind)) {
          await OstukorviToode.update(
            { Hind: currentPrice },
            { where: { OstukorvID: cart.OstukorvID, ToodeID: item.ToodeID } }
          );
          item.Hind = currentPrice.toString();
        }
        
        // Sea kogus vastavaks laoseisule
        if (item.Kogus > availableStock) {
          if (availableStock === 0) {
            // Kui toode on otsas, märgi see eemaldamiseks
            itemsToRemove.push(item.ToodeID);
          } else {
            // Sead kogus vastavaks laoseisule
            await OstukorviToode.update(
              { Kogus: availableStock },
              { where: { OstukorvID: cart.OstukorvID, ToodeID: item.ToodeID } }
            );
            item.Kogus = availableStock;
          }
        }
      }
    }

    // Eemaldame tooted, mis on otsas
    if (itemsToRemove.length > 0) {
      await OstukorviToode.destroy({
        where: { 
          OstukorvID: cart.OstukorvID, 
          ToodeID: { [Op.in]: itemsToRemove }
        }
      });
    }

    // Kontrolli, kas ostukorv on nüüd tühi
    const wasCartDeleted = await checkAndCleanupEmptyCart(cart.OstukorvID);
    if (wasCartDeleted) {
      return res.status(200).json({ 
        message: 'Cart became empty after stock updates and has been cleaned up.',
        cart: null,
        ostukorviTooted: [],
        removedItems: itemsToRemove
      });
    }

    // Küsi uuesti ostukorv koos värskendatud toodetega
    const updatedCart = await Ostukorv.findOne({
      where: {
        KasutajaID: userId,
        Staatus: 'Aktiivne' 
      },
      include: [{
        model: OstukorviToode,
        as: 'ostukorviTooted',
        attributes: ['OstukorvID', 'ToodeID', 'Kogus', 'Hind'],
        include: [{ 
          model: Toode, 
          as: 'toode',
          attributes: ['ToodeID', 'Nimi', 'Hind', 'Laoseis']
        }],
        order: [['ToodeID', 'ASC']],
      }]
    });

    res.status(200).json({
      ...updatedCart.toJSON(),
      removedItems: itemsToRemove.length > 0 ? itemsToRemove : undefined
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Something went wrong while fetching the cart.' });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ error: 'Invalid product ID or quantity.' });
    }

    const cart = await Ostukorv.findOne({ where: { KasutajaID: userId, Staatus: 'Aktiivne' } });
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });

    const product = await Toode.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    if (product.Laoseis < quantity) {
      return res.status(400).json({ error: `Only ${product.Laoseis} units available.` });
    }

    const cartItem = await OstukorviToode.findOne({
      where: { OstukorvID: cart.OstukorvID, ToodeID: productId }
    });

    if (!cartItem) return res.status(404).json({ error: 'Product not in cart.' });

    // Uuenda kogus ja hind
    cartItem.Kogus = quantity;
    cartItem.Hind = parseFloat(product.Hind);
    await cartItem.save();

    res.json({ message: 'Quantity updated.', cartItem });

  } catch (error) {
    console.error('Update quantity error:', error);
    res.status(500).json({ error: 'Failed to update quantity.', detail: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);

    const cart = await Ostukorv.findOne({ where: { KasutajaID: userId, Staatus: 'Aktiivne' } });
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });

    const cartItem = await OstukorviToode.findOne({
      where: { OstukorvID: cart.OstukorvID, ToodeID: productId }
    });

    if (!cartItem) return res.status(404).json({ error: 'Toodet ei leitud ostukorvist' });

    // Eemalda toode ostukorvist
    await cartItem.destroy();

    // Kontrolli, kas ostukorv on nüüd tühi
    const wasCartDeleted = await checkAndCleanupEmptyCart(cart.OstukorvID);

    if (wasCartDeleted) {
      res.status(200).json({ 
        message: 'Toode eemaldatud ostukorvist ja ostukorv puhastatud.',
        cartDeleted: true
      });
    } else {
      res.status(200).json({ 
        message: 'Toode eemaldatud ostukorvist.',
        cartDeleted: false
      });
    }

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove product.', detail: error.message });
  }
};

// Eemaldab kõik tooted ostukorvist ja lõpetab tellimuse
exports.clearUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Ostukorv.findOne({
      where: { KasutajaID: userId, Staatus: 'Aktiivne' },
      include: [{ model: OstukorviToode, as: 'ostukorviTooted' }]
    });

    if (!cart) {
      return res.status(200).json({ message: 'Cart is already empty.' });
    }

    // Vähenda laoseisu iga toote puhul
    for (const item of cart.ostukorviTooted) {
      const product = await Toode.findByPk(item.ToodeID);
      if (product) {
        const newStock = Math.max(0, product.Laoseis - item.Kogus);
        await product.update({ Laoseis: newStock });
      }
    }

    // Eemalda kõik tooted ostukorvist
    await OstukorviToode.destroy({
      where: { OstukorvID: cart.OstukorvID }
    });

    // Uuenda ostukorvi staatus
    await cart.update({ Staatus: 'Completed' });

    res.status(200).json({ message: 'Order placed and cart cleared. Thank you!' });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart.', detail: error.message });
  }
};

exports.getAllCarts = async (req, res) => {
  try {
    const { staatus } = req.query; 

    // Küsimus põhine tingimus
    const whereClause = {};
    if (staatus) {
      whereClause.Staatus = staatus;
    }

    const allCarts = await Ostukorv.findAll({
      where: whereClause,
      include: [
        {
          model: OstukorviToode,
          as: 'ostukorviTooted',
          include: [{ model: Toode, as: 'toode' }]
        },
        {
          model: require('../models').Kasutaja, // Kasutaja model
          as: 'kasutaja',
          attributes: ['Nimi', 'Email', 'Telefoninumber']
        },
        {
          model: require('../models').Tellimus, // Tellimus model
          as: 'tellimus',
          attributes: ['Asukoht']
        }
      ],
      order: [['OstukorvID', 'DESC']] // uuem enne
    });

    res.status(200).json(allCarts);
  } catch (error) {
    console.error('Admin getAllCarts error:', error);
    res.status(500).json({ error: 'Failed to fetch all carts.' });
  }
};

// exports.updateCartStatus = async (req, res) => {
//   try {
//     const cartId = req.params.cartId;
//     const { staatus } = req.body;

//     const cart = await Ostukorv.findByPk(cartId);
//     if (!cart) {
//       return res.status(404).json({ error: 'Cart not found.' });
//     }

//     cart.Staatus = staatus;
//     await cart.save();

//     res.status(200).json({ message: 'Cart status updated.', cart });
//   } catch (error) {
//     console.error('Admin updateCartStatus error:', error);
//     res.status(500).json({ error: 'Failed to update cart status.' });
//   }
// };

// exports.assignRoles = async (req, res) => {
//   try {
//     const { cartId } = req.params;
//     const { TeenindajaID, KullerID } = req.body;
    
//     console.log('Assigning roles to cart:', cartId, { TeenindajaID, KullerID });
    
//     // Valideeri sisend
//     if (!TeenindajaID && !KullerID) {
//       return res.status(400).json({ error: 'At least one of TeenindajaID or KullerID must be provided' });
//     }
    
//     // Leia ostukorv ja seotud tellimus
//     const cart = await Ostukorv.findByPk(cartId, {
//       include: [{
//         model: Tellimus,
//         as: 'tellimus'
//       }]
//     });
    
//     if (!cart) {
//       return res.status(404).json({ error: 'Cart not found' });
//     }
    
//     let tellimus = cart.tellimus;
    
//     // Kui tellimust ei leitud, loo uus
//     if (!tellimus) {
//       tellimus = await Tellimus.create({
//         KasutajaID: cart.KasutajaID,
//         OstukorvID: cart.OstukorvID,
//         Staatus: 'Pending',
//         Asukoht: 'To be determined',
//         KullerID: KullerID || null
//       });
//     } else {
//       // Uuenda tellimuse KullerID, kui see on määratud
//       if (KullerID !== undefined) {
//         await tellimus.update({ KullerID: KullerID || null });
//       }
//     }
    
//     // Käsitle Teenindaja määramine
//     if (TeenindajaID !== undefined) {
//       if (TeenindajaID) {
//         // Kontrolli, kas Teenindaja on juba määratud
//         let teenindaja = await Teenindaja.findOne({
//           where: { TellimusID: tellimus.TellimusID }
//         });
        
//         if (teenindaja) {
//           // Uuenda olemasoleva Teenindaja andmed
//           if (KullerID !== undefined) {
//             await teenindaja.update({ KullerID: KullerID || null });
//           }
//         } else {
//           // Loo uus Teenindaja, kui seda pole veel määratud
//           await Teenindaja.create({
//             Nimi: '', 
//             TellimusID: tellimus.TellimusID,
//             KullerID: KullerID || null
//           });
//         }
//       } else {
//         // Eemalda Teenindaja, kui TeenindajaID on null
//         await Teenindaja.destroy({
//           where: { TellimusID: tellimus.TellimusID }
//         });
//       }
//     }
    
//     // Küsi uuesti ostukorv koos tellimuse ja kulleriga
//     const updatedCart = await Ostukorv.findByPk(cartId, {
//       include: [{
//         model: Tellimus,
//         as: 'tellimus',
//         include: [
//           {
//             model: Kuller,
//             as: 'kuller',
//             required: false
//           }
//         ]
//       }]
//     });
    
//     // Küsi Teenindaja, kui see on määratud
//     let assignedTeenindaja = null;
//     if (updatedCart.tellimus) {
//       assignedTeenindaja = await Teenindaja.findOne({
//         where: { TellimusID: updatedCart.tellimus.TellimusID }
//       });
//     }
    
//     console.log('Roles assigned successfully to cart:', cartId);
//     res.json({
//       success: true,
//       message: 'Roles assigned successfully',
//       cart: updatedCart,
//       assignedTeenindaja: assignedTeenindaja
//     });
    
//   } catch (err) {
//     console.error('Assign roles error:', err);
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getCartWithAssignments = async (req, res) => {
//   try {
//     const { cartId } = req.params;
    
//     const cart = await Ostukorv.findByPk(cartId, {
//       include: [{
//         model: Tellimus,
//         as: 'tellimus',
//         include: [
//           {
//             model: Kuller,
//             as: 'kuller',
//             required: false
//           }
//         ]
//       }]
//     });
    
//     if (!cart) {
//       return res.status(404).json({ error: 'Cart not found' });
//     }
    
//     // Saab tellimuse Teenindaja, kui see on määratud
//     let assignedTeenindaja = null;
//     if (cart.tellimus) {
//       assignedTeenindaja = await Teenindaja.findOne({
//         where: { TellimusID: cart.tellimus.TellimusID }
//       });
//     }
    
//     res.json({
//       cart,
//       assignedTeenindaja
//     });
    
//   } catch (err) {
//     console.error('Get cart error:', err);
//     res.status(500).json({ error: err.message });
//   }
// };