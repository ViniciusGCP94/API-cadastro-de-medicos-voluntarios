require ('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool ({
    connectionString: process.env.DATABASE_URL,
})

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erro ao conectar no banco de dados:', err.message);
  } else {
    console.log('🚀 Conexão com o PostgreSQL estabelecida com sucesso!');
    console.log('Hora atual no banco:', res.rows[0].now);
  }
});

module.exports = pool