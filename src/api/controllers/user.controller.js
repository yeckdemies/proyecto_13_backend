const User = require('../models/user.model');//
const bcrypt = require('bcrypt');
const { signGenerate } = require('../../helpers/jwt');
const mongoose = require('mongoose');


const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find().populate();

    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error fetching users', error: error.message });
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { userName, email, role } = req.body;
    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });

    if (existingUser) {
      return res.status(400).json({ message: 'User or email already exists' });
    }

    const newUser = new User({
      userName,
      email,
      password: process.env.PASSWORD_DEFAULT,
      role,
      mustChangePassword: true
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: savedUser._id,
        userName: savedUser.userName,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error registering user', error: error.message });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName: userName }).select('+password'); //debo incluir esta línea al haber añadido el select: false en el modelo

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = signGenerate(user._id);

    const userWithoutPassword = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword
    };

    return res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error logging in', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    const userId = req.params.id;
    const isAdmin = req.user.role === 'admin';

    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (userToUpdate.isMasterUser) {
      return res.status(403).json({ message: 'El usuario principal no se puede modificar' });
    }

    if (!isAdmin && req.user._id.toString() !== userToUpdate._id.toString()) {
      return res
        .status(403)
        .json({ message: 'No tienes permisos para modificar este usuario' });
    }

    const changes = {};

    if (userName && userName !== userToUpdate.userName) {
      changes.userName = userName;
    }

    if (email && email !== userToUpdate.email) {
      changes.email = email;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      changes.password = await bcrypt.hash(password, salt);
    }

    if (role && isAdmin && role !== userToUpdate.role) {
      changes.role = role;
    }

    if (Object.keys(changes).length === 0) {
      return res.status(200).json({ message: 'No se han detectado cambios' });
    }

    Object.assign(userToUpdate, changes);
    await userToUpdate.save();

    return res.status(200).json({
      message: 'Usuario actualizado correctamente',
      updatedFields: changes
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error al actualizar el usuario', error: error.message });
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener el usuario',
      error: error.message
    });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id incorrecto' });
    }

    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (userToDelete.isMasterUser) {
      return res.status(403).json({ message: 'El usuario principal no puede ser eliminado' });
    }

    if (req.user._id.toString() === userToDelete._id.toString()) {
      return res
        .status(403)
        .json({ message: 'No te puedes eliminar a ti mismo' });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: `El usuario '${userToDelete.userName}' ha sido eliminado correctamente`,
    });
  } catch (error) {
    console.error('Error eliminado el usuario:', error);
    return res
      .status(500)
      .json({ message: 'Error eliminado el usuario:', error: error.message });
  }
};


const changePassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        message: 'La nueva contraseña es obligatoria'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.password = newPassword;
    user.mustChangePassword = false;

    await user.save();

    return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al cambiar la contraseña',
      error: error.message
    });
  }
};

module.exports = {
  getAllUser,
  registerUser,
  loginUser,
  updateUser,
  getCurrentUser,
  deleteUser,
  changePassword
};
