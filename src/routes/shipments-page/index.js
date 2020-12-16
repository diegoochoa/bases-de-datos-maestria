const bodyParser = require('body-parser');
const express = require('express');
const check_format = require('../../middlewares/check-format');
const shipment_controller = require('./shipments-controller');
const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream', limit: '10MB' }));

router.get('/', check_format, shipment_controller.list);

router.get('/add', check_format, shipment_controller.add);

router.get('/delete/:numero_guia', check_format, shipment_controller._delete);

router.get('/edit/:numero_guia', check_format, shipment_controller.edit);

router.post('/update/:numero_guia', check_format, shipment_controller.update);

router.post('/save', check_format, shipment_controller.save);

module.exports = router;
