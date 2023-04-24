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

const getTweetById = async (id, userId) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      userId
        ? `
                  SELECT tweets.id,
                         tweets.user_id,
                         tweets.text,
                         tweets.image,
                         tweets.created_at,
                         users.email,
                         (SELECT COUNT(id) FROM likes WHERE likes.tweet_id = tweets.id) AS likes,
                         (SELECT CASE
                                     WHEN EXISTS
                                         (SELECT *
                                          FROM likes
                                          WHERE likes.user_id = ?
                                            AND likes.tweet_id = tweets.id)
                                         THEN TRUE
                                     ELSE FALSE
                                     END)                                               AS likedByMe
                  FROM tweets
                           LEFT JOIN users on tweets.user_id = users.id
                  WHERE tweets.id = ?
        `
        : `
                  SELECT tweets.id,
                         tweets.user_id,
                         tweets.text,
                         tweets.image,
                         tweets.created_at,
                         users.email,
                         (SELECT COUNT(id) FROM likes WHERE likes.tweet_id = tweets.id) AS likes
                  FROM tweets
                           LEFT JOIN users on tweets.user_id = users.id
                  WHERE tweets.id = ?
        `,
      userId ? [userId, id] : [id]
    );

    if (result.length === 0) {
      throw generateError(`El tweet con id: ${id} no existe`, 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const getTweetsByUserId = async (id, userId) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      userId
        ? `
          SELECT tweets.*,
                 users.email,
                 (SELECT COUNT(id) FROM likes WHERE likes.tweet_id = tweets.id) AS likes,
                 (SELECT CASE
                             WHEN EXISTS
                                 (SELECT *
                                  FROM likes
                                  WHERE likes.user_id = ?
                                    AND likes.tweet_id = tweets.id)
                                 THEN TRUE
                             ELSE FALSE
                             END)                                               AS likedByMe
          FROM tweets
                   LEFT JOIN users on tweets.user_id = users.id
          WHERE tweets.user_id = ?
        `
        : `
          SELECT tweets.*,
                 users.email,
                 (SELECT COUNT(id) FROM likes WHERE likes.tweet_id = tweets.id) AS likes
          FROM tweets
                   LEFT JOIN users on tweets.user_id = users.id
          WHERE tweets.user_id = ?
      `,
      userId ? [userId, id] : [id]
    );

    return result;
  } finally {
    if (connection) connection.release();
  }
};

const getAllTweets = async (userId) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      userId
        ? `
                  SELECT tweets.id,
                         tweets.user_id,
                         tweets.text,
                         tweets.image,
                         tweets.created_at,
                         users.email,
                         (SELECT COUNT(id) FROM likes WHERE likes.tweet_id = tweets.id) AS likes,
                         (SELECT CASE
                                     WHEN EXISTS
                                         (SELECT *
                                          FROM likes
                                          WHERE likes.user_id = ?
                                            AND likes.tweet_id = tweets.id)
                                         THEN TRUE
                                     ELSE FALSE
                                     END)                                               AS likedByMe
                  FROM tweets
                           LEFT JOIN users on tweets.user_id = users.id
                  ORDER BY tweets.created_at DESC

        `
        : `
                  SELECT tweets.id,
                         tweets.user_id,
                         tweets.text,
                         tweets.image,
                         tweets.created_at,
                         users.email,
                         (SELECT COUNT(id) FROM likes WHERE likes.tweet_id = tweets.id) AS likes
                  FROM tweets
                           LEFT JOIN users on tweets.user_id = users.id
                  ORDER BY tweets.created_at DESC
        `,
      [userId]
    );

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

const likeTweet = async (userId, tweetId) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `
          INSERT INTO likes(tweet_id, user_id)
          VALUES (?, ?)
      `,
      [tweetId, userId]
    );
  } finally {
    if (connection) connection.release();
  }
};

const dislikeTweet = async (userId, tweetId) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `
          DELETE FROM likes WHERE tweet_id = ? AND user_id = ?
      `,
      [tweetId, userId]
    );
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
  likeTweet,
  dislikeTweet,
};
