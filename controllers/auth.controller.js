// auth.controller.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Kasutaja, Sequelize } = require('../models'); 

exports.register = async (req, res) => {
  try {
    const { Nimi, Email, Telefoninumber, Parool, Roll } = req.body;

    // Põhiline valideerimine
    if (!Nimi || !Email || !Parool) {
      return res.status(400).json({ error: 'Nimi, Email ja Parool on kohustuslikud.' });
    }
    if (Roll && !['user', 'admin', 'kuller'].includes(Roll)) { // Näiteks rollid
      return res.status(400).json({ error: 'Määratud roll on vigane.' });
    }

    // Kontrolli, kas kasutaja juba eksisteerib
    const existingUser = await Kasutaja.findOne({ where: { Email: Email } }); // <--- Kasutab Kasutaja
    if (existingUser) {
      return res.status(409).json({ error: 'Selle e-mailiga kasutaja juba eksisteerib.' });
    }

    // Parooli räsi loomine
    const hashedPassword = await bcrypt.hash(Parool, 10); 

    // Kasutaja loomine
    const newUser = await Kasutaja.create({ // <--- Kasutab Kasutaja
      Nimi,
      Email,
      Telefoninumber,
      Parool: hashedPassword,
      Roll: Roll || 'user' // Vaikimisi 'user', kui pole määratud
    });

    // Valikuline: loo token kohe pärast registreerimist
    const token = jwt.sign(
      { id: newUser.KasutajaID, email: newUser.Email, roll: newUser.Roll },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registreerimine õnnestus',
      token,
      user: {
        id: newUser.KasutajaID,
        name: newUser.Nimi,
        email: newUser.Email,
        role: newUser.Roll
      }
    });

  } catch (error) {
    console.error('Registreerimise viga:', error);
    res.status(500).json({ error: 'Serveri viga registreerimise ajal', detail: error.message });
  }
};

exports.login = async (req, res) => {
  console.log('--- SISSELOGIMISE KATSE ---');
  try {
    const { EmailOrName, Parool } = req.body;
    console.log('Sisselogimise katse:', EmailOrName);

    const user = await Kasutaja.findOne({ 
      where: {
        [Sequelize.Op.or]: [
          { Email: EmailOrName },
          { Nimi: EmailOrName }
        ]
      }
    });

    if (!user) {
      console.log('Sisselogimine ebaõnnestus: Kasutajat ei leitud');
      return res.status(401).json({ error: 'Vale kasutajatunnus või parool' });
    }

    const isMatch = await bcrypt.compare(Parool, user.Parool);
    if (!isMatch) {
      console.log('Sisselogimine ebaõnnestus: Parool ei klapi');
      return res.status(401).json({ error: 'Vale kasutajatunnus või parool' });
    }

    console.log('JWT_SECRET (Login FN):', process.env.JWT_SECRET);
    const token = jwt.sign(
      { id: user.KasutajaID, email: user.Email, roll: user.Roll },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('Sisselogimine õnnestus: Token loodud.');

    return res.json({
      message: 'Sisselogimine õnnestus',
      token,
      user: {
        id: user.KasutajaID,
        email: user.Email,
        name: user.Nimi,
        role: user.Roll
      }
    });

  } catch (error) {
    console.error('Sisselogimise viga (catch plokk):', error);
    return res.status(500).json({ error: 'Serveri viga sisselogimise ajal', detail: error.message }); // Lisatud detailid silumiseks
  }
};