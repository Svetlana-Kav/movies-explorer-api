const router = require('express').Router();
const { validationCreateUser, validationLogin } = require('../utils/validation');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const DocumentNotFoundError = require('../errors/document-not-found-error');

router.post('/signin', validationLogin, login);

router.post('/signup', validationCreateUser, createUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use('*', (req, res, next) => {
  next(new DocumentNotFoundError('Страница не существует.'));
});

module.exports = router;
