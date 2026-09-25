# Projeto Deno CRUD - (API simples baseada em sistemas E-Commerce - Somente algumas funcionalidades.)

API RESTful desenvolvida com TypeScript, Deno, Express e MongoDB.

## 🚀 Tecnologias e Pacotes

- **Deno** — Runtime moderno para TypeScript e JavaScript
- **express** — Framework web para gerenciamento de rotas e middlewares
- **mongoose** — ODM para modelagem e manipulação de dados no MongoDB
- **bcrypt** — Algoritmo de hashing seguro para criptografia de senhas
- **jsonwebtoken** — Autenticação e autorização via Tokens JWT
- **request-check** — Validação de schemas e payloads de requisição
- **responser** — Padronização de respostas HTTP (`send_created`,
  `send_badRequest`, etc.)
- **throwlhos** — Tratamento centralizado e disparo de erros customizados
- **morgan** — Logger HTTP para exibição de logs de requisições no console
- **@zarco/isness** — Utilitário para comparação e validação de tipos de dados
- **@std/assert** — Módulo padrão do Deno para asserções e suíte de testes
  (`assertEquals`, `assertExists`)

## 🛠️ Instalação e Execução

### Pré-requisitos

- **Deno** (v1.38+ ou v2.x) instalado na máquina.
- Instância do **MongoDB** rodando localmente ou conexão ativa com MongoDB
  Atlas.

### Configuração Passo a Passo

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/lucassalmeida03/deno_api.git
   ```

2. **Crie o arquivo .env na raiz**

```env
BASE_URL="http://localhost:"
MONGODB_URI=sua_connection_string_mongodb
PORT=3000 ou sua escolha
JWT_SECRET="sua_chave_secreta"
```

3. **Inicie a aplicação** deno task dev

### 🧪 Instruções para Rodar os Testes

A suíte de testes utiliza o test runner nativo do Deno em conjunto com a
biblioteca @std/assert.

_Rodar todos os testes:_ deno task test

### 📌 Documentação dos Endpoints

**🔒 Rotas Privadas: Exigem o envio do cabeçalho Authorization: Bearer
<seu_token_jwt>.**

_🔑 Autenticação & Sessões (/sessions)_

- `POST /sessions (Público)` Descrição: Autentica o usuário e gera o token JWT.

```json
Exemplo de Request:
JSON
{
  "email": "maria@email.com",
  "password": "senhaSegura123"
}
```

```json
Exemplo de Response (200 OK):
JSON
{
  "status": 200,
  "message": "Sessão criada com sucesso",
  "data": {
    "user": {
      "_id": "65f0123456789abcdef01234",
      "name": "Maria Silva",
      "email": "maria@email.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

_👤 Usuários (/users)_

- `POST /users (Público - Qualquer perfil)` - Descrição: Cadastro de novos
  usuários no sistema.

```json
Exemplo de Request:
JSON
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "senhaSegura123",
  "role": "customer"
}
```

```json
Exemplo de Response (201 Created):
JSON
{
  "message": "Usuário criado com sucesso!",
    "data": {
        "newUser": {
            "name": "Maria Silva",
            "email": "maria@email.com",
            "password": "$2b$08$WUZi7X3KbkcxHWQAHjKJ3eFX8BTV14qMTCuPTewoI/8zRIWEE5Bhq",
            "role": "customer",
            "_id": "6aad7e8e7286e595275c2c5e",
            "createdAt": "2026-09-18T18:10:22.199Z",
            "updatedAt": "2026-09-18T18:10:22.217Z",
          }
       }
 }
```

- `GET /users (Privado - Apenas admin)` - Descrição: Lista todos os usuários
  cadastrados na base.

- `PUT /users/:id (Privado - Usuário Autenticado)` - Descrição: Atualiza as
  informações do próprio perfil do usuário.

- `DELETE /users/:id (Privado - Usuário Autenticado)` - Descrição: Remove a
  conta do usuário.

_📦 Produtos (/products)_

- `GET /products (Privado - Permissões: customer, admin)` - Descrição: Lista a
  vitrine geral de produtos disponíveis.

- `GET /products/my-products (Privado - Permissão: seller)` - Descrição: Lista
  apenas os produtos cadastrados pelo vendedor logado.

- `GET /products/:id (Privado - Qualquer Usuário Autenticado)` - Descrição:
  Retorna os detalhes de um produto específico através do ID.

- `POST /products (Privado - Permissões: seller, admin)` - Descrição: Cadastra
  um novo produto na loja.

```json
Exemplo de Request:
JSON
{
 "title": "Teclado Mecânico RGB",
 "price": 299.90,
 "stock": 10
}
```

```json
Exemplo de Response(201 Created):
JSON
"message": "Produto cadastrado com sucesso!",
   "data": {
           "title": "Teclado Mecânico RGB",
           "price": 299.9,
           "stock": 10,
           "user": "6aad7e8e7286e595275c2c5e",
           "_id": "6aad84927286e595275c2c61",
           "createdAt": "2026-09-18T18:36:02.926Z",
           "updatedAt": "2026-09-18T18:36:02.926Z",
   }
```

- `PUT /products/:id (Privado - Permissões: seller, admin)` - Descrição:
  Atualiza as informações de um produto existente.

- `DELETE /products/:id (Privado - Permissões: seller, admin)` - Descrição:
  Remove um produto do catálogo.

_🛍️ Pedidos (/orders)_

- `POST /orders (Privado - Permissões: customer, admin)` - Descrição: Realiza a
  compra de um produto.

```json
Exemplo de Request:
JSON
{
 "productId": "66f4b8f2c3a21a0012345678",
 "quantity": 10
}
```

```json
Exemplo de Response (201 Created):
JSON
{
 "message": "Pedido realizado com sucesso!",
 "data": {
  "data": {
           "customer": {
               "_id": "6aad7e8e7286e595275c2c5e",
               "name": "Maria Silva Santos",
               "email": "maria@email.com"
           },
           "product": {
               "_id": "6aaad5b57faa4b9642545016",
               "title": "Manga",
               "price": 10.2
           },
           "seller": "6aad82567286e595275c2c60",
           "totalAmount": 102,
           "quantity": 10,
           "status": "pending",
           "_id": "6aad82567286e595275c2c60",
           "createdAt": "2026-09-18T18:26:30.517Z",
           "updatedAt": "2026-09-18T18:26:30.517Z",
 }
}
}
```

- `GET /orders/my-orders (Privado - Permissões: customer, admin)` - Descrição:
  Lista o histórico de compras do cliente logado.

- `GET /orders/my-sales (Privado - Permissões: seller, admin)` - Descrição:
  Lista os pedidos de vendas recebidos pelo vendedor logado.

- `PATCH /orders/:id/cancel (Privado - Permissões: customer, admin)` -
  Descrição: Cancela o pedido indicado no parâmetro ID.

- `PATCH /orders/:id/pay (Privado - Permissões: seller, admin)` - Descrição:
  Altera o status do pedido para pago.

- `DELETE /orders/:id/delete (Privado - Permissões: customer, admin)` -
  Descrição: Remove o registro de um pedido da base de dados.
