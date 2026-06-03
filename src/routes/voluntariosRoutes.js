const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../config/db');

// 1. CRIAR VOLUNTÁRIO
router.post('/voluntarios', async (req, res, next) => {
    try {
        const { nome, sobrenome, email, senha, telefone, nascimento, biografia } = req.body;
        const hashSenha = await bcrypt.hash(senha, 10);

        const query = `INSERT INTO voluntarios (nome, sobrenome, email, senha, telefone, nascimento, biografia) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, nome, email`;
        const values = [nome, sobrenome, email, hashSenha, telefone, nascimento, biografia];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err); // Centralizado no app.js (ex: erro 23505)
    }
});

// 2. LISTAR TODOS
router.get('/voluntarios', async (req, res, next) => {
    try {
        const query = `SELECT id, nome, sobrenome, email, telefone, nascimento, biografia FROM voluntarios`;
        const resultado = await pool.query(query);
        res.json(resultado.rows);
    } catch (err) {
        next(err);
    }
});

// 3. BUSCAR POR ID
router.get('/voluntarios/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = 'SELECT id, nome, sobrenome, email, telefone, nascimento, biografia FROM voluntarios WHERE id = $1';
        const resultado = await pool.query(query, [id]);

        // Em vez de res.status(404).json, delegamos para o middleware global
        if (resultado.rows.length === 0) {
            const erro = new Error('Voluntário não encontrado.');
            erro.status = 404;
            throw erro;
        }
        res.json(resultado.rows[0]);
    } catch (err) {
        next(err);
    }
});

// 4. ATUALIZAR
router.put('/voluntarios/:id', async (req, res, next) => {
    try {
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
            const erro = new Error('Voluntário não encontrado para atualização.');
            erro.status = 404;
            throw erro;
        }  
        res.json(resultado.rows[0]);      
    } catch (err) {
        next(err);
    }
});

// 5. EXCLUIR
router.delete('/voluntarios/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM voluntarios WHERE id = $1 RETURNING id';
        const resultado = await pool.query(query, [id]);

        if (resultado.rowCount === 0) {
            const erro = new Error('Voluntário não encontrado para exclusão.');
            erro.status = 404;
            throw erro;
        }
        res.json({ message: 'Voluntário excluído com sucesso' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;