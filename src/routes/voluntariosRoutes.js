const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../config/db');

router.post('/voluntarios', async (req, res) => {
    const{nome, sobrenome, email, senha, telefone, nascimento, biografia} = req.body;

    try{
        const hashSenha = await bcrypt.hash(senha, 10);

        const query = `INSERT INTO voluntarios (nome, sobrenome, email, senha, telefone, nascimento, biografia) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, nome, email`;
        const values = [nome, sobrenome, email, hashSenha, telefone, nascimento, biografia];

        const result = await pool.query(query, values);
        const novoVoluntario = result.rows[0];
        res.status(201).json(novoVoluntario);
    } catch (error) {
        console.error('Erro ao criar voluntário:', error);
        if (error.code === '23505') { // Código de erro para violação de chave única
            res.status(400).json({ error: 'Este e-mail já está cadastrado' });
        } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
})