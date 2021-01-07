const bodyParser = require('body-parser');
const express = require('express');
const check_format = require('../../middlewares/check-format');
const purchases_controller = require('./purchases-controller');
const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream', limit: '10MB' }));

router.get('/', check_format, purchases_controller.list);

router.get('/add', check_format, purchases_controller.add);

router.post('/save', check_format, purchases_controller.save);

router.get('/delete/:id', check_format, purchases_controller._delete);

router.get('/edit/:id', check_format, purchases_controller.edit);

router.post('/update/:id', check_format, purchases_controller.update);

router.get('/detallecompra/:id', check_format, purchases_controller.detalleCompra);

module.exports = router;
