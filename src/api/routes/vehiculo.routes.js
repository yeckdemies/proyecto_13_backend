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

const vehiculoRouter = express.Router();

vehiculoRouter.get('/', isAuth, getAllVehiculos);
vehiculoRouter.get('/:id', isAuth, getVehiculoById);

vehiculoRouter.post('/', isAuth, isAdmin, createVehiculo);
vehiculoRouter.put('/:id', isAuth, isAdmin, updateVehiculo);
vehiculoRouter.delete('/:id', isAuth, isAdmin, deleteVehiculo);

module.exports = vehiculoRouter;
