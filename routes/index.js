const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { singinValidation, singupValidation } = require('../middlewares/validation');
const { singin, singup } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', singinValidation, singin);
router.post('/signup', singupValidation, singup);

router.use(auth);
router.use('/users', userRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Страницы не существует'));
});

module.exports = router;
