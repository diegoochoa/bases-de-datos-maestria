const bodyParser = require('body-parser');
const express = require('express');
const check_format = require('../../middlewares/check-format');
const pos_page_controller = require('./pos-controller');
const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream', limit: '10MB' }));

router.get('/', check_format, pos_page_controller.home);

router.post('/save_sell', check_format, pos_page_controller.save_sell);

router.get('/sales', check_format, pos_page_controller.list);

router.get('/sales/print', check_format, pos_page_controller.print);

module.exports = router;
