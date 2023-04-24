const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');
const { getUserById } = require('../db/users');

const authUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return next();
    }

    // Comprobamos que el token sea correcto
    let token;

    try {
      token = jwt.verify(authorization, process.env.SECRET);
    } catch {
      throw generateError('Token incorrecto', 401);
    }

    const user = await getUserById(token.id, false);

    const tokenDate = new Date(token.iat * 1000);
    const lastPasswordUpdate = new Date(user.last_password_update);

    if (tokenDate < lastPasswordUpdate) {
      throw generateError('Token incorrecto', 401);
    }

    // Metemos la información del token en la request para usarla en el controlador
    req.userId = token.id;

    // Saltamos al controlador
    next();
  } catch (error) {
    next(error);
  }
};

const isUser = (req, res, next) => {
  if (req.userId) return next();

  throw generateError('No tienes permiso', 401);
};

module.exports = {
  authUser,
  isUser,
};
