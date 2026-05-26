const express = require('express');
const app = express();
app.use(express.json());

const voluntariosRoutes = require('./routes/voluntariosRoutes.js');
const acoesRoutes = require('./routes/acoesRoutes.js'); 
const inscricoesRoutes = require('./routes/inscricoesRoutes.js');

app.use(voluntariosRoutes);
app.use(acoesRoutes);
app.use(inscricoesRoutes);

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
        return res.status(409).json({ error: 'Conflito: Este registro já existe ou os dados já estão cadastrados.' });
    }

    // Opcional: Você pode dar console.log(err) para ver que o pg envia err.detail indicando qual chave falhou.    
    if (err.code === '23503') {
        return res.status(404).json({ 
            error: 'Operação inválida: Um dos IDs informados (vínculo) não existe no sistema.' 
        });
    }

    // Fallback para qualquer outro erro não mapeado
    res.status(500).json({ error: 'Erro interno do servidor.' });
});

module.exports = app;