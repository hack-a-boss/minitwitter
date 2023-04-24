const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  generateError,
  uploadImage,
  deleteUploadedFile,
} = require('../helpers');
const {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserData,
  updateUserPassword,
  updateUserAvatar,
} = require('../db/users');
const { getTweetsByUserId } = require('../db/tweets');

const newUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Esto debería ser sustituido por joi
    if (!email || !password) {
      throw generateError('Debes enviar un email y una password', 400);
    }

    const id = await createUser(email, password);

    res.send({
      status: 'ok',
      message: `User created with id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

const getUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getUserTweetsController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const user = await getTweetsByUserId(id, userId);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getMeController = async (req, res, next) => {
  try {
    const user = await getUserById(req.userId, false);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw generateError('Debes enviar un email y una password', 400);
    }

    // Recojo los datos de la base de datos del usuario con ese mail
    const user = await getUserByEmail(email);

    // Compruebo que las contraseñas coinciden
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError('La contraseña no coincide', 401);
    }

    // Creo el payload del token
    const payload = { id: user.id };

    // Firmo el token
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '30d',
    });

    // Envío el token
    res.send({
      status: 'ok',
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserDataController = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const id = req.userId;

    if (!email) {
      throw generateError('Debes enviar un campo email como mínimo', 400);
    }

    if (name && name.length > 200) {
      throw generateError('El nombre de usuario es muy largo', 400);
    }

    await getUserById(id);

    const updatedUSer = await updateUserData(id, email, name);

    res.send({
      status: 'ok',
      data: updatedUSer,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserPasswordController = async (req, res, next) => {
  try {
    const { password } = req.body;
    const id = req.userId;

    await getUserById(id);

    if (!password) {
      throw generateError('Debes enviar una password', 400);
    }

    await updateUserPassword(id, password);

    res.send({
      status: 'ok',
      message: 'Password actualizada, el token actual quedó invalidado.',
    });
  } catch (error) {
    next(error);
  }
};

const updateUserAvatarController = async (req, res, next) => {
  try {
    const id = req.userId;

    if (req.files?.avatar) {
      const avatarImageFileName = await uploadImage(req.files.avatar.data);

      const user = await getUserById(id);

      const updatedUser = await updateUserAvatar(id, avatarImageFileName);

      await deleteUploadedFile(user.avatar);

      res.send({
        status: 'ok',
        data: updatedUser,
      });
    } else {
      throw generateError('Debes enviar una imagen', 400);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newUserController,
  getUserController,
  getUserTweetsController,
  getMeController,
  loginController,
  updateUserDataController,
  updateUserPasswordController,
  updateUserAvatarController,
};
