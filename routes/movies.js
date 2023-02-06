const router = require('express').Router();

const { validateObjId, validateMovieBody } = require('../middlewares/validation');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/movies', getMovies);

// создаёт фильм с переданными в теле
// country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId

router.post('/movies', validateMovieBody, createMovie);

router.delete('/movies/:movieId', validateObjId, deleteMovie);

module.exports = router;
