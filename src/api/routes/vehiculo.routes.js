const express = require('express');
const {
  getAllVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
} = require('../controllers/vehiculo.controller');
const {isAuth} = require('../../middlewares/auth');
const {uploadFile} = require('../../middlewares/upload-file');
const { isAdmin } = require('../../middlewares/role');

const vehiculoRouter = express.Router();

vehiculoRouter.get('/', isAuth, getAllVehiculos);
vehiculoRouter.get('/:id', isAuth, getVehiculoById);
vehiculoRouter.post('/createVehiculo', [isAuth, uploadFile.single('permisoCirculacion')], createVehiculo);
vehiculoRouter.put('/:id', [isAuth, uploadFile.single('permisoCirculacion')], updateVehiculo);
vehiculoRouter.delete('/:id', [isAuth, isAdmin], deleteVehiculo);

module.exports = vehiculoRouter;
