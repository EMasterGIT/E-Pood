const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

require('dotenv').config();

dotenv.config();

// Route imports
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const cartRoutes = require('./routes/cart.routes');
const teenindajaRoutes = require('./routes/teenindaja.routes');
const kullerRoutes = require('./routes/kuller.routes');




const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/teenindajad', teenindajaRoutes);
app.use('/api/kullers', kullerRoutes);


// Error handling middlewares
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use((err, req, res, next) => res.status(500).json({ error: 'Server Error' }));

module.exports = app;

