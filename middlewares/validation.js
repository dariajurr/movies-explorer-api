const { celebrate, Joi } = require('celebrate');

// AUTH Validation

module.exports.singinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.singupValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

// USERS Validation

module.exports.updateUserInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

// MOVIES Validation

module.exports.postMoviesValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required().integer(),
    description: Joi.string().required(),
    image: Joi.string().pattern(/^https?:\/\/(w{3}\.)?\S+\.\w+(\/\S+)*#?/),
    trailerLink: Joi.string().pattern(/^https?:\/\/(w{3}\.)?\S+\.\w+(\/\S+)*#?/),
    thumbnail: Joi.string().pattern(/^https?:\/\/(w{3}\.)?\S+\.\w+(\/\S+)*#?/),
    movieId: Joi.number().integer().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.movieIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});
