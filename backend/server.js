require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const {
  newUserController,
  getUserController,
  getUserTweetsController,
  getMeController,
  loginController,
  updateUserDataController,
  updateUserPasswordController,
  updateUserAvatarController,
} = require('./controllers/users');

const {
  getTweetsController,
  newTweetController,
  getSingleTweetController,
  deleteTweetController,
  likeTweetController,
} = require('./controllers/tweets');

const { authUser, isUser } = require('./middlewares/auth');

const app = express();

app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('./uploads'));

app.use(authUser);

//Rutas de usuario
app.post('/user', newUserController);
app.get('/user/:id', getUserController);
app.get('/user/:id/tweets', getUserTweetsController);
app.get('/user', isUser, getMeController);
app.put('/user', isUser, updateUserDataController);
app.put('/user/password', isUser, updateUserPasswordController);
app.put('/user/avatar', isUser, updateUserAvatarController);
app.post('/login', loginController);

//Rutas de tweets
app.post('/', isUser, newTweetController);
app.get('/', getTweetsController);
app.get('/tweet/:id', getSingleTweetController);
app.post('/tweet/:id/like', isUser, likeTweetController);
app.delete('/tweet/:id', isUser, deleteTweetController);

// Middleware de 404
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

// Middleware de gestión de errores
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

const { PORT } = process.env;

// Lanzamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT} 👻`);
});
