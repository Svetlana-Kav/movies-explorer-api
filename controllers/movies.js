const Movie = require('../models/movie');
const ValidationError = require('../errors/validation-error');
const DocumentNotFoundError = require('../errors/document-not-found-error');

module.exports.createMovie = (req, res, next) => {
  const data = req.body;
  data.owner = req.user._id;

  Movie.create(data)
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неправильный запрос'));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
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
        next(new ValidationError('Нельзя удалять чужие фильмы'));
        return;
      }
      Movie.deleteOne(movie)
        .orFail()
        .then(() => res.status(200).send(movie))
        .catch((err) => res.send({ message: err.message }));
    })
    .catch(next);
};
