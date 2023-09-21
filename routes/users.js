const router = require('express').Router();
const {
  getProfile,
  editProfile,
} = require('../controllers/users');
const { validationEditProfile } = require('../utils/validation');
require('dotenv').config();

router.get('/me', getProfile);

router.patch('/me', validationEditProfile, editProfile);

module.exports = router;
