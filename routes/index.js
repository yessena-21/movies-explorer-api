const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { validateUserBody, validateAuthentication } = require('../middlewares/validation');

router.post('/signin', validateAuthentication, login);

router.post('/signup', validateUserBody, createUser);

router.use(auth);
router.use('/', userRouter);
router.use('/', movieRouter);

module.exports = router;
