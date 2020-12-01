const { validationResult } = require('express-validator');

function check_format(req, res, next) {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    res.status(400).json({ status: 'Error bad request', body: errors });
  } else {
    next();
  }
}

module.exports = check_format;
