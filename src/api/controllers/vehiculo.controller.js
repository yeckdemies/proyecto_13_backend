const { uploadToCloudinary } = require('../../helpers/uploadToCloudinary');
const Vehiculo = require('../models/vehiculo.model');

const getAllVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.find()
      .populate('proveedor')
      .populate('conductor');
    res.status(200).json(vehiculos);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ message: 'Error interno al obtener vehículos' });
  }
};

const getVehiculoById = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findById(req.params.id)
      .populate('proveedor')
      .populate('conductor');
    if (!vehiculo) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }
    res.status(200).json(vehiculo);
  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    res.status(500).json({ message: 'Error interno al obtener el vehículo' });
  }
};

const createVehiculo = async (req, res) => {
  try {
    const permisoCirculacionUrl = req.file
      ? await uploadToCloudinary(req.file.buffer)
      : '';

    const nuevoVehiculo = new Vehiculo({
      tipoVehiculo: req.body.tipoVehiculo,
      matricula: req.body.matricula,
      bastidor: req.body.bastidor,
      propiedad: req.body.propiedad,
      estado: req.body.estado,
      tipoCombustible: req.body.tipoCombustible,
      permisoCirculacionUrl,
      ciudad: req.body.ciudad,
      pais: req.body.pais,
      marca: req.body.marca,
      modelo: req.body.modelo,
      anio: Number(req.body.anio),
      color: req.body.color,
      fechaVigorItv: new Date(req.body.fechaVigorItv),
      costeAlquilerMensual: Number(req.body.costeAlquilerMensual),
      fechaInicioContratoRenting: req.body.fechaInicioContratoRenting ? new Date(req.body.fechaInicioContratoRenting) : null,
      fechaFinContratoRenting: req.body.fechaFinContratoRenting ? new Date(req.body.fechaFinContratoRenting) : null,
      empresaTitular: req.body.empresaTitular,
      proveedor: req.body.proveedor,
      conductor: req.body.conductor,
      tipoRenting: req.body.tipoRenting,
      telemetria: req.body.telemetria === 'true'
    });

    await nuevoVehiculo.save();
    res.status(201).json(nuevoVehiculo);
  } catch (error) {
    console.error('Error al crear vehículo:', error);
    res.status(500).json({ message: 'Error interno al crear vehículo' });
  }
};

const updateVehiculo = async (req, res) => {
  try {
    let permisoCirculacionUrl;

    if (req.file) {
      permisoCirculacionUrl = await uploadToCloudinary(req.file.buffer);
    }

    const updateData = {
      tipoVehiculo: req.body.tipoVehiculo,
      matricula: req.body.matricula,
      bastidor: req.body.bastidor,
      propiedad: req.body.propiedad,
      estado: req.body.estado,
      tipoCombustible: req.body.tipoCombustible,
      ciudad: req.body.ciudad,
      pais: req.body.pais,
      marca: req.body.marca,
      modelo: req.body.modelo,
      anio: Number(req.body.anio),
      color: req.body.color,
      fechaVigorItv: new Date(req.body.fechaVigorItv),
      costeAlquilerMensual: Number(req.body.costeAlquilerMensual),
      fechaInicioContratoRenting: req.body.fechaInicioContratoRenting ? new Date(req.body.fechaInicioContratoRenting) : null,
      fechaFinContratoRenting: req.body.fechaFinContratoRenting ? new Date(req.body.fechaFinContratoRenting) : null,
      empresaTitular: req.body.empresaTitular,
      proveedor: req.body.proveedor,
      conductor: req.body.conductor,
      tipoRenting: req.body.tipoRenting,
      telemetria: req.body.telemetria === 'true'
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


const deleteVehiculo = async (req, res) => {
  try {
    const deleted = await Vehiculo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Vehículo no encontrado para eliminar' });
    }
    res.status(200).json({ message: 'Vehículo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    res.status(500).json({ message: 'Error interno al eliminar vehículo' });
  }
};

module.exports = {
  getAllVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
};