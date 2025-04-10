const express = require('express');
const {
  getAllVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
} = require('../controllers/vehiculo.controller');
const {isAuth} = require('../../middlewares/auth');
const {isAdmin} = require('../../middlewares/role');
const {uploadFile} = require('../../middlewares/upload-file');

const vehiculoRouter = express.Router();

vehiculoRouter.get('/', isAuth, getAllVehiculos);
vehiculoRouter.get('/:id', isAuth, getVehiculoById);
vehiculoRouter.post('/createVehiculo', [isAuth, isAdmin, uploadFile.single('permisoCirculacion')], createVehiculo);
vehiculoRouter.put('/:id', [isAuth, isAdmin, uploadFile.single('permisoCirculacion')], updateVehiculo);
vehiculoRouter.delete('/:id', [isAuth, isAdmin], deleteVehiculo);

module.exports = vehiculoRouter;
