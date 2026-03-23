# 🚀 API de Cadastro de Voluntários

Este projeto é uma API REST desenvolvida em **Node.js** com o framework **Express**. O objetivo é gerenciar o cadastro de profissionais voluntários, aplicando validações de dados e operando com armazenamento em memória.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** — Ambiente de execução JavaScript
- **Express** — Framework para construção de APIs
- **JavaScript (ES6+)** — Lógica de programação e manipulação de arrays
- **Postman** — Ferramenta utilizada para testes de endpoints

---

## 📋 Requisitos e Validações

A API possui regras de negócio para garantir a integridade dos dados cadastrados:

- **Nome** — Obrigatório, mínimo de 3 caracteres
- **Email** — Obrigatório, formato válido (Regex) e único no sistema
- **Telefone** — Opcional, mas se enviado deve conter 10 ou 11 dígitos
- **Mensagem** — Máximo de 500 caracteres

---

## 💾 Armazenamento

Os dados são armazenados em um **array em memória**.

> ⚠️ Por ser um armazenamento volátil, os dados são apagados sempre que o servidor é reiniciado.

---

## 🚀 Como Executar o Projeto

**1. Instale as dependências:**

```bash
npm install
```

**2. Inicie o servidor:**

```bash
node index.js
```

O servidor estará disponível em `http://localhost:3000`

---

## 🛣️ Endpoints

### GET /profissionais
Retorna a lista de todos os voluntários cadastrados na memória.

**Resposta de sucesso — 200 OK:**
```json
[
  {
    "id": 1,
    "nome": "Vinícius Pereira",
    "email": "vinnie@dev.com",
    "telefone": "11988887777",
    "mensagem": "Gostaria de contribuir com minha experiência em pediatria para o projeto social."
  }
]
```

---

### POST /profissionais
Cadastra um novo profissional voluntário.

**Corpo da requisição (JSON):**
```json
{
  "nome": "Vinícius Pereira",
  "email": "viniciusp@teste.com",
  "telefone": "11988887777",
  "mensagem": "Gostaria de contribuir com minha experiência em pediatria para o projeto social."
}
```

**Respostas:**

| Status | Descrição |
|--------|-----------|
| `201 Created` | Cadastro realizado com sucesso |
| `400 Bad Request` | Erro de validação nos campos |

---

## 👨‍💻 Desenvolvido por

**Vinícius Pereira**  
Curso Fullstack JavaScript — Vai Na Web