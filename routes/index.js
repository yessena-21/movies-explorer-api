const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { validateUserBody, validateAuthentication } = require('../middlewares/validation');
const { NotFoundError } = require('../errors/not-found-error');
const { NOT_FOUND_MESSAGE } = require('../errors/errors');

router.post('/signin', validateAuthentication, login);

router.post('/signup', validateUserBody, createUser);

router.use(auth);
router.use('/', userRouter);
router.use('/', movieRouter);

router.use('*', () => {
  throw new NotFoundError(NOT_FOUND_MESSAGE);
});

module.exports = router;
