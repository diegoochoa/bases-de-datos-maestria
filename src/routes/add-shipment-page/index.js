const bodyParser = require('body-parser');
const express = require('express');
const check_format = require('../../middlewares/check-format');
const add_shipment_controller = require('./add-shipment-controller');
const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream', limit: '10MB' }));

router.get('/', check_format, add_shipment_controller);

module.exports = router;
