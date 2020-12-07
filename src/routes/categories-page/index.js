const bodyParser = require('body-parser');
const express = require('express');
const check_format = require('../../middlewares/check-format');
const categories_controller = require('./categories-controller');
const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream', limit: '10MB' }));

router.get('/', check_format, categories_controller.list);

router.get('/add', check_format, categories_controller.add);

router.post('/save', check_format, categories_controller.save);

router.get('/delete/:id', check_format, categories_controller._delete);

router.get('/edit/:id', check_format, categories_controller.edit);

router.post('/update/:id', check_format, categories_controller.update);

module.exports = router;
