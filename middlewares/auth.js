require('dotenv').config();
const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors/auth-error');
const { devJWT } = require('../utils/config');
const {
  UNAUTHORIZED_MESSAGE,
} = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError(UNAUTHORIZED_MESSAGE));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : devJWT);
    req.user = payload; // записываем пейлоуд в объект запроса
  } catch (err) {
    return next(new AuthError(UNAUTHORIZED_MESSAGE));
    // throw new AuthError('Необходима авторизация');
  }

  return next(); // пропускаем запрос дальше
};
