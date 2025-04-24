const multer = require('multer');

/* He tenido que guardar en memoria el archivo porque se subía aunque hubiese fallo, de esta manera puedo controlar mejor ese caso */
const storage = multer.memoryStorage(); // Guardar el archivo en memoria
const uploadFile = multer({ storage });

module.exports = { uploadFile };
