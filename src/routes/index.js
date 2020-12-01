const express = require('express');
const router = express.Router();

const home_page_router = require('./home-page');
const login_page_router = require('./login-page');
const pos_page_router = require('./pos-controller');
const shipments_page_router = require('./shipments-page');

router.use('/home', home_page_router);

router.use('/login', login_page_router);

router.use('/pos', pos_page_router);

router.use('/shipments', shipments_page_router);
module.exports = router;
