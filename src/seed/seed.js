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
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error al conectar a MongoDB', err);
    process.exit(1);
  }
};

const loadCSV = (fileName) => {
  const filePath = path.join(__dirname, fileName);
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
      .on('data', (row) => data.push(row))
      .on('end', () => resolve(data))
      .on('error', reject);
  });
};

// PROVEEDORES
const seedProveedores = async () => {
  const data = await loadCSV('proveedores.csv');
  await Proveedor.deleteMany();

  const proveedores = data.map(item => ({
    nombre: item.nombre.trim(),
    tipo: item.tipo.trim(),
    direccion: item.direccion?.trim(),
    ciudad: item.ciudad?.trim(),
    provincia: item.provincia?.trim(),
    codigoPostal: item.codigoPostal?.trim(),
    paginaWeb: item.paginaWeb?.trim(),
    email: item.email?.trim(),
    telefono: item.telefono?.trim(),
    razonSocial: item.razonSocial?.trim(),
    nif: item.nif?.trim(),
    comentarios: item.comentarios?.trim(),
  }));

  const inserted = await Proveedor.insertMany(proveedores);
  console.log(`Proveedores insertados: ${inserted.length}`);
};

// MÉTODOS DE PAGO
const seedMetodosPago = async () => {
  const data = await loadCSV('metodos_pago.csv');
  await MetodoPago.deleteMany();

  const metodos = [];
  for (const item of data) {
    const proveedor = await Proveedor.findOne({ nombre: new RegExp(`^${item.proveedor.trim()}$`, 'i') });
    if (!proveedor) continue;

    metodos.push({
      nombre: item.nombre.trim(),
      identificador: item.identificador.trim(),
      tipo: item.tipo.trim(),
      proveedor: proveedor._id,
      estado: item.estado.trim(),
      comentarios: item.comentarios?.trim()
    });
  }

  const inserted = await MetodoPago.insertMany(metodos);
  console.log(`Métodos de pago insertados: ${inserted.length}`);
};

// CONDUCTORES
const seedConductores = async () => {
  const data = await loadCSV('conductores.csv');
  await Conductor.deleteMany();

  const conductores = [];
  for (const item of data) {
    const metodo = await MetodoPago.findOne({ nombre: new RegExp(`^${item.metodoPago.trim()}$`, 'i') });
    if (!metodo) continue;

    conductores.push({
      ...item,
      metodoPago: metodo._id,
      tiposCarne: item.tiposCarne.split(',').map(c => c.trim()),
      permisoPermanente: item.permisoPermanente === 'True',
      fechaNacimiento: new Date(item.fechaNacimiento),
      fechaIngreso: new Date(item.fechaIngreso),
      fechaBaja: item.fechaBaja ? new Date(item.fechaBaja) : null,
      fechaExpiracionPermiso: new Date(item.fechaExpiracionPermiso)
    });
  }

  const inserted = await Conductor.insertMany(conductores);
  console.log(`Conductores insertados: ${inserted.length}`);
};

// VEHÍCULOS
const seedVehiculos = async () => {
  const data = await loadCSV('vehiculos.csv');
  await Vehiculo.deleteMany();

  const vehiculos = [];
  for (const item of data) {
    const proveedor = await Proveedor.findOne({ nombre: new RegExp(`^${item.proveedor.trim()}$`, 'i') });
    const conductor = await Conductor.findOne({ nombre: new RegExp(`^${item.conductor.trim()}$`, 'i') });
    if (!conductor) continue;

    vehiculos.push({
      ...item,
      proveedor: proveedor?._id || null,
      conductor: conductor._id,
      anio: parseInt(item.anio),
      costeAlquilerMensual: parseFloat(item.costeAlquilerMensual),
      fechaVigorItv: new Date(item.fechaVigorItv),
      fechaInicioContratoRenting: new Date(item.fechaInicioContratoRenting),
      fechaFinContratoRenting: new Date(item.fechaFinContratoRenting)
    });
  }

  const inserted = await Vehiculo.insertMany(vehiculos);
  console.log(`Vehículos insertados: ${inserted.length}`);
};

// SANCIONES
const seedSanciones = async () => {
  const data = await loadCSV('sanciones.csv');
  await Sancion.deleteMany();

  const sanciones = [];
  for (const item of data) {
    const vehiculo = await Vehiculo.findOne({ matricula: item.vehiculo.trim() });
    const conductor = await Conductor.findOne({ nombre: new RegExp(`^${item.conductor.trim()}$`, 'i') });
    if (!vehiculo || !conductor) continue;

    sanciones.push({
      ...item,
      vehiculo: vehiculo._id,
      conductor: conductor._id,
      fechaHoraSancion: new Date(item.fechaHoraSancion),
      fechaComunicacion: new Date(item.fechaComunicacion),
      importe: parseFloat(item.importe),
      numeroNotificaciones: parseInt(item.numeroNotificaciones),
      gestionada: item.gestionada === 'True',
      completada: item.completada === 'True',
      perdidaPuntos: item.perdidaPuntos === 'True'
    });
  }

  const inserted = await Sancion.insertMany(sanciones);
  console.log(`Sanciones insertadas: ${inserted.length}`);
};

// MANTENIMIENTOS
const seedMantenimientos = async () => {
  const data = await loadCSV('mantenimientos.csv');
  await Mantenimiento.deleteMany();

  const mantenimientos = [];
  for (const item of data) {
    const vehiculo = await Vehiculo.findOne({ matricula: item.vehiculo.trim() });
    const taller = await Proveedor.findOne({ nombre: new RegExp(`^${item.taller.trim()}$`, 'i') });
    if (!vehiculo || !taller) continue;

    mantenimientos.push({
      ...item,
      vehiculo: vehiculo._id,
      taller: taller._id,
      fechaEntrada: new Date(item.fechaEntrada),
      fechaSalida: item.fechaSalida ? new Date(item.fechaSalida) : null,
      costoTotal: parseFloat(item.costoTotal),
      fechaPago: item.fechaPago ? new Date(item.fechaPago) : null
    });
  }

  const inserted = await Mantenimiento.insertMany(mantenimientos);
  console.log(`Mantenimientos insertados: ${inserted.length}`);
};

const seed = async () => {
  await connectDB();
  try {
    await seedProveedores();
    await seedMetodosPago();
    await seedConductores();
    await seedVehiculos();
    await seedSanciones();
    await seedMantenimientos();
    console.log('Seed completado correctamente!!');
  } catch (err) {
    console.error('Error durante el seed!!:', err);
  } finally {
    mongoose.connection.close();
  }
};

seed();
