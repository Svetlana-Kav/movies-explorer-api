const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getProfile,
  editProfile,
} = require('../controllers/users');
require('dotenv').config();

router.get('/me', getProfile);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), editProfile);

module.exports = router;
