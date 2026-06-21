const {body, validationResult} = require('express-validator');

const validarLogin = [
    body('email').trim().isEmail().withMessage('Email inválido.').normalizeEmail(),
    body('senha').trim().notEmpty().withMessage('A senha é obrigatória.'),

    (req, res, next) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      const listaErros = erros.array().map(err => err.msg);
      const erroOperacional = new Error(listaErros);
      erroOperacional.status = 400;
      return next(erroOperacional);
    }
    next();
  }
];


module.exports = {
    validarLogin
};
