const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const DuplicateError = require('../errors/DuplicateError');
const AuthorizationError = require('../errors/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.singup = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.send({
      name: user.name,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Переданны некорректные данные. ${err.message}`));
        return;
      }
      if (err.code === 11000) {
        throw new DuplicateError('Пользователь с таким email уже зарегестрирован');
      }
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new DuplicateError('Пользователь с таким email уже зарегестрирован');
      }
    })
    .then(() => {
      User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
        .then((user) => {
          if (!user) {
            throw new NotFoundError('Пользователь не найден');
          } else {
            res.send(user);
          }
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданны некорректные данные'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.singin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Не верное имя пользователя и пароля');
      }

      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    // eslint-disable-next-line consistent-return
    .then(([user, matched]) => {
      if (!matched) {
        next(new AuthorizationError('Не верное имя пользователя и пароля'));
        return;
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'Unauthorized') {
        next(new AuthorizationError('Не верное имя пользователя и пароля'));
      } else {
        next(err);
      }
    });
};
