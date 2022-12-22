const BAD_REQUEST_ERROR_CODE = 400;
const UNAUTHORIZED_MESSAGE = 'Необходима авторизация';
const SERVER_ERROR_MESSAGE = 'На сервере произошла ошибка';
const LOGIN_FAIL_MESSAGE = 'Неправильные почта или пароль';
const REPEATED_EMAIL_ERROR_MESSAGE = 'Такой email уже существует';
const INVALID_ID = 'Невалидный id';
const FORBIDDEN_MESSAGE = 'Вы не имеет права удалить фильм';
const CAST_ERROR = 'CastError';
const VALIDATION_ERROR = 'ValidationError';
const MONGO_SERVER_ERROR = 'MongoServerError';
const INCORRECT_USER_ID_MESSAGE = 'Невалидный id пользователя';
const NOTFOUND_USER_ID_MESSAGE = 'Пользователь по указанному id не найден';
const NOTFOUND_MOVIE_ID_MESSAGE = 'Фильм с указанным _id не найден!';
const VALIDATION_MESSAGE = 'Некорректные данные запроса';
const NOT_FOUND_MESSAGE = 'Страница не найдена';
const SUCSESS_LOGOUT = 'Успешный выход';

module.exports = {
  BAD_REQUEST_ERROR_CODE,
  UNAUTHORIZED_MESSAGE,
  SERVER_ERROR_MESSAGE,
  LOGIN_FAIL_MESSAGE,
  REPEATED_EMAIL_ERROR_MESSAGE,
  INVALID_ID,
  FORBIDDEN_MESSAGE,
  CAST_ERROR,
  VALIDATION_ERROR,
  INCORRECT_USER_ID_MESSAGE,
  NOTFOUND_USER_ID_MESSAGE,
  NOTFOUND_MOVIE_ID_MESSAGE,
  VALIDATION_MESSAGE,
  NOT_FOUND_MESSAGE,
  MONGO_SERVER_ERROR,
  SERVER_ERROR: 500,
  NOT_FOUND: 404,
  INCORRECT_DATA: 400,
  FORBID_ERROR: 403,
  AUTH_ERROR: 401,
  EXIST_ERROR: 409,
  SUCSESS_LOGOUT,
};
