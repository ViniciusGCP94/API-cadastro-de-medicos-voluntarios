const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 1. POST /inscricoes — Inscreve um voluntário em uma ação
router.post('/inscricoes', async (req, res, next) => {
    try {
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
        // Se o voluntário/ação não existir (23503) ou se for duplicado (23505),
        // o erro é enviado diretamente para o middleware global do app.js
        next(error);
    }
});

// 2. GET /voluntarios/:id/inscricoes — Lista as ações de um voluntário específico
router.get('/voluntarios/:id/inscricoes', async (req, res, next) => {
    try {
        const { id } = req.params;

        // Trazemos os dados da inscrição junto com os detalhes da ação usando INNER JOIN
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
        
        // Retorna a lista (mesmo que vazia, caso o voluntário não tenha inscrições)
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

        // Validação manual necessária: deletar um ID inexistente não gera erro no banco
        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Inscrição não encontrada.' });
        }

        res.json({ message: 'Inscrição cancelada com sucesso.' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;