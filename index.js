require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
const cloudinary = require('cloudinary').v2;
const userRouters = require('./src/api/routes/user.routes');
const proveedorRoutes = require('./src/api/routes/proveedor.routes');
const conductorRoutes = require('./src/api/routes/conductor.routes');
const vehiculoRoutes = require('./src/api/routes/vehiculo.routes');
const metodoPagoRoutes = require('./src/api/routes/metodoPago.routes');
const sancionRoutes = require('./src/api/models/sancion.model');
const mantenimientoRoutes = require('./src/api/routes/mantenimiento.routes');

const app = express();

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors());

app.use(express.json());

app.use('/api/v1/users', userRouters);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/conductores', conductorRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/metodos-pago', metodoPagoRoutes);
app.use('/api/sanciones', sancionRoutes);
app.use('/api/mantenimientos', mantenimientoRoutes);

app.use('*', (req, res, next) => {
  return res.status(404).json('Route Not Found');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});
