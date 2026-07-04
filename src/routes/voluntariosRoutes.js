const express = require('express');
const router = express.Router();
const { authenticarToken }= require('../middlewares/authMiddleware');
const controller = require('../controllers/voluntariosController');
const { validarCriacaoVoluntario, validarAtualizacaoVoluntario } = require('../middlewares/validators/voluntarioValidator');

// 1. CRIAR VOLUNTÁRIO
router.post('/voluntarios', validarCriacaoVoluntario, controller.criarVoluntario);

// 2. LISTAR TODOS
router.get('/voluntarios', authenticarToken, controller.listarVoluntarios);

// 3. BUSCAR MEU PERFIL (precisa vir ANTES de /:id)
router.get('/voluntarios/me', authenticarToken, controller.buscarMeuPerfil);

// 4. BUSCAR POR ID
router.get('/voluntarios/:id', authenticarToken, controller.buscarVoluntarioPorId);

// 5. ATUALIZAR DADOS DO VOLUNTÁRIO
router.put('/voluntarios/:id', authenticarToken, validarAtualizacaoVoluntario, controller.atualizarDadosVoluntario);

// 6. EXCLUIR
router.delete('/voluntarios/:id', authenticarToken, controller.excluirVoluntario);

module.exports = router;