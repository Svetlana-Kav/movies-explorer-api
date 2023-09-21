const router = require('express').Router();
const { validationCreateMovie, validationDeleteMovie } = require('../utils/validation');
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

router.post('/', validationCreateMovie, createMovie);

router.get('/', getMovies);

router.delete('/:movieId', validationDeleteMovie, deleteMovie);

module.exports = router;
