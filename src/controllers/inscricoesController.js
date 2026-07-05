const pool = require('../config/db');
const { validationResult } = require('express-validator');


const inscreverVoluntarioEmAcao = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const erroValidacao = new Error('Falha na validação dos dados.');
            erroValidacao.status = 400;
            erroValidacao.message = errors.array().map(err => err.msg);
            throw erroValidacao;
        }
        
        const id_voluntario  = req.usuario.id;
        const { id_acao } = req.body;

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
}

const listarAcoesDeVoluntario = async (req, res, next) => {
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
}

const cancelarInscricao = async (req, res, next) => {
    try {
        const { id } = req.params;

        const checarQuery = 'SELECT id_voluntario FROM inscricoes WHERE id = $1';
        const checarResultado = await pool.query(checarQuery, [id]);

        if (checarResultado.rowCount === 0) {
            const erro = new Error('Inscrição não encontrada para cancelamento.');
            erro.status = 404;
            throw erro;
        }

        if (checarResultado.rows[0].id_voluntario !== req.usuario.id) {
            const erro = new Error('Acesso negado. Você não tem permissão para cancelar esta inscrição.');
            erro.status = 403;
            throw erro;
        }

        const query = 'DELETE FROM inscricoes WHERE id = $1 RETURNING id';
        const resultado = await pool.query(query, [id]);

        res.json({ message: 'Inscrição cancelada com sucesso.' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    inscreverVoluntarioEmAcao,
    listarAcoesDeVoluntario,
    cancelarInscricao
}