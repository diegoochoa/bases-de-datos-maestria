const bodyParser = require('body-parser');
const express = require('express');
const check_format = require('../../middlewares/check-format');
const customers_controller = require('./customers-controller');
const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream', limit: '10MB' }));

router.get('/', check_format, customers_controller.list);

router.get('/add', check_format, customers_controller.add);

router.post('/save', check_format, customers_controller.save);

router.get('/delete/:id', check_format, customers_controller._delete);

router.get('/edit/:id', check_format, customers_controller.edit);

router.post('/update/:id', check_format, customers_controller.update);

module.exports = router;
