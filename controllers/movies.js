const Movie = require('../models/movie');
const { CastError } = require('../errors/cast-error');
const { ValidationError } = require('../errors/validation-error');
const { NotFoundError } = require('../errors/not-found-error');
const { ForbiddenError } = require('../errors/forbidden-error');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((data) => res.send(data))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};
const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(() => next(new NotFoundError('Фильм с указанным _id не найден!!')))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new ForbiddenError('Вы не имеет права удалить фильм'));
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .orFail(new NotFoundError('Фильм по указанному id не найден'))
          .then((data) => res.status(200).send(data))
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new CastError('Невалидный id фильма'));
            } else {
              next(err);
            }
          });
      }
    }).catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Невалидный id фильма'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
