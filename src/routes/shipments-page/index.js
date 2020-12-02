const bodyParser = require('body-parser');
const express = require('express');
const check_format = require('../../middlewares/check-format');
const shipment_controller = require('./shipments-controller');
const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream', limit: '10MB' }));

router.get('/', check_format, shipment_controller);

module.exports = router;
