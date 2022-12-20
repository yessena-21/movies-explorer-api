require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { CastError } = require('../errors/cast-error');
const { ValidationError } = require('../errors/validation-error');
const { ExistFieldError } = require('../errors/exist-field-error');
const { NotFoundError } = require('../errors/not-found-error');
const { AuthError } = require('../errors/auth-error');

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
      bcrypt.compare(password, user.password, (error, isValidPassword) => {
        if (!isValidPassword) return next(new AuthError('Неверный email или пароль'));

        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',

          { expiresIn: '7d' },
        );

        return res.send({ token });
      });
    }).catch(() => {
      next(new AuthError('Неверный email или пароль'));
    });
};

function logout(req, res) {
  res.clearCookie('jwt')
    .status(200)
    .send({ message: 'успешный выход' });
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
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ExistFieldError('Email уже существует'));
      } else {
        next(err);
      }
    });
};

const getUserInfo = (req, res, next) => {
  const currentUser = req.user._id;
  User.findById(currentUser)
    .orFail(new NotFoundError('Пользователь по указанному id не найден'))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Невалидный id пользователя'));
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
  ).orFail(new NotFoundError('Пользователь по указанному id не найден'))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные запроса'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ExistFieldError('Email уже существует'));
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
