const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
    try{
        const { email, senha } = req.body;
        const usuario = await pool.query('SELECT id, email, senha FROM voluntarios WHERE email = $1', [email]);
        if (usuario.rowCount === 0) {
            const erro = new Error('Credenciais inválidas. E-mail ou senha incorretos');
            erro.status = 401;
            throw erro;
        }

        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);
        if (!senhaValida) {
            const erro = new Error('Credenciais inválidas. E-mail ou senha incorretos');
            erro.status = 401;
            throw erro;
        }

        const token = jwt.sign({ id: usuario.rows[0].id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        return res.status(200).json({ mensagem: 'Login realizado com sucesso', token });
    } catch (err) {
        next(err);
    } 
}

module.exports = {
    login
}