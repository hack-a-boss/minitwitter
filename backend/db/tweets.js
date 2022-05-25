const { generateError } = require('../helpers');
const { getConnection } = require('./db');

const deleteTweetById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `
      DELETE FROM tweets WHERE id = ?
    `,
      [id]
    );

    return;
  } finally {
    if (connection) connection.release();
  }
};

const getTweetById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
          SELECT tweets.id, tweets.user_id, tweets.text, tweets.image, tweets.created_at, users.email FROM tweets LEFT JOIN users on tweets.user_id = users.id WHERE tweets.id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      throw generateError(`El tweet con id: ${id} no existe`, 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const getTweetsByUserId = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
          SELECT tweets.*, users.email FROM tweets LEFT JOIN users on tweets.user_id = users.id WHERE tweets.user_id = ?
    `,
      [id]
    );

    return result;
  } finally {
    if (connection) connection.release();
  }
};

const getAllTweets = async () => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(`
        SELECT tweets.id, tweets.user_id, tweets.text, tweets.image, tweets.created_at, users.email FROM tweets LEFT JOIN users on tweets.user_id = users.id ORDER BY tweets.created_at DESC
    `);

    return result;
  } finally {
    if (connection) connection.release();
  }
};

const createTweet = async (userId, text, image = '') => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      INSERT INTO tweets (user_id, text, image)
      VALUES(?,?,?)
    `,
      [userId, text, image]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createTweet,
  getAllTweets,
  getTweetById,
  getTweetsByUserId,
  deleteTweetById,
};
