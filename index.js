const express = require('express');

const app = express();
app.use(express.json());

const profissionais = [];

app.get('/', (req, res) => {
    res.send('Servidor rodando com Express!');
});

app.get("/profissionais", (req, res) => {
  res.status(200).json(profissionais);
});

app.post('/profissionais', (req, res) => {
    const { nome, email, telefone, mensagem } = req.body;

    if (!nome || nome.length < 3) {
        return res.status(400).json({ error: 'Nome é obrigatório e deve ter pelo menos 3 caracteres.' });
    } 

    if (!email){
        return res.status(400).json({ error: 'Email é obrigatório.' });
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
    return res.status(400).json({ error: 'Email inválido.' });
    }

    const emailExistente = profissionais.find(profissional => profissional.email === email);
    if (emailExistente) {
        return res.status(400).json({ error:'Email já existe.'})
    }

    if (telefone && telefone.length !== 10 && telefone.length !== 11) {
        return res.status(400).json({ error: 'Telefone deve conter 10 ou 11 dígitos.' });
    }

    if (mensagem && mensagem.length > 500) {
        return res.status(400).json({ error: 'Mensagem deve conter no máximo 500 caracteres.' });
    }

    const novoProfissional = {
        id : profissionais.length + 1,
        nome,
        email,
        telefone,
        mensagem
    };

    profissionais.push(novoProfissional);
    res.status(201).json(novoProfissional)
})

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
})


