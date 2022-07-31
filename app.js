require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const NotFoundError = require('./errors/NotFoundError');
const { singin, singup } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { singinValidation, singupValidation } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const options = {
  origin: {
    origin: [
      'http://localhost:3000',
      'localhost:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
};

const { PORT = 3001 } = process.env;
const app = express();

app.use('*', cors(options));

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

mongoose.connect(
  'mongodb://localhost:27017/bitfilmsdb',
  (err) => {
    if (err) throw err;
    console.log('connected to MongoDB');
  },
);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', singinValidation, singin);
app.post('/signup', singupValidation, singup);

app.use('/users', auth, userRouter);
app.use('/movies', auth, moviesRouter);

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError('Страницы не существует'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
