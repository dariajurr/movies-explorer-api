require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const bodyParse = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorsHandler');
const limiter = require('./middlewares/limiter');

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

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();

app.use('*', cors(options));

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

mongoose.connect(
  MONGO_URL,
  (err) => {
    if (err) throw err;
    console.log('connected to MongoDB');
  },
);

app.use(requestLogger);

app.use(helmet());

app.use(limiter);

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
