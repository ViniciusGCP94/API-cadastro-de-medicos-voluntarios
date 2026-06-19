const express = require('express');
const router = express.Router();
const controller = require('../controllers/inscricoesController');
const { validarInscricaoNaAcao } = require('../middlewares/validators/inscricoesValidator');


// 1. POST /inscricoes — Inscreve um voluntário em uma ação
router.post('/inscricoes', validarInscricaoNaAcao, controller.inscreverVoluntarioEmAcao);
// 2. GET /voluntarios/:id/inscricoes — Lista as ações de um voluntário específico
router.get('/voluntarios/:id/inscricoes', controller.listarAcoesDeVoluntario);

// 3. DELETE /inscricoes/:id — Cancela uma inscrição
router.delete('/inscricoes/:id', controller.cancelarInscricao);

module.exports = router;