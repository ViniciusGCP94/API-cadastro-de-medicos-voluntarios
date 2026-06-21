const express = require('express');
const router = express.Router();
const {validarLogin } = require('../middlewares/validators/authValidator');
const controller = require('../controllers/authController');

router.post('/login', validarLogin, controller.login);

module.exports = router;