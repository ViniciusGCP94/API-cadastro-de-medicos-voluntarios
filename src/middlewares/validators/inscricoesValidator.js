const {body} = require('express-validator');

const validarInscricaoNaAcao = [
    body('id_acao').isInt().withMessage('O ID da ação deve ser um número inteiro.'),
];

module.exports = {validarInscricaoNaAcao}
