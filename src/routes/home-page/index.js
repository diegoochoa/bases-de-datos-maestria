const bodyParser = require('body-parser');
const express = require('express');
const check_format = require('../../middlewares/check-format');
const home_page_controller = require('./home-page-controller');
const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream', limit: '10MB' }));

router.get('/', check_format, home_page_controller);

module.exports = router;
