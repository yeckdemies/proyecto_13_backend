const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config();

// MODELOS
const Proveedor = require('../api/models/proveedor.model');
const Conductor = require('../api/models/conductor.model');
const MetodoPago = require('../api/models/metodopago.model');
const Vehiculo = require('../api/models/vehiculo.model');
const Sancion = require('../api/models/sancion.model');
const Mantenimiento = require('../api/models/mantenimiento.model');

// CONEXIÓN
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('✅ Conectado a MongoDB');
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB', err);
    process.exit(1);
  }
};

// CARGA DE ARCHIVO CSV
const loadCSV = (fileName) => {
  const filePath = path.join(__dirname, fileName);
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => data.push(row))
      .on('end', () => resolve(data))
      .on('error', reject);
  });
};

// PROVEEDORES
const seedProveedores = async () => {
  const data = await loadCSV('proveedores.csv');
  await Proveedor.deleteMany();
  const inserted = await Proveedor.insertMany(data);
  console.log(`🟢 Proveedores insertados: ${inserted.length}`);
};

// MÉTODOS DE PAGO
const seedMetodosPago = async () => {
  const data = await loadCSV('metodos_pago.csv');
  await MetodoPago.deleteMany();
  const metodos = [];

  for (const item of data) {
    const proveedor = await Proveedor.findOne({ nombre: new RegExp(`^${item.proveedor.trim()}$`, 'i') });
    if (!proveedor) {
      console.warn(`⚠️ Proveedor no encontrado para método de pago: ${item.proveedor}`);
      continue;
    }
    metodos.push({
      ...item,
      proveedor: proveedor._id
    });
  }

  const inserted = await MetodoPago.insertMany(metodos);
  console.log(`🟢 Métodos de pago insertados: ${inserted.length}`);
};

// CONDUCTORES
const seedConductores = async () => {
  const data = await loadCSV('conductores.csv');
  await Conductor.deleteMany();
  const conductores = [];

  for (const item of data) {
    const metodo = await MetodoPago.findOne({ nombre: new RegExp(`^${item.metodoPago.trim()}$`, 'i') });
    if (!metodo) {
      console.warn(`⚠️ Método de pago no encontrado: ${item.metodoPago}`);
      continue;
    }

    conductores.push({
      ...item,
      metodoPago: metodo._id,
      permisoPermanente: item.permisoPermanente === 'True' || item.permisoPermanente === true,
      tiposCarne: item.tiposCarne.split(',').map(c => c.trim()),
      fechaNacimiento: new Date(item.fechaNacimiento),
      fechaIngreso: new Date(item.fechaIngreso),
      fechaBaja: item.fechaBaja ? new Date(item.fechaBaja) : null,
      fechaExpiracionPermiso: new Date(item.fechaExpiracionPermiso)
    });
  }

  const inserted = await Conductor.insertMany(conductores);
  console.log(`🟢 Conductores insertados: ${inserted.length}`);
};

// VEHÍCULOS
const seedVehiculos = async () => {
  const data = await loadCSV('vehiculos.csv');
  await Vehiculo.deleteMany();
  const vehiculos = [];

  for (const item of data) {
    const proveedor = await Proveedor.findOne({ nombre: new RegExp(`^${item.proveedor.trim()}$`, 'i') });
    const conductor = await Conductor.findOne({ nombre: new RegExp(`^${item.conductor.trim()}$`, 'i') });

    if (!conductor) {
      console.warn(`⚠️ Conductor no encontrado: ${item.conductor}`);
      continue;
    }

    vehiculos.push({
      ...item,
      proveedor: proveedor?._id || null,
      conductor: conductor._id,
      telemetria: item.telemetria === 'True' || item.telemetria === true,
      año: parseInt(item.año),
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lng),
      fechaVigorItv: new Date(item.fechaVigorItv),
      fechaInicioContratoRenting: new Date(item.fechaInicioContratoRenting),
      fechaFinContratoRenting: new Date(item.fechaFinContratoRenting),
      costeAlquilerMensual: parseFloat(item.costeAlquilerMensual)
    });
  }

  const inserted = await Vehiculo.insertMany(vehiculos);
  console.log(`🟢 Vehículos insertados: ${inserted.length}`);
};

// SANCIONES
const seedSanciones = async () => {
  const data = await loadCSV('sanciones.csv');
  await Sancion.deleteMany();
  const sanciones = [];

  for (const item of data) {
    const vehiculo = await Vehiculo.findOne({ matricula: item.vehiculo });
    const conductor = await Conductor.findOne({ nombre: new RegExp(`^${item.conductor.trim()}$`, 'i') });

    if (!vehiculo || !conductor) {
      console.warn(`⚠️ No se encontró sanción para: ${item.vehiculo} / ${item.conductor}`);
      continue;
    }

    sanciones.push({
      ...item,
      vehiculo: vehiculo._id,
      conductor: conductor._id,
      fechaSancion: new Date(item.fechaSancion),
      fechaPago: item.fechaPago ? new Date(item.fechaPago) : null,
      importe: parseFloat(item.importe)
    });
  }

  const inserted = await Sancion.insertMany(sanciones);
  console.log(`🟢 Sanciones insertadas: ${inserted.length}`);
};

// MANTENIMIENTOS
const seedMantenimientos = async () => {
  const data = await loadCSV('mantenimientos.csv');
  await Mantenimiento.deleteMany();
  const mantenimientos = [];

  for (const item of data) {
    const vehiculo = await Vehiculo.findOne({ matricula: item.vehiculo });
    const proveedor = await Proveedor.findOne({ nombre: new RegExp(`^${item.taller.trim()}$`, 'i') });

    if (!vehiculo || !proveedor) {
      console.warn(`⚠️ No se encontró mantenimiento para: ${item.vehiculo} / ${item.taller}`);
      continue;
    }

    mantenimientos.push({
      ...item,
      vehiculo: vehiculo._id,
      taller: proveedor._id,
      fechaEntrada: new Date(item.fechaEntrada),
      fechaSalida: item.fechaSalida ? new Date(item.fechaSalida) : null,
      fechaPago: item.fechaPago ? new Date(item.fechaPago) : null,
      costoTotal: parseFloat(item.costoTotal)
    });
  }

  const inserted = await Mantenimiento.insertMany(mantenimientos);
  console.log(`🟢 Mantenimientos insertados: ${inserted.length}`);
};

// EJECUCIÓN PRINCIPAL
const seed = async () => {
  await connectDB();
  try {
    await seedProveedores();
    await seedMetodosPago();
    await seedConductores();
    await seedVehiculos();
    await seedSanciones();       // Opcional si tienes CSV
    await seedMantenimientos();  // Opcional si tienes CSV
    console.log('🌱 Seed completado correctamente');
  } catch (err) {
    console.error('❌ Error durante el seed:', err);
  } finally {
    mongoose.connection.close();
  }
};

seed();
