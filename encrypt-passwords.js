// encrypt-passwords.js

const bcrypt = require('bcrypt');
const { Kasutaja } = require('./models'); // adjust path if needed

async function encryptPasswords() {
  try {
    const users = await Kasutaja.findAll();

    for (const user of users) {
      // Skip if password is already hashed (bcrypt hashes always start with $2)
      if (!user.Parool.startsWith('$2')) {
        const hashedPassword = await bcrypt.hash(user.Parool, 10);
        await user.update({ Parool: hashedPassword });
        console.log(`Password encrypted for user ID: ${user.KasutajaID}`);
      } else {
        console.log(`Password already encrypted for user ID: ${user.KasutajaID}`);
      }
    }

    console.log('Password encryption complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error encrypting passwords:', error);
    process.exit(1);
  }
}

encryptPasswords();
