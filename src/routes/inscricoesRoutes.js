const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const { body, validationResult } = require('express-validator');

// 1. POST /inscricoes — Inscreve um voluntário em uma ação
router.post('/inscricoes', 
[
    body('id_voluntario').isInt().withMessage('O ID do voluntário deve ser um número inteiro.'),
    body('id_acao').isInt().withMessage('O ID da ação deve ser um número inteiro.'),
],
async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const erroValidacao = new Error('Falha na validação dos dados.');
            erroValidacao.status = 400;
            erroValidacao.message = errors.array().map(err => err.msg);
            throw erroValidacao;
        }
        const { id_voluntario, id_acao } = req.body;

        const query = `
            INSERT INTO inscricoes (id_voluntario, id_acao) 
            VALUES ($1, $2) 
            RETURNING id, id_voluntario, id_acao, data_inscricao
        `;
        const values = [id_voluntario, id_acao];

        const resultado = await pool.query(query, values);
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        next(error); // Trata automaticamente duplicados (23505) ou chaves inválidas (23503)
    }
});

// 2. GET /voluntarios/:id/inscricoes — Lista as ações de um voluntário específico
router.get('/voluntarios/:id/inscricoes', async (req, res, next) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                i.id AS id_inscricao,
                i.data_inscricao,
                a.id AS id_acao,
                a.titulo,
                a.descricao,
                a.tipo
            FROM inscricoes i
            INNER JOIN acoes a ON i.id_acao = a.id
            WHERE i.id_voluntario = $1
        `;

        const resultado = await pool.query(query, [id]);
        
        // Retorna a lista (vazia ou populada). Não lançamos 404 aqui porque ter 0 inscrições é um estado operacional válido.
        res.json(resultado.rows);
    } catch (error) {
        next(error);
    }
});

// 3. DELETE /inscricoes/:id — Cancela uma inscrição
router.delete('/inscricoes/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM inscricoes WHERE id = $1 RETURNING id';
        const resultado = await pool.query(query, [id]);

        if (resultado.rowCount === 0) {
            const erro = new Error('Inscrição não encontrada para cancelamento.');
            erro.status = 404;
            throw erro;
        }

        res.json({ message: 'Inscrição cancelada com sucesso.' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;