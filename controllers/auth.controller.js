
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { kasutaja, Sequelize } = require('../models');



exports.register = async (req, res) => {
  try {
    const { Nimi, Email, Telefoninumber, Parool, Roll, roll } = req.body;
    const finalRoll = Roll || roll || 'user';

    const hashedPassword = await bcrypt.hash(Parool, 10);

    const user = await kasutaja.create({
      Nimi,
      Email,
      Telefoninumber,
      Parool: hashedPassword,
      Roll: finalRoll
    });

    res.status(201).json({
      message: 'User registered',
      user: {
        id: user.KasutajaID,
        name: user.Nimi,
        email: user.Email,
        roll: user.Roll
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed', detail: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { EmailOrName, Parool } = req.body;

    const user = await kasutaja.findOne({
      where: {
        [Sequelize.Op.or]: [
          { Email: EmailOrName },
          { Nimi: EmailOrName }
        ]
      }
    });

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(Parool, user.Parool);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.KasutajaID, email: user.Email, roll: user.Roll },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // --- CRITICAL FIX HERE: Include Email and Nimi in the user object ---
    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.KasutajaID,
        email: user.Email, 
        name: user.Nimi,  
        role: user.Roll
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error during login' });
  }
};
