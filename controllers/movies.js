const Movie = require('../models/movie');
const ForbiddenError = require('../errors/forbidden-error');
const DocumentNotFoundError = require('../errors/document-not-found-error');

module.exports.createMovie = (req, res, next) => {
  const data = req.body;
  data.owner = req.user._id;

  Movie.create(data)
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ForbiddenError('Неправильный запрос'));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail()
    .then((movies) => res.status(200).send(movies))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new DocumentNotFoundError('Запрашиваемые данные не найдены.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new DocumentNotFoundError('Запрашиваемые данные не найдены.'));
        return;
      }
      if (movie.owner.valueOf() !== req.user._id) {
        next(new ForbiddenError('Нельзя удалять чужие фильмы'));
        return;
      }
      Movie.deleteOne(movie)
        .orFail()
        .then(() => res.status(200).send(movie))
        .catch(next);
    })
    .catch(next);
};
