const express = require('express');
const {
  getAllUser,
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  deleteUser,
  changePassword
} = require('../controllers/user.controller');
const { isAuth } = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/role');

const userRouter = express.Router();

userRouter.get('/', [isAuth, isAdmin], getAllUser);
userRouter.get('/me', isAuth, getCurrentUser);
userRouter.post('/register', [isAuth, isAdmin], registerUser);
userRouter.post('/login', loginUser);
userRouter.put('/editUser', [isAuth, isAdmin], updateUser);
userRouter.delete('/deleteUser/:id', [isAuth, isAdmin], deleteUser);
userRouter.put('/changePassword', isAuth, changePassword);

module.exports = userRouter;
