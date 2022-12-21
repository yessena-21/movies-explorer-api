const router = require('express').Router();
const { validateUserUpdate } = require('../middlewares/validation');
const {
  updateUser, getUserInfo,
} = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/users/me', getUserInfo);

// обновляет информацию о пользователе (email и имя)
router.patch('/users/me', validateUserUpdate, updateUser);

module.exports = router;
