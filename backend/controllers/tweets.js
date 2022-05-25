const {
  createTweet,
  getAllTweets,
  getTweetById,
  deleteTweetById,
} = require('../db/tweets');
const { generateError, createPathIfNotExists } = require('../helpers');
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');

const getTweetsController = async (req, res, next) => {
  try {
    const tweets = await getAllTweets();

    res.send({
      status: 'ok',
      data: tweets,
    });
  } catch (error) {
    next(error);
  }
};

const newTweetController = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.length > 280) {
      throw generateError(
        'El texto del tweet debe existir y ser menor de 280 caracteres',
        400
      );
    }
    let imageFileName;

    if (req.files && req.files.image) {
      // Creo el path del directorio uploads
      const uploadsDir = path.join(__dirname, '../uploads');

      // Creo el directorio si no existe
      await createPathIfNotExists(uploadsDir);

      // Procesar la imagen
      const image = sharp(req.files.image.data);
      image.resize(500);

      // Guardo la imagen con un nombre aleatorio en el directorio uploads
      imageFileName = `${nanoid(24)}.jpg`;

      await image.toFile(path.join(uploadsDir, imageFileName));
    }

    const id = await createTweet(req.userId, text, imageFileName);

    const tweet = await getTweetById(id);

    res.send({
      status: 'ok',
      data: tweet,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleTweetController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tweet = await getTweetById(id);

    res.send({
      status: 'ok',
      data: tweet,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTweetController = async (req, res, next) => {
  try {
    //req.userId
    const { id } = req.params;

    // Conseguir la información del tweet que quiero borrar
    const tweet = await getTweetById(id);

    // Comprobar que el usuario del token es el mismo que creó el tweet
    if (req.userId !== tweet.user_id) {
      throw generateError(
        'Estás intentando borrar un tweet que no es tuyo',
        401
      );
    }

    // Borrar el tweet
    await deleteTweetById(id);

    res.send({
      status: 'ok',
      message: `El tweet con id: ${id} fue borrado`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTweetsController,
  newTweetController,
  getSingleTweetController,
  deleteTweetController,
};
