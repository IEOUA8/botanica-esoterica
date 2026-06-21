const { validationResult } = require('express-validator');

function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  return res.status(400).json({
    message: 'La solicitud contiene datos inválidos.',
    errors: result.array({ onlyFirstError: true }).map((error) => ({
      field: error.path,
      message: error.msg,
    })),
  });
}

module.exports = { validateRequest };

