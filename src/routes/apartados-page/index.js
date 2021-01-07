const bodyParser = require('body-parser');
const express = require('express');
const check_format = require('../../middlewares/check-format');
const apartados_controller = require('./apartados-controller');
const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream', limit: '10MB' }));

router.get('/', check_format, apartados_controller.list);

router.get('/add', check_format, apartados_controller.add);

router.post('/save', check_format, apartados_controller.save);

router.get('/delete/:id', check_format, apartados_controller._delete);

router.get('/abonar/:id', check_format, apartados_controller.abonar);

router.post('/saveabonar/:id', check_format, apartados_controller.saveabonar);

router.get('/detalleapartado/:id', check_format, apartados_controller.detalleApartado);

module.exports = router;
