const {body} = require('express-validator');

const validarCriacaoAcao = [
        body('titulo').trim().notEmpty().withMessage('O título é obrigatório.'),
        body('tipo').trim().notEmpty().withMessage('O tipo é obrigatório.'),
    ];

const validarAtualizacaoAcao = [
        body('titulo').trim().notEmpty().withMessage('O título é obrigatório.'),
        body('tipo').trim().notEmpty().withMessage('O tipo é obrigatório.'),
    ];

module.exports = {
    validarCriacaoAcao,
    validarAtualizacaoAcao
}
