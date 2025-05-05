const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config();

const Proveedor = require('../api/models/proveedor.model');
const Conductor = require('../api/models/conductor.model');
const Vehiculo = require('../api/models/vehiculo.model');
const Reserva = require('../api/models/reserva.model');
const User = require('../api/models/user.model');

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
      .pipe(csv({ separator: ';', mapHeaders: ({ header }) => header.trim() }))
      .on('data', (row) => data.push(row))
      .on('end', () => resolve(data))
      .on('error', reject);
  });
};

const parseFecha = (valor, campo, identificador) => {
  if (!valor) return null;
  const raw = valor.trim();
  if (/^\d{2}$/.test(raw)) {
    const fecha = new Date(`20${raw}-01-01`);
    return fecha;
  }
  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(raw)) {
    const [d, m, y] = raw.split('/');
    const yyyy = y.length === 2 ? `20${y}` : y;
    const fecha = new Date(`${yyyy}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
    if (!isNaN(fecha)) return fecha;
  }
  const date = new Date(raw);
  if (!isNaN(date.getTime())) return date;
  console.warn(`Fecha incorrecta (${campo}) [${identificador}]: "${raw}"`);
  return null;
};

const seedProveedores = async () => {
  const data = await loadCSV('proveedores.csv');
  await Proveedor.deleteMany();

  const proveedores = data.map(item => ({
    nombre: item.nombre?.trim(),
    tipo: item.tipo?.trim(),
    direccion: item.direccion?.trim(),
    ciudad: item.ciudad?.trim(),
    provincia: item.provincia?.trim(),
    codigoPostal: item.codigoPostal?.trim(),
    paginaWeb: item.paginaWeb?.trim(),
    email: item.email?.trim(),
    telefono: item.telefono?.trim(),
    razonSocial: item.razonSocial?.trim(),
    nif: item.nif?.trim(),
  }));

  const inserted = await Proveedor.insertMany(proveedores);
  console.log(`Proveedores insertados: ${inserted.length}`);
};

const seedConductores = async () => {
  const data = await loadCSV('conductores.csv');
  await Conductor.deleteMany();

  const conductores = data.map(item => ({
    dni: item.dni?.trim(),
    nombre: item.nombre?.trim(),
    fechaNacimiento: parseFecha(item.fechaNacimiento, 'fechaNacimiento', item.dni),
    telefono: item.telefono?.trim(),
    email: item.email?.trim(),
    direccion: item.direccion?.trim(),
    ciudad: item.ciudad?.trim(),
    provincia: item.provincia?.trim(),
    codigoPostal: item.codigoPostal?.trim()
  }));

  const inserted = await Conductor.insertMany(conductores);
  console.log(`Conductores insertados: ${inserted.length}`);
};

const seedVehiculos = async () => {
  const data = await loadCSV('vehiculos.csv');
  await Vehiculo.deleteMany();

  const vehiculos = [];

  for (const item of data) {
    const matricula = (item.matricula || item.Matricula || '').trim();

    if (!matricula) {
      console.warn(`Error al cargar vehículo, falta matrícula: `, item);
      continue;
    }

    const proveedor = await Proveedor.findOne({
      nombre: new RegExp(`^${item.proveedor?.trim() || ''}$`, 'i')
    });

    vehiculos.push({
      tipoVehiculo: item.tipoVehiculo?.trim(),
      matricula,
      bastidor: item.bastidor?.trim(),
      estado: item.estado?.trim(),
      tipoCombustible: item.tipoCombustible?.trim(),
      permisoCirculacionUrl: item.permisoCirculacionUrl?.trim(),
      ciudad: item.ciudad?.trim() || 'Madrid',
      marca: item.marca?.trim(),
      modelo: item.modelo?.trim(),
      anio: parseInt(item.anio),
      color: item.color?.trim(),
      fechaVigorItv: parseFecha(item.fechaVigorItv, 'fechaVigorItv', matricula),
      costeAlquilerMensual: parseFloat(item.costeAlquilerMensual),
      fechaInicioContratoRenting: parseFecha(item.fechaInicioContratoRenting, 'fechaInicioContratoRenting', matricula),
      fechaFinContratoRenting: parseFecha(item.fechaFinContratoRenting, 'fechaFinContratoRenting', matricula),
      proveedor: proveedor?._id || null
    });
  }

  const inserted = await Vehiculo.insertMany(vehiculos);
  console.log(`Vehículos insertados: ${inserted.length}`);
};

const seedReservas = async () => {
  const data = await loadCSV('reservas.csv');
  await Reserva.deleteMany();

  const reservas = [];

  for (const item of data) {
    const vehiculo = await Vehiculo.findOne({ matricula: (item.vehiculo || '').trim() });
    const conductor = await Conductor.findOne({ dni: (item.conductor || '').trim() });
    const usuario = await User.findOne({ email: (item.usuario || '').trim() });

    if (!vehiculo || !conductor || !usuario) {
      console.warn(`Error al cargar la reserva: usuario: ${item.usuario}, vehiculo: ${item.vehiculo}, conductor: ${item.conductor}`);
      continue;
    }

    reservas.push({
      usuario: usuario._id,
      vehiculo: vehiculo._id,
      conductor: conductor._id,
      fechaInicio: parseFecha(item.fechaInicio, 'fechaInicio', item.conductor),
      fechaFin: parseFecha(item.fechaFin, 'fechaFin', item.conductor),
      estado: item.estado?.trim(),
      motivoCancelacion: item.motivoCancelacion?.trim() || ''
    });
  }

  const inserted = await Reserva.insertMany(reservas);
  console.log(`Reservas insertadas: ${inserted.length}`);
};

const seed = async () => {
  await connectDB();
  try {
    await seedProveedores();
    await seedConductores();
    await seedVehiculos();
    await seedReservas();
    console.log('\nDatos cargados correctamente.');
  } catch (err) {
    console.error('Error al cargar los datos:', err);
  } finally {
    mongoose.connection.close();
  }
};

seed();