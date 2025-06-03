require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');


const PORT = process.env.PORT || 3001;

// Autentikatsiooni ja sünkimise kontroll
sequelize.authenticate()
  .then(() => {
    console.log('DB connected successfully.');
  
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database & tables synced!');
    // Stardi server peale eduakt sünkimist
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  })
  .catch(err => {
  
    console.error('Database connection or sync failed:', err);
  });