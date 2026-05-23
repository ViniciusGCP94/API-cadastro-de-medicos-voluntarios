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

router.get('/voluntarios', async (req, res) => {
    try{
    const query = `SELECT id, nome, sobrenome, email, telefone, nascimento, biografia FROM voluntarios`;
    const resultado = await pool.query(query);
    res.json(resultado.rows);
    } catch (error) {
        console.error('Erro ao buscar voluntário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})

router.get('/voluntarios/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'SELECT id, nome, sobrenome, email, telefone, nascimento, biografia FROM voluntarios WHERE id = $1';
        const values = [id];
        const resultado = await pool.query(query, values);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Voluntário não encontrado' });
        }
        res.json(resultado.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar voluntário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.put('/voluntarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, sobrenome, email, senha, telefone, nascimento, biografia } = req.body;
    try{
        let query;
        let values;
        if (senha ) {
            // Cenário A: Com Senha. Criptografamos e incluindo a senha na query.
            const hashSenha = await bcrypt.hash(senha, 10);
            query = `UPDATE voluntarios 
            SET nome = $1, sobrenome = $2, email = $3, senha = $4, telefone = $5, nascimento = $6, biografia = $7 
            WHERE id = $8 
            RETURNING id, nome, sobrenome, email`;
            values = [nome, sobrenome, email, hashSenha, telefone, nascimento, biografia, id];
        } else {
            // Cenário B: Sem Senha. A query ignora o campo senha completamente.
            query = `UPDATE voluntarios 
            SET nome = $1, sobrenome = $2, email = $3, telefone = $4, nascimento = $5, biografia = $6 
            WHERE id = $7 
            RETURNING id, nome, sobrenome, email`;
            values = [nome, sobrenome, email, telefone, nascimento, biografia, id];
        }
        const resultado = await pool.query(query, values);
        // Se o número de linhas afetadas for igual a 0...
        if (resultado.rowCount === 0) {
            // Significa que o ID não existia! Paramos a rota e devolvemos 404.
            return res.status(404).json({ error: 'Voluntário não encontrado' });
        }  
        res.json(resultado.rows[0]);      
    } catch (error) {
        console.error('Erro ao atualizar voluntário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
        
    }
});

router.delete('/voluntarios/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM voluntarios WHERE id = $1 RETURNING id';
        const values = [id];
        const resultado = await pool.query(query, values);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Voluntário não encontrado' });
        }
        res.json({ message: 'Voluntário excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir voluntário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;