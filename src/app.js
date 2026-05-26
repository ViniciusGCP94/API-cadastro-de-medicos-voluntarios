const express = require('express');
const app = express();
app.use(express.json());

const voluntariosRoutes = require('./routes/voluntariosRoutes.js');
const acoesRoutes = require('./routes/acoesRoutes.js'); // 1. IMPORTA AS ROTAS DE AÇÕES

app.use(voluntariosRoutes);
app.use(acoesRoutes); // 2. REGISTRA AS ROTAS DE AÇÕES

// Rota de teste assíncrona com banco de dados
app.get('/teste-banco', async (req, res) => {
  const db = require('./config/db');
  const resultado = await db.query('SELECT * FROM voluntarios'); 
  res.json(resultado.rows);
});

// O Middleware de Erro Global fica SEMPRE no final do app.js, abaixo de todas as rotas
app.use((err, req, res, next) => {
    console.error('=== LOG DE ERRO CENTRALIZADO ===');
    console.error(err.message || err);
    console.error('================================');

    // 1. Tratamento para erro de Unique Violation (ex: e-mail duplicado)
    if (err.code === '23505') { 
        return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }

    // 2. NOVO: Tratamento para erro de Foreign Key Violation (Chave Estrangeira Inexistente)
    if (err.code === '23503') {
        return res.status(404).json({ 
            error: 'O autor (id_autor) informado não foi encontrado no sistema.' 
        });
    }

    // Fallback para qualquer outro erro não mapeado
    res.status(500).json({ error: 'Erro interno do servidor.' });
});

module.exports = app;