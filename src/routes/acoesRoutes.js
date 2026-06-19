const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const controller = require('../controllers/acoesController');

const { body, validationResult } = require('express-validator');

// 1. POST /acoes — Cria uma nova ação vinculada a um voluntário (autor)
router.post('/acoes',
    [
        body('titulo').trim().notEmpty().withMessage('O título é obrigatório.'),
        body('tipo').trim().notEmpty().withMessage('O tipo é obrigatório.'),
        body('id_autor').isInt().withMessage('O ID do autor deve ser um número inteiro.'),
    ],
    controller.criarAcao
);

// 2. GET /acoes — Lista todas as ações cadastradas
router.get('/acoes', controller.listarAcoesCadastradas);

// 3. GET /acoes/:id — Busca uma ação específica pelo ID
router.get('/acoes/:id', controller.buscarAcaoPorId);

// 4. PUT /acoes/:id — Atualiza os dados de uma ação existente
router.put('/acoes/:id',
    [
        body('titulo').trim().notEmpty().withMessage('O título é obrigatório.'),
        body('tipo').trim().notEmpty().withMessage('O tipo é obrigatório.'),
        body('id_autor').isInt({ min: 1 }).withMessage('O ID do autor deve ser um número inteiro positivo.'),
    ],
    controller.atualizarDadosAcao
);

// 5. DELETE /acoes/:id — Remove uma ação do sistema
router.delete('/acoes/:id', controller.excluirAcao); 

module.exports = router;