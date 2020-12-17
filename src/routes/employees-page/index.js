const bodyParser = require('body-parser');
const express = require('express');
const check_format = require('../../middlewares/check-format');
const employees_controller = require('./employees-controller');
const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream', limit: '10MB' }));

router.get('/', check_format, employees_controller.list);

router.get('/add', check_format, employees_controller.add);

router.post('/save', check_format, employees_controller.save);

router.get('/delete/:id', check_format, employees_controller._delete);

router.get('/edit/:id', check_format, employees_controller.edit);

router.post('/update/:id', check_format, employees_controller.update);

module.exports = router;
