const bodyParser = require('body-parser');
const express = require('express');
const check_format = require('../../middlewares/check-format');
const branch_offices_controller = require('./branch-offices-controller');
const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream', limit: '10MB' }));

router.get('/', check_format, branch_offices_controller.list);

router.get('/add', check_format, branch_offices_controller.add);

router.post('/save', check_format, branch_offices_controller.save);

router.get('/delete/:id', check_format, branch_offices_controller._delete);

router.get('/edit/:id', check_format, branch_offices_controller.edit);

router.post('/update/:id', check_format, branch_offices_controller.update);


module.exports = router;
