const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 1. POST /acoes — Cria uma nova ação vinculada a um voluntário (autor)
router.post('/acoes', async (req, res, next) => {
    try {
        const { titulo, descricao, url_imagem, tipo, id_autor } = req.body;

        const query = `
            INSERT INTO acoes (titulo, descricao, url_imagem, tipo, id_autor) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, titulo, descricao, url_imagem, tipo, id_autor, data_criacao
        `;
        const values = [titulo, descricao, url_imagem, tipo, id_autor];

        const resultado = await pool.query(query, values);
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        next(err);
    }
});

// 2. GET /acoes — Lista todas as ações cadastradas
router.get('/acoes', async (req, res, next) => {
    try {
        const query = `SELECT id, titulo, descricao, url_imagem, tipo, id_autor, data_criacao FROM acoes`;
        const resultado = await pool.query(query);
        res.json(resultado.rows);
    } catch (err) {
        next(err);
    }
});

// 3. GET /acoes/:id — Busca uma ação específica pelo ID
router.get('/acoes/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = `SELECT id, titulo, descricao, url_imagem, tipo, id_autor, data_criacao FROM acoes WHERE id = $1`;
        const resultado = await pool.query(query, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Ação não encontrada.' });
        }

        res.json(resultado.rows[0]);
    } catch (err) {
        next(err);
    }
});

// 4. PUT /acoes/:id — Atualiza os dados de uma ação existente
router.put('/acoes/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, url_imagem, tipo, id_autor } = req.body;

        const query = `
            UPDATE acoes 
            SET titulo = $1, descricao = $2, url_imagem = $3, tipo = $4, id_autor = $5
            WHERE id = $6
            RETURNING id, titulo, descricao, url_imagem, tipo, id_autor, data_criacao
        `;
        const values = [titulo, descricao, url_imagem, tipo, id_autor, id];

        const resultado = await pool.query(query, values);

        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Ação não encontrada.' });
        }

        res.json(resultado.rows[0]);
    } catch (err) {
        next(err);
    }
});

// 5. DELETE /acoes/:id — Remove uma ação do sistema
router.delete('/acoes/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM acoes WHERE id = $1 RETURNING id';
        const resultado = await pool.query(query, [id]);

        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Ação não encontrada.' });
        }

        res.json({ message: 'Ação excluída com sucesso.' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;