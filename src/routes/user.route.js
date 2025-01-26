const express = require('express');
const { basicAuth } = require('../middlewares/auth.middleware');
const { VALIDATION } = require('../utils/joi.utils');
const UserController = require('../controllers/user.controller')

const router = express.Router('/user');

router.post('/signup', [basicAuth, VALIDATION.SIGNUP], UserController.signUp);
router.post('/login', [basicAuth, VALIDATION.LOGIN], UserController.login);

module.exports = router;
