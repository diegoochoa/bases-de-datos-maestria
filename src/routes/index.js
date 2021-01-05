const express = require('express');
const router = express.Router();

const home_page_router = require('./home-page');
const login_page_router = require('./login-page');
const pos_page_router = require('./pos-page');
const shipments_page_router = require('./shipments-page');
const products_page_router = require('./products-page');
const categories_page_router = require('./categories-page');
const branch_offices_page_roter = require('./branch-offices-page');
const customes_page_router = require('./customers-page');
const employees_page_router = require('./employees-page');

const purchases_page_router = require('./purchases-page');
const balance_page_router = require('./balance-page');

const is_auth = require('../middlewares/is_auth');


router.use('/home', is_auth, home_page_router);

router.use('/login', login_page_router);

router.use('/pos', is_auth, pos_page_router);

router.use('/shipments', is_auth, shipments_page_router);

router.use('/products', is_auth, products_page_router);

router.use('/categories', is_auth, categories_page_router);

router.use('/branch-offices', is_auth, branch_offices_page_roter);

router.use('/customers', is_auth, customes_page_router);

router.use('/employees', is_auth, employees_page_router);

router.use('/purchases', purchases_page_router);

router.use('/balance', balance_page_router);

module.exports = router;
