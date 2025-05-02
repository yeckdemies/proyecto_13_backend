const express = require('express');
const {
  getAllConductores,
  getConductorById,
  createConductor,
  updateConductor,
  deleteConductor
} = require('../controllers/conductor.controller');
const {isAuth} = require('../../middlewares/auth');
const {isAdmin} = require('../../middlewares/role');

const conductorRouter = express.Router();

conductorRouter.get('/', isAuth, getAllConductores);
conductorRouter.get('/:id', isAuth, getConductorById);
conductorRouter.post('/', [isAuth, isAdmin], createConductor);
conductorRouter.put('/:id', [isAuth, isAdmin], updateConductor);
conductorRouter.delete('/:id', [isAuth, isAdmin], deleteConductor);

module.exports = conductorRouter;
