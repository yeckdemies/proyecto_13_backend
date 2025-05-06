const { uploadToCloudinary } = require('../../helpers/uploadToCloudinary');
const Vehiculo = require('../models/vehiculo.model');
const Reserva = require('../models/reserva.model');

const getAllVehiculos = async (req, res, next) => {
  try {
    const vehiculos = await Vehiculo.find()
      .populate('proveedor', 'nombre');
    res.status(200).json(vehiculos);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ message: 'Error interno al obtener vehículos' });
  }
};

const getVehiculoById = async (req, res, next) => {
  try {
    const vehiculo = await Vehiculo.findById(req.params.id)
      .populate('proveedor', 'nombre');
    if (!vehiculo) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }
    res.status(200).json(vehiculo);
  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    res.status(500).json({ message: 'Error interno al obtener el vehículo' });
  }
};

const createVehiculo = async (req, res, next) => {
  try {
    const permisoCirculacionUrl = req.file
      ? await uploadToCloudinary(req.file.buffer)
      : '';

    const nuevoVehiculo = new Vehiculo({
      tipoVehiculo: req.body.tipoVehiculo,
      matricula: req.body.matricula,
      bastidor: req.body.bastidor,
      estado: req.body.estado,
      tipoCombustible: req.body.tipoCombustible,
      permisoCirculacionUrl,
      ciudad: req.body.ciudad,
      marca: req.body.marca,
      modelo: req.body.modelo,
      anio: Number(req.body.anio),
      color: req.body.color,
      fechaVigorItv: new Date(req.body.fechaVigorItv),
      costeAlquilerMensual: Number(req.body.costeAlquilerMensual),
      fechaInicioContratoRenting: req.body.fechaInicioContratoRenting ? new Date(req.body.fechaInicioContratoRenting) : null,
      fechaFinContratoRenting: req.body.fechaFinContratoRenting ? new Date(req.body.fechaFinContratoRenting) : null,
      proveedor: req.body.proveedor
    });

    await nuevoVehiculo.save();
    res.status(201).json(nuevoVehiculo);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.matricula) {
      return res.status(400).json({ message: 'Ya existe un vehículo con esa matrícula' });
    }

    console.error('Error al crear vehículo:', error);
    res.status(500).json({ message: 'Error interno al crear vehículo' });
  }
};

const updateVehiculo = async (req, res, next) => {
  try {
    let permisoCirculacionUrl;

    if (req.file) {
      permisoCirculacionUrl = await uploadToCloudinary(req.file.buffer);
    }

    const updateData = {
      tipoVehiculo: req.body.tipoVehiculo,
      matricula: req.body.matricula,
      bastidor: req.body.bastidor,
      estado: req.body.estado,
      tipoCombustible: req.body.tipoCombustible,
      ciudad: req.body.ciudad,
      marca: req.body.marca,
      modelo: req.body.modelo,
      anio: Number(req.body.anio),
      color: req.body.color,
      fechaVigorItv: new Date(req.body.fechaVigorItv),
      costeAlquilerMensual: Number(req.body.costeAlquilerMensual),
      fechaInicioContratoRenting: req.body.fechaInicioContratoRenting ? new Date(req.body.fechaInicioContratoRenting) : null,
      fechaFinContratoRenting: req.body.fechaFinContratoRenting ? new Date(req.body.fechaFinContratoRenting) : null,
      proveedor: req.body.proveedor,
      conductor: req.body.conductor
    };

    if (permisoCirculacionUrl) {
      updateData.permisoCirculacionUrl = permisoCirculacionUrl;
    }

    const updated = await Vehiculo.findByIdAndUpdate(req.params.id, updateData, {
      new: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Vehículo no encontrado para actualizar' });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    res.status(500).json({ message: 'Error interno al actualizar vehículo' });
  }
};

const deleteVehiculo = async (req, res, next) => {
  const { id } = req.params;
  const eliminarReservas = req.query.eliminarReservas === 'true';

  try {
    const reservas = await Reserva.find({ vehiculo: id });

    if (reservas.length > 0 && !eliminarReservas) {
      return res.status(409).json({
        message: 'Este vehículo tiene reservas asociadas.',
        reservas: reservas.map(r => r._id),
      });
    }

    if (eliminarReservas) {
      await Reserva.deleteMany({ vehiculo: id });
    }

    const deleted = await Vehiculo.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Vehículo no encontrado' });

    res.status(200).json({ message: 'Vehículo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar vehículo', error });
  }
};

module.exports = {
  getAllVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
};