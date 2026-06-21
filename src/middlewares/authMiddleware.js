const jwt = require('jsonwebtoken');

const authenticarToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        const erro = new Error('Token de autenticação não fornecido.');
        erro.status = 401;
        return next(erro);
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

        req.usuario = decoded;
        next();
    } catch (err) {
        const erro = new Error('Token de autenticação inválido ou expirado.');
        erro.status = 401;
        next(erro);
    }
}

module.exports = { authenticarToken };