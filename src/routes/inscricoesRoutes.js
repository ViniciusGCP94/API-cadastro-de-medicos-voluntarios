const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/inscricoesController');

// 1. POST /inscricoes — Inscreve um voluntário em uma ação
router.post('/inscricoes', 
    [
        body('id_voluntario').isInt().withMessage('O ID do voluntário deve ser um número inteiro.'),
        body('id_acao').isInt().withMessage('O ID da ação deve ser um número inteiro.'),
    ],
    controller.inscreverVoluntarioEmAcao
);

// 2. GET /voluntarios/:id/inscricoes — Lista as ações de um voluntário específico
router.get('/voluntarios/:id/inscricoes', controller.listarAcoesDeVoluntario);

// 3. DELETE /inscricoes/:id — Cancela uma inscrição
router.delete('/inscricoes/:id', controller.cancelarInscricao);

module.exports = router;