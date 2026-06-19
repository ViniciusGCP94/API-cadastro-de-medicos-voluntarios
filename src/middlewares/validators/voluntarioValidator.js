const {body} = require('express-validator');

const validarCriacaoVoluntario = [
    body('nome').trim().notEmpty().withMessage('O nome é obrigatório.'),
    body('sobrenome').trim().notEmpty().withMessage('O sobrenome é obrigatório.'),
    body('email').isEmail().withMessage('Email inválido.').normalizeEmail(), // Sanitização: deixa o email em minúsculas e limpo
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.'),          
];

const validarAtualizacaoVoluntario = [
    body('nome').trim().notEmpty().withMessage('O nome não pode ser vazio.'),
    body('sobrenome').trim().notEmpty().withMessage('O sobrenome não pode ser vazio.'),
    body('email').trim().isEmail().withMessage('Email inválido.').normalizeEmail(),
    // .optional() diz que se a senha não vier, tudo bem. Mas se vier, TEM que ter 6 caracteres!
    body('senha').optional({checkFalsy:true}).isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.'),
];

module.exports = {
    validarCriacaoVoluntario,
    validarAtualizacaoVoluntario
}