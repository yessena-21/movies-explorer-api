require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { CastError } = require('../errors/cast-error');
const { ValidationError } = require('../errors/validation-error');
const { ExistFieldError } = require('../errors/exist-field-error');
const { NotFoundError } = require('../errors/not-found-error');
const { AuthError } = require('../errors/auth-error');
const {
  INCORRECT_USER_ID_MESSAGE,
  NOTFOUND_USER_ID_MESSAGE,
  LOGIN_FAIL_MESSAGE,
  REPEATED_EMAIL_ERROR_MESSAGE,
  VALIDATION_ERROR,
  CAST_ERROR,
  VALIDATION_MESSAGE,
  MONGO_SERVER_ERROR,
  SUCSESS_LOGOUT,
} = require('../errors/errors');

const { devJWT } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;
// const login = (req, res, next) => {
//   const { email, password } = req.body;

//   User.findOne({ email }).select('+password')
//     .then((user) => {
//       bcrypt.compare(password, user.password, (error, isValidPassword) => {
//         if (!isValidPassword) return next(new AuthError('Неверный email или пароль'));

//         const token = jwt.sign({ _id: user._id },
//  NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });

//         return res
//           .cookie('jwt', token, {
//           // token - наш JWT токен, который мы отправляем
//             maxAge: 3600000 * 24 * 7,
//             httpOnly: true,
//             sameSite: false,
//             secure: true,
//           })
//           .status(200)
//           .send(user);
//       });
//     }).catch(() => {
//       next(new AuthError('Неверный email или пароль'));
//     });
// };
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError(LOGIN_FAIL_MESSAGE);
      }
      bcrypt.compare(password, user.password, (error, isValidPassword) => {
        if (!isValidPassword) return next(new AuthError(LOGIN_FAIL_MESSAGE));

        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : devJWT,

          { expiresIn: '7d' },
        );

        return res.send({ token });
      });
    }).catch(next);
};

function logout(req, res) {
  res.clearCookie('jwt')
    .status(200)
    .send({ message: SUCSESS_LOGOUT });
}

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    // вернём записанные в базу данные
    .then((user) => res.send({
      id: user._id, name: user.name,
    }))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        next(new ValidationError(VALIDATION_MESSAGE));
      } else if (err.name === MONGO_SERVER_ERROR && err.code === 11000) {
        next(new ExistFieldError(REPEATED_EMAIL_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

const getUserInfo = (req, res, next) => {
  const currentUser = req.user._id;
  User.findById(currentUser)
    .orFail(new NotFoundError(NOTFOUND_USER_ID_MESSAGE))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        next(new CastError(INCORRECT_USER_ID_MESSAGE));
      } else {
        next(err);
      }
    });
};
const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      runValidators: true,
      new: true,
    },
  ).orFail(new NotFoundError(NOTFOUND_USER_ID_MESSAGE))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        next(new ValidationError(VALIDATION_MESSAGE));
      } else if (err.name === MONGO_SERVER_ERROR && err.code === 11000) {
        next(new ExistFieldError(REPEATED_EMAIL_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports = {
  login,
  logout,
  getUserInfo,
  updateUser,
  createUser,
};
