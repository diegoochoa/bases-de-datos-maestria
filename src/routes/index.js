const express = require('express');
const router = express.Router();

const home_page_router = require('./home-page');
const login_page_router = require('./login-page');
const pos_page_router = require('./pos-page');
const shipments_page_router = require('./shipments-page');
const products_page_router = require('./products-page');
const categories_page_router = require('./categories-page');
const branch_offices_page_roter = require('./branch-offices-page');

router.use('/home', home_page_router);

router.use('/login', login_page_router);

router.use('/pos', pos_page_router);

router.use('/shipments', shipments_page_router);

router.use('/products', products_page_router);

router.use('/categories', categories_page_router);

router.use('/branch-offices', branch_offices_page_roter);

module.exports = router;
