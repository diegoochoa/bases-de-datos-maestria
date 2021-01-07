const bodyParser = require('body-parser');
const express = require('express');
const check_format = require('../../middlewares/check-format');
const balance_controller = require('./balance-controller');
const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream', limit: '10MB' }));

router.get('/', check_format, balance_controller.get);

router.get('/print', check_format, balance_controller.print);

module.exports = router;
