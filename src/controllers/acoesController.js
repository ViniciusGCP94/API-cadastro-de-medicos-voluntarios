const pool = require('../config/db');
const { validationResult } = require('express-validator');

const criarAcao = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const erroValidacao = new Error('Falha na validação dos dados.');
            erroValidacao.status = 400;
            erroValidacao.message = errors.array().map(err => err.msg);
            throw erroValidacao;
        }

        const { titulo, descricao, url_imagem, tipo } = req.body;
        const id_autor = req.usuario.id; 

        const query = `
            INSERT INTO acoes (titulo, descricao, url_imagem, tipo, id_autor) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, titulo, descricao, url_imagem, tipo, id_autor, data_criacao
        `;
        const values = [titulo, descricao, url_imagem, tipo, id_autor];

        const resultado = await pool.query(query, values);
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        next(err); // O middleware global trata erros de FK (id_autor inexistente - 23503)
    }
}

const listarAcoesCadastradas = async (req, res, next) => {
    try {
        const query = `SELECT id, titulo, descricao, url_imagem, tipo, id_autor, data_criacao FROM acoes`;
        const resultado = await pool.query(query);
        res.json(resultado.rows);
    } catch (err) {
        next(err);
    }
}

const buscarAcaoPorId =  async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = `SELECT id, titulo, descricao, url_imagem, tipo, id_autor, data_criacao FROM acoes WHERE id = $1`;
        const resultado = await pool.query(query, [id]);

        if (resultado.rows.length === 0) {
            const erro = new Error('Ação não encontrada.');
            erro.status = 404;
            throw erro; // Capturado pelo catch e enviado ao middleware global
        }

        res.json(resultado.rows[0]);
    } catch (err) {
        next(err);
    }
}

const atualizarDadosAcao = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const erroValidacao = new Error('Falha na validação dos dados.');
            erroValidacao.status = 400;
            erroValidacao.message = errors.array().map(err => err.msg);
            throw erroValidacao;
        }
        const { id } = req.params;
        const { titulo, descricao, url_imagem, tipo } = req.body;

        const buscarAcao = await pool.query('SELECT id_autor FROM acoes WHERE id = $1', [id]);
        if (buscarAcao.rowCount === 0) {
            const erro = new Error('Ação não encontrada para atualização.');
            erro.status = 404;
            throw erro;
        }

        if (buscarAcao.rows[0].id_autor.toString() !== req.usuario.id.toString()) {
            const erro = new Error('Acesso negado. Você não tem permissão para atualizar esta ação.');
            erro.status = 403;
            throw erro;
        }

        const query = `
            UPDATE acoes 
            SET titulo = $1, descricao = $2, url_imagem = $3, tipo = $4 WHERE id = $5
            RETURNING id, titulo, descricao, url_imagem, tipo, id_autor, data_criacao
        `;
        const values = [titulo, descricao, url_imagem, tipo, id];
        const resultado = await pool.query(query, values);

        res.json(resultado.rows[0]);
    } catch (err) {
        next(err);
    }
}

const excluirAcao = async (req, res, next) => {
    try {
        const { id } = req.params;
        const buscarAcao = await pool.query('SELECT id_autor FROM acoes WHERE id = $1', [id]);
        if (buscarAcao.rowCount === 0) {
            const erro = new Error('Ação não encontrada para exclusão.');
            erro.status = 404;
            throw erro;
        }

        const acao = buscarAcao.rows[0];

        if (acao.id_autor.toString() !== req.usuario.id.toString()) {
            const erro = new Error('Acesso negado. Você não tem permissão para excluir esta ação.');
            erro.status = 403;
            throw erro;
        }
        const query = 'DELETE FROM acoes WHERE id = $1 RETURNING id';
        const resultado = await pool.query(query, [id]);

        res.json({ message: 'Ação excluída com sucesso.' });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    criarAcao,
    listarAcoesCadastradas,
    buscarAcaoPorId,
    atualizarDadosAcao,
    excluirAcao
}