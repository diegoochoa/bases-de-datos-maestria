const express = require('express');
const router = express.Router();

const home_page_router = require('./home-page');
const login_page_router = require('./login-page');
const pos_page_router = require('./pos-page');
const shipments_page_router = require('./shipments-page');
const add_shipment_router = require('./add-shipment-page');

router.use('/home', home_page_router);

router.use('/login', login_page_router);

router.use('/pos', pos_page_router);

router.use('/shipments', shipments_page_router);

router.use('/add-shipment', add_shipment_router);

module.exports = router;
