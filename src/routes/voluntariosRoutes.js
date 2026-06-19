const express = require('express');
const router = express.Router();
const controller = require('../controllers/voluntariosController');
const { validarCriacaoVoluntario, validarAtualizacaoVoluntario } = require('../middlewares/validators/voluntarioValidator');

// 1. CRIAR VOLUNTÁRIO
router.post('/voluntarios', validarCriacaoVoluntario, controller.criarVoluntario);

// 2. LISTAR TODOS
router.get('/voluntarios', controller.listarVoluntarios);

// 3. BUSCAR POR ID
router.get('/voluntarios/:id', controller.buscarVoluntarioPorId);

// 4. ATUALIZAR DADOS DO VOLUNTÁRIO
router.put('/voluntarios/:id', validarAtualizacaoVoluntario, controller.atualizarDadosVoluntario);

// 5. EXCLUIR
router.delete('/voluntarios/:id', controller.excluirVoluntario);

module.exports = router;