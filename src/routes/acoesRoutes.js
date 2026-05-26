const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 1. POST /acoes — Cria uma nova ação vinculada a um voluntário (autor)
router.post('/acoes', async (req, res) => {
    const { titulo, descricao, url_imagem, tipo, id_autor } = req.body;

    const query = `
        INSERT INTO acoes (titulo, descricao, url_imagem, tipo, id_autor) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, titulo, descricao, url_imagem, tipo, id_autor, data_criacao
    `;
    const values = [titulo, descricao, url_imagem, tipo, id_autor];

    const resultado = await pool.query(query, values);
    res.status(201).json(resultado.rows[0]);
});

// 2. GET /acoes — Lista todas as ações cadastradas
router.get('/acoes', async (req, res) => {
    // Buscamos todas as colunas da tabela acoes
    const query = `SELECT id, titulo, descricao, url_imagem, tipo, id_autor, data_criacao FROM acoes`;
    const resultado = await pool.query(query);
    
    res.json(resultado.rows); // Retorna o array de ações (mesmo que vazio)
});

// 3. GET /acoes/:id — Busca uma ação específica pelo ID
router.get('/acoes/:id', async (req, res) => {
    const { id } = req.params;

    const query = `SELECT id, titulo, descricao, url_imagem, tipo, id_autor, data_criacao FROM acoes WHERE id = $1`;
    const resultado = await pool.query(query, [id]);

    // Regra de negócio: Se não encontrar nenhuma linha correspondente ao ID
    if (resultado.rows.length === 0) {
        return res.status(404).json({ error: 'Ação não encontrada.' });
    }

    res.json(resultado.rows[0]);
});

module.exports = router;