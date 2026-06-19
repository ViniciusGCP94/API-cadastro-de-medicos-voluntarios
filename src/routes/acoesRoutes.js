const express = require('express');
const router = express.Router();
const controller = require('../controllers/acoesController');
const {validarCriacaoAcao, validarAtualizacaoAcao} = require('../middlewares/validators/acoesValidator');

// 1. POST /acoes — Cria uma nova ação vinculada a um voluntário (autor)
router.post('/acoes', validarCriacaoAcao, controller.criarAcao);

// 2. GET /acoes — Lista todas as ações cadastradas
router.get('/acoes', controller.listarAcoesCadastradas);

// 3. GET /acoes/:id — Busca uma ação específica pelo ID
router.get('/acoes/:id', controller.buscarAcaoPorId);

// 4. PUT /acoes/:id — Atualiza os dados de uma ação existente
router.put('/acoes/:id', validarAtualizacaoAcao, controller.atualizarDadosAcao);

// 5. DELETE /acoes/:id — Remove uma ação do sistema
router.delete('/acoes/:id', controller.excluirAcao); 

module.exports = router;