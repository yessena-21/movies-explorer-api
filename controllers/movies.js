const Movie = require('../models/movie');
const { CastError } = require('../errors/cast-error');
const { ValidationError } = require('../errors/validation-error');
const { NotFoundError } = require('../errors/not-found-error');
const { ForbiddenError } = require('../errors/forbidden-error');
const {
  NOTFOUND_MOVIE_ID_MESSAGE,
  FORBIDDEN_MESSAGE,
  INVALID_ID,
  VALIDATION_ERROR,
  CAST_ERROR,
  VALIDATION_MESSAGE,
} = require('../errors/errors');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((data) => res.send(data))
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        next(new ValidationError(VALIDATION_MESSAGE));
      } else {
        next(err);
      }
    });
};
const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(new NotFoundError(NOTFOUND_MOVIE_ID_MESSAGE))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new ForbiddenError(FORBIDDEN_MESSAGE));
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .orFail(new NotFoundError(NOTFOUND_MOVIE_ID_MESSAGE))
          .then((data) => res.status(200).send(data))
          .catch((err) => {
            if (err.name === CAST_ERROR) {
              next(new CastError(INVALID_ID));
            } else {
              next(err);
            }
          });
      }
    }).catch((err) => {
      if (err.name === CAST_ERROR) {
        next(new CastError(INVALID_ID));
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
