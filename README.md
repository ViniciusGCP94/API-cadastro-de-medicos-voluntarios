# 🚀 Plataforma Connect — API

API REST desenvolvida em **Node.js** com **Express 5**, responsável pelo backend da Plataforma Connect: uma plataforma social que conecta voluntários a ações/campanhas, permitindo cadastro, autenticação e inscrição em ações.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** — Ambiente de execução JavaScript
- **Express 5** — Framework para construção da API (captura nativa de rejeições de Promise, dispensando `try/catch` manual nas rotas)
- **PostgreSQL** — Banco de dados relacional
- **pg (Pool)** — Driver de conexão com o PostgreSQL, via `DATABASE_URL`
- **Bcrypt** — Criptografia (hash) de senhas
- **jsonwebtoken (JWT)** — Autenticação baseada em token
- **express-validator** — Validação e sanitização de dados de entrada
- **dotenv** — Gerenciamento de variáveis de ambiente
- **Postman / Insomnia** — Ferramentas utilizadas para testes de endpoints

---

## 🏗️ Arquitetura

O projeto segue o padrão **MVC**, com responsabilidades bem separadas em camadas:

```
├── server.js                       # Ponto de entrada — sobe o servidor na porta definida
├── src/
│   ├── app.js                      # Configuração do Express, rotas e middleware de erro global
│   ├── routes/                     # Mapeamento de endpoints (rota → validator → auth → controller)
│   │   ├── voluntariosRoutes.js
│   │   ├── acoesRoutes.js
│   │   └── inscricoesRoutes.js
│   ├── controllers/                # Lógica de negócio e acesso ao banco de dados
│   │   ├── voluntariosController.js
│   │   ├── acoesController.js
│   │   └── inscricoesController.js
│   ├── middlewares/
│   │   ├── authenticate.js         # Validação do token JWT no header
│   │   └── validators/             # Regras de validação isoladas (express-validator)
│   │       ├── voluntarioValidator.js
│   │       ├── acoesValidator.js
│   │       └── inscricoesValidator.js
│   └── config/
│       └── db.js                   # Pool de conexão com o PostgreSQL
├── .env                             # DATABASE_URL e segredo do JWT (fora do versionamento)
└── .gitignore
```

**Por que essa organização:**
- **Routes** ficam limpas, servindo apenas como mapa de endpoints (ex.: `router.post('/acoes', authenticate, validarCriacaoAcao, controller.criarAcao)`).
- **Controllers** concentram toda a lógica de negócio e as queries ao banco.
- **Validators** isolam as regras de validação por entidade e por método (regras de criação podem ser mais permissivas que as de atualização).
- **Erros como objetos operacionais:** em vez de responder `res.status(404)` diretamente na rota/controller, o código lança (`throw`) um erro nativo com `erro.status = 404`, que é interceptado pelo middleware global — mantendo o formato de resposta consistente em toda a API.

---

## 💾 Armazenamento

Os dados são persistidos em um banco de dados **PostgreSQL**, acessado através de um pool de conexões (`pg.Pool`) configurado a partir de uma única `DATABASE_URL` no `.env` (padrão usado por Railway, Render, Heroku, AWS RDS).

---

## 🔐 Autenticação

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/login` | Valida email e senha, retorna um token JWT |

- O middleware `authenticate.js` valida o token JWT enviado no header `Authorization` e protege as rotas de criação, edição e exclusão.
- O `id` do usuário autenticado (`req.usuario.id`) é extraído do token — nunca recebido diretamente do corpo da requisição, evitando falhas de autorização em nível de objeto (IDOR).
- **Verificação de posse:** um voluntário só pode editar ou excluir os **seus próprios** dados; a verificação compara o `id` do token com o `id` do recurso antes de executar a operação.

---

## ⚠️ Tratamento de Erros

Middleware de erro global no final do `app.js`, centraliza todas as respostas de falha:

| Origem | Situação | Resposta HTTP |
|---|---|---|
| PostgreSQL `23505` | Violação de unicidade (e-mail duplicado, inscrição duplicada) | `409 Conflict` |
| PostgreSQL `23503` | Violação de chave estrangeira (`id_autor`, `id_voluntario` ou `id_acao` inexistente) | `404 Not Found` |
| Erro operacional customizado (`erro.status`) | Recurso não encontrado por ID | `404 Not Found` |
| `express-validator` | Falha de validação de payload | `400 Bad Request` (corpo com array detalhando os campos e motivos da falha) |
| Não mapeado | Erro de programação / falha inesperada | `500 Internal Server Error` (stack trace logado no servidor, nunca exposto ao cliente) |

---

## 🚀 Como Executar o Projeto

**1. Instale as dependências:**

```bash
npm install
```

**2. Configure o `.env`** com a `DATABASE_URL` do PostgreSQL e o segredo usado para assinar o JWT.

**3. Inicie o servidor:**

```bash
node server.js
```

O servidor estará disponível em `http://localhost:3000`

---

## 🛣️ Endpoints

### Voluntários

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/voluntarios` | Cadastra um novo voluntário (senha com hash via Bcrypt) |
| `GET` | `/voluntarios` | Lista todos os voluntários (campo `senha` nunca é retornado) |
| `GET` | `/voluntarios/:id` | Retorna um voluntário pelo ID |
| `PUT` | `/voluntarios/:id` | 🔒 Atualiza os dados do voluntário (somente o próprio dono); re-hasheia a senha apenas se ela for enviada |
| `DELETE` | `/voluntarios/:id` | 🔒 Remove o voluntário (somente o próprio dono) |
| `GET` | `/voluntarios/:id/inscricoes` | Lista as ações em que o voluntário está inscrito |

**Campos:** `nome`, `sobrenome`, `email`, `senha` (hash), `telefone`, `nascimento`, `biografia`

---

### Ações

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/acoes` | 🔒 Cria uma nova ação, vinculada ao voluntário autenticado como autor |
| `GET` | `/acoes` | Lista todas as ações |
| `GET` | `/acoes/:id` | Retorna uma ação pelo ID |
| `PUT` | `/acoes/:id` | 🔒 Atualiza os dados de uma ação |
| `DELETE` | `/acoes/:id` | 🔒 Remove uma ação |

**Campos:** `titulo`, `descricao`, `url_imagem`, `tipo`, `id_autor`, `data_criacao`

> `id_autor` é obtido do token JWT (`req.usuario.id`), nunca enviado diretamente pelo cliente.

---

### Inscrições

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/inscricoes` | 🔒 Inscreve o voluntário autenticado em uma ação |
| `GET` | `/voluntarios/:id/inscricoes` | Lista as inscrições de um voluntário |
| `DELETE` | `/inscricoes/:id` | 🔒 Cancela uma inscrição |

> `id_voluntario` é obtido do token JWT do usuário autenticado, seguindo a mesma correção de segurança aplicada às ações. Inscrição duplicada (mesmo voluntário na mesma ação) retorna `409`.

🔒 = requer token JWT válido no header `Authorization`.

---

## 📌 Status do Projeto

- ✅ CRUD completo de Voluntários, Ações e Inscrições
- ✅ Arquitetura MVC (routes / controllers / validators)
- ✅ Tratamento de erros global e erros operacionais customizados
- ✅ Validação de payloads com `express-validator`
- ✅ Autenticação JWT e verificação de posse (ownership check)
- ⏳ Testes automatizados (Jest + Supertest) — pendente
- ⏳ Deploy em produção (Railway/Render) — pendente

---

## 👨‍💻 Desenvolvido por

**Vinícius Pereira**