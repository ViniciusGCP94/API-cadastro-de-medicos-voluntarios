const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../config/db');

// 1. CRIAR VOLUNTÁRIO
router.post('/voluntarios', async (req, res) => {
    // CORREÇÃO: Extraindo os dados do corpo da requisição
    const { nome, sobrenome, email, senha, telefone, nascimento, biografia } = req.body;

    const hashSenha = await bcrypt.hash(senha, 10);

    const query = `INSERT INTO voluntarios (nome, sobrenome, email, senha, telefone, nascimento, biografia) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, nome, email`;
    const values = [nome, sobrenome, email, hashSenha, telefone, nascimento, biografia];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
    // Se o e-mail for duplicado, o banco joga o erro 23505, o Express 5 captura 
    // e o seu middleware envia o 409 automaticamente!
});

// 2. LISTAR TODOS
router.get('/voluntarios', async (req, res) => {
    const query = `SELECT id, nome, sobrenome, email, telefone, nascimento, biografia FROM voluntarios`;
    const resultado = await pool.query(query);
    res.json(resultado.rows);
});

// 3. BUSCAR POR ID
router.get('/voluntarios/:id', async (req, res) => {
    const { id } = req.params;

    const query = 'SELECT id, nome, sobrenome, email, telefone, nascimento, biografia FROM voluntarios WHERE id = $1';
    const resultado = await pool.query(query, [id]);

    // Erros de regra de negócio (como um ID que não existe) ainda precisam ser validados manualmente
    if (resultado.rows.length === 0) {
        return res.status(404).json({ error: 'Voluntário não encontrado' });
    }
    res.json(resultado.rows[0]);
});

// 4. ATUALIZAR
router.put('/voluntarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, sobrenome, email, senha, telefone, nascimento, biografia } = req.body;
    
    let query;
    let values;

    if (senha) {
        const hashSenha = await bcrypt.hash(senha, 10);
        query = `UPDATE voluntarios 
                 SET nome = $1, sobrenome = $2, email = $3, senha = $4, telefone = $5, nascimento = $6, biografia = $7 
                 WHERE id = $8 
                 RETURNING id, nome, sobrenome, email`;
        values = [nome, sobrenome, email, hashSenha, telefone, nascimento, biografia, id];
    } else {
        query = `UPDATE voluntarios 
                 SET nome = $1, sobrenome = $2, email = $3, telefone = $4, nascimento = $5, biografia = $6 
                 WHERE id = $7 
                 RETURNING id, nome, sobrenome, email`;
        values = [nome, sobrenome, email, telefone, nascimento, biografia, id];
    }

    const resultado = await pool.query(query, values);

    if (resultado.rowCount === 0) {
        return res.status(404).json({ error: 'Voluntário não encontrado' });
    }  
    res.json(resultado.rows[0]);      
});

// 5. EXCLUIR
router.delete('/voluntarios/:id', async (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM voluntarios WHERE id = $1 RETURNING id';
    const resultado = await pool.query(query, [id]);

    if (resultado.rowCount === 0) {
        return res.status(404).json({ error: 'Voluntário não encontrado' });
    }
    res.json({ message: 'Voluntário excluído com sucesso' });
});

module.exports = router;