const {
  createTweet,
  getAllTweets,
  getTweetById,
  deleteTweetById,

  likeTweet,
  dislikeTweet,
} = require('../db/tweets');
const {
  generateError,
  uploadImage,
  deleteUploadedFile,
} = require('../helpers');

const getTweetsController = async (req, res, next) => {
  try {
    const userId = req.userId;
    const tweets = await getAllTweets(userId);

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

    if (req.files?.image) {
      imageFileName = await uploadImage(req.files.image.data);
    }

    const id = await createTweet(req.userId, text, imageFileName);

    const tweet = await getTweetById(id, req.userId);

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
    const userId = req.userId;

    console.log(userId);

    const tweet = await getTweetById(id, userId);

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

    console.log(tweet);

    // Borrar el tweet
    await deleteTweetById(id);
    if (tweet.image) await deleteUploadedFile(tweet.image);

    res.send({
      status: 'ok',
      message: `El tweet con id: ${id} fue borrado`,
    });
  } catch (error) {
    next(error);
  }
};

const likeTweetController = async (req, res, next) => {
  try {
    //tweet id
    const { id } = req.params;

    //token user id
    const userId = req.userId;

    const tweet = await getTweetById(id, userId);

    console.log(tweet.likedByMe);

    if (tweet.likedByMe === 0) {
      //quitamos like
      await likeTweet(userId, id);
    } else {
      //hacemos like
      await dislikeTweet(userId, id);
    }

    const updatedTweet = await getTweetById(id, userId);

    res.send({
      status: 'ok',
      data: updatedTweet,
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
  likeTweetController,
};
