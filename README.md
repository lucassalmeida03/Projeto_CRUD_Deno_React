# Projeto CRUD Deno + React

## Requisitos

- Deno 2.x.
- Node.js 20.19 ou superior, ou 22.12 ou superior, com npm.
- MongoDB acessível pelo backend.

## Backend

Configure as variáveis de ambiente em `deno_api/.env`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>/<banco>
JWT_SECRET=uma_chave_secreta_longa
```

Para instalar/resolver as dependências e iniciar a API:

```bash
cd deno_api
deno task dev
```

A API estará disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

Para executar os testes do backend:

```bash
cd deno_api
deno task test
```

Os testes usam o banco definido em `MONGODB_URI`, criam e removem dados. Configure uma base exclusiva para testes.

## Frontend

Instale as dependências e inicie o servidor de desenvolvimento:

```bash
cd react_interface
npm install
npm run dev
```

Abra o endereço local informado pelo Vite, normalmente `http://localhost:5173`.

Para mais informações sobre as requests e responses do backend, consulte o [README da API](deno_api/README.md).
Documentação da API no Postman: https://documenter.getpostman.com/view/58158438/2sBYHNX3KN