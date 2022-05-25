require('dotenv').config();

const { getConnection } = require('./db');

async function main() {
  let connection;

  try {
    connection = await getConnection();

    console.log('Borrando tablas existentes');
    await connection.query('DROP TABLE IF EXISTS tweets');
    await connection.query('DROP TABLE IF EXISTS users');

    console.log('Creando tablas');

    await connection.query(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT UTC_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE tweets (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER NOT NULL,
        text VARCHAR(280) NOT NULL,
        image VARCHAR(100),
        created_at DATETIME DEFAULT UTC_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main().catch((error) => console.error(error));
