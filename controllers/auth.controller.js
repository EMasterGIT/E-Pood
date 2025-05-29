// auth.controller.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Kasutaja, Sequelize } = require('../models'); // <--- CORRECTED: Changed 'kasutaja' to 'Kasutaja'

exports.register = async (req, res) => {
  try {
    const { Nimi, Email, Telefoninumber, Parool, Roll } = req.body;

    // Basic validation
    if (!Nimi || !Email || !Parool) {
      return res.status(400).json({ error: 'Name, Email, and Password are required.' });
    }
    if (Roll && !['user', 'admin', 'kuller'].includes(Roll)) { // Example roles
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    // Check if user already exists
    const existingUser = await Kasutaja.findOne({ where: { Email: Email } }); // <--- Uses Kasutaja
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Parool, 10); // Salt rounds

    // Create user
    const newUser = await Kasutaja.create({ // <--- Uses Kasutaja
      Nimi,
      Email,
      Telefoninumber,
      Parool: hashedPassword,
      Roll: Roll || 'user' // Default to 'user' if not provided
    });

    // Optionally, generate a token immediately after registration
    const token = jwt.sign(
      { id: newUser.KasutajaID, email: newUser.Email, roll: newUser.Roll },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.KasutajaID,
        name: newUser.Nimi,
        email: newUser.Email,
        role: newUser.Roll
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration', detail: error.message });
  }
};

exports.login = async (req, res) => {
  console.log('--- LOGIN ATTEMPT RECEIVED ---');
  try {
    const { EmailOrName, Parool } = req.body;
    console.log('Login attempt for:', EmailOrName);

    const user = await Kasutaja.findOne({ // <--- CORRECTED: Uses Kasutaja
      where: {
        [Sequelize.Op.or]: [
          { Email: EmailOrName },
          { Nimi: EmailOrName }
        ]
      }
    });

    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(Parool, user.Parool);
    if (!isMatch) {
      console.log('Login failed: Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('JWT_SECRET (Login FN):', process.env.JWT_SECRET);
    const token = jwt.sign(
      { id: user.KasutajaID, email: user.Email, roll: user.Roll },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('Login successful: Token generated.');

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
    console.error('Login error in catch block:', error);
    return res.status(500).json({ error: 'Server error during login', detail: error.message }); // Added detail for debugging
  }
};