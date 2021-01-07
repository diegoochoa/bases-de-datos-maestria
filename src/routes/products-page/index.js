const bodyParser = require('body-parser');
const express = require('express');
const check_format = require('../../middlewares/check-format');
const product_controller = require('./products-controller');
const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream', limit: '10MB' }));

router.get('/', check_format, product_controller.list);

router.get('/add', check_format, product_controller.add);

router.post('/save', check_format, product_controller.save);

router.get('/delete/:id/:id_sucursal', check_format, product_controller._delete);

router.get('/edit/:id/:id_sucursal', check_format, product_controller.edit);

router.post('/update/:id/:id_sucursal', check_format, product_controller.update);

router.get('/inventory', check_format, product_controller.list_inventory);

router.get('/inventory/print', check_format, product_controller.print);

module.exports = router;
