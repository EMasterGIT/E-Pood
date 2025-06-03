const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');


require('dotenv').config();

dotenv.config();

const app = express();

const swaggerSetup = require('./swagger');
// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


swaggerSetup(app);
// API routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/orders', require('./routes/order.routes'));

// Static failide server
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Errorid
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use((err, req, res, next) => res.status(500).json({ error: 'Server Error' }));

module.exports = app;
