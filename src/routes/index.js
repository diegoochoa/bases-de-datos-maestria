const express = require('express');
const router = express.Router();

const home_page_router = require('./home-page');
const login_page_controller = require('./login-page');
const pos_page_router = require('./pos-controller');

router.use('/home', home_page_router);

router.use('/login', login_page_controller);

router.use('/pos', pos_page_router);
module.exports = router;
