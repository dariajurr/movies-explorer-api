const router = require('express').Router();
const {
  postMovies, getMovies, deleteMovies,
} = require('../controllers/movies');
const { postMoviesValidation, movieIdValidation } = require('../middlewares/validation');

router.post('/', postMoviesValidation, postMovies);
router.get('/', getMovies);
router.delete('/:id', movieIdValidation, deleteMovies);

module.exports = router;
