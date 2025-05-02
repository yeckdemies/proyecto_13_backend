const bcrypt = require('bcrypt');

const password = 'Temp1234!';
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then((hash) => {
  console.log('Hashed password:', hash);
});