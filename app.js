const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Route imports
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const cartRoutes = require('./routes/cart.routes');


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Optional error handling
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use((err, req, res, next) => res.status(500).json({ error: 'Server Error' }));

module.exports = app;
