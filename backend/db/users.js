const bcrypt = require('bcrypt');
const { generateError } = require('../helpers');
const { getConnection } = require('./db');

// Devuelve la información pública de un usuario por su id
const getUserByEmail = async (email) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT * FROM users WHERE email = ?
    `,
      [email]
    );

    if (result.length === 0) {
      throw generateError('No hay ningún usuario con ese email', 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

// Devuelve la información pública de un usuario por su id
const getUserById = async (id, includeTweets = true) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT id, email, created_at FROM users WHERE id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      throw generateError('No hay ningún usuario con esa id', 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

// Crea un usuario en la base de datos y devuelve su id
const createUser = async (email, password) => {
  let connection;

  try {
    connection = await getConnection();
    //Comprobar que no exista otro usuario con ese email
    const [user] = await connection.query(
      `
      SELECT id FROM users WHERE email = ?
    `,
      [email]
    );

    if (user.length > 0) {
      throw generateError(
        'Ya existe un usuario en la base de datos con ese email',
        409
      );
    }

    //Encriptar la password
    const passwordHash = await bcrypt.hash(password, 8);

    //Crear el usuario
    const [newUser] = await connection.query(
      `
      INSERT INTO users (email, password) VALUES(?, ?)
    `,
      [email, passwordHash]
    );

    //Devolver la id
    return newUser.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
};
