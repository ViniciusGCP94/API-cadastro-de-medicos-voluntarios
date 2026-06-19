const {body} = require('express-validator');

const validarCriacaoAcao = [
        body('titulo').trim().notEmpty().withMessage('O título é obrigatório.'),
        body('tipo').trim().notEmpty().withMessage('O tipo é obrigatório.'),
        body('id_autor').isInt().withMessage('O ID do autor deve ser um número inteiro.'),
    ];

const validarAtualizacaoAcao = [
        body('titulo').trim().notEmpty().withMessage('O título é obrigatório.'),
        body('tipo').trim().notEmpty().withMessage('O tipo é obrigatório.'),
        body('id_autor').isInt({ min: 1 }).withMessage('O ID do autor deve ser um número inteiro positivo.'),
    ];

module.exports = {
    validarCriacaoAcao,
    validarAtualizacaoAcao
}
