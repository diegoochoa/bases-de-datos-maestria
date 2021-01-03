const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');
const check_format = require('../../middlewares/check-format');
const login_page_controller = require('./login-page-controller');
const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream', limit: '10MB' }));

router.get('/', check_format, login_page_controller.login_page_controller);

router.post(
  '/',
  check_format,
  passport.authenticate('local', { succesRedirect: '/', failureRedirect: '/login' }),
  login_page_controller.validate_login
);

module.exports = router;
