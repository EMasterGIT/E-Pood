require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models'); // This imports your sequelize instance

const PORT = process.env.PORT || 3001;

// Authenticate the database connection first
sequelize.authenticate()
  .then(() => {
    console.log('DB connected successfully.');
    // Then, synchronize your models with the database
    // IMPORTANT:
    // { alter: true } attempts to make incremental changes to existing tables.
    // It's generally safer than { force: true } for development, but still use with caution.
    // { force: true } will drop existing tables and recreate them, deleting all data.
    // NEVER use { force: true } in a production environment unless you know what you're doing!
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database & tables synced!');
    // Start your Express server after successful database sync
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    // Catch any errors from authenticate or sync
    console.error('Database connection or sync failed:', err);
  });