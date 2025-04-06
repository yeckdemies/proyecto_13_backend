const express = require('express');
const {
  getAllUser,
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  setFavourite,
  deleteUser,
  removeFavourite,
  getFavourites
} = require('../controllers/user.controller');
const { isAuth } = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/role');

const userRouter = express.Router();

userRouter.get('/', [isAuth, isAdmin], getAllUser);
userRouter.get('/me', isAuth, getCurrentUser);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.put('/editUser', isAuth, updateUser);
userRouter.delete('/deleteUser', [isAuth, isAdmin], deleteUser);

module.exports = userRouter;
