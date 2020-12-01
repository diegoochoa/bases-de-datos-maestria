const express = require('express');
const router = express.Router();

const home_page_router = require('./home-page');
const login_page_controller = require('./login-page');
router.use('/home', home_page_router);

router.use('/login', login_page_controller);

module.exports = router;
