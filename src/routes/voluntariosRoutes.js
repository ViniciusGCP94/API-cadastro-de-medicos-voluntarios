const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const controller = require('../controllers/voluntariosController');
const { body, validationResult } = require('express-validator');

// 1. CRIAR VOLUNTÁRIO
router.post('/voluntarios',[
        body('nome').trim().notEmpty().withMessage('O nome é obrigatório.'),
        body('sobrenome').trim().notEmpty().withMessage('O sobrenome é obrigatório.'),
        body('email').isEmail().withMessage('Email inválido.').normalizeEmail(), // Sanitização: deixa o email em minúsculas e limpo
        body('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.'),          
    ], 
    controller.criarVoluntario
);

// 2. LISTAR TODOS
router.get('/voluntarios', controller.listarVoluntarios);

// 3. BUSCAR POR ID
router.get('/voluntarios/:id', controller.buscarVoluntarioPorId);

// 4. ATUALIZAR
router.put('/voluntarios/:id', 
    [
        body('nome').trim().notEmpty().withMessage('O nome não pode ser vazio.'),
        body('sobrenome').trim().notEmpty().withMessage('O sobrenome não pode ser vazio.'),
        body('email').trim().isEmail().withMessage('Email inválido.').normalizeEmail(),
        // .optional() diz que se a senha não vier, tudo bem. Mas se vier, TEM que ter 6 caracteres!
        body('senha').optional({checkFalsy:true}).isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.'),
    ], 
    controller.atualizarVoluntario
);

// 5. EXCLUIR
router.delete('/voluntarios/:id', controller.excluirVoluntario);

module.exports = router;