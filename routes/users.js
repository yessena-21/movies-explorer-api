const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUser, getUserInfo,
} = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/users/me', getUserInfo);

// обновляет информацию о пользователе (email и имя)
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = router;
