# Deno Commerce API

API REST para um sistema simples de e-commerce, desenvolvida com Deno, TypeScript, Express, Mongoose e MongoDB.

## Requisitos

- Deno 2.x instalado.
- MongoDB acessível pela aplicação. Os testes também usam a conexão definida em `MONGODB_URI`.
- Para criação de pedidos, MongoDB deve aceitar transações (por exemplo, MongoDB Atlas ou replica set local).

## Configuração

Na pasta `deno_api`, crie um arquivo `.env`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>/<banco>
JWT_SECRET=uma_chave_secreta_longa
```

Não versione `.env` nem compartilhe credenciais. O comando de desenvolvimento já permite ao Deno carregar variáveis do arquivo.

## Executar

A partir da pasta `deno_api`:

```bash
deno task dev
```

A API estará disponível em `http://localhost:3000` (ou na porta definida em `PORT`). O servidor conecta ao MongoDB antes de começar a escutar.

## Testes

Execute todos os testes a partir da pasta `deno_api`:

```bash
deno task test
```

A task roda `deno test` com as permissões necessárias, executa os testes em `tests/` e produz relatórios de cobertura em `coverage/`.

**Atenção:** a suíte conecta ao banco apontado por `MONGODB_URI`, cria e remove registros de teste e desconecta ao terminar. Configure uma base de dados exclusiva para testes; não use uma base com dados importantes.

Para exibir detalhes da cobertura depois dos testes:

```bash
deno task test-coverage-detailed
```

## Autenticação e respostas

As rotas de cadastro (`POST /users`) e login (`POST /sessions`) são públicas. As demais rotas exigem um JWT no cabeçalho:

```http
Authorization: Bearer <token>
```

Papéis usados pela aplicação: `customer`, `seller` e `admin`. Uma rota pode exigir papel e também aplicar regras de propriedade do recurso, como permitir que apenas o dono de um produto o altere.

Respostas de sucesso seguem o envelope do `responser`, normalmente com `success`, `message`, `data`, `code` e `status`. O conteúdo de `data` varia por endpoint. Em algumas rotas, o controller também passa um objeto com uma propriedade `data`, produzindo `data.data`; os exemplos abaixo registram o formato atual, inclusive esse aninhamento.

Exemplos usam `http://localhost:3000`. Substitua IDs e o token pelos valores retornados pela sua instalação.

## Rotas

### Sessões

#### `POST /sessions` — login (pública)

Request:

```http
POST /sessions
Content-Type: application/json
```

```json
{
  "email": "maria@example.com",
  "password": "senhaSegura123"
}
```

Response `200 OK`:

```json
{
  "success": true,
  "message": "Sessão criada com sucesso!",
  "data": {
    "token": "<jwt>",
    "user": {
      "_id": "66f4b8f2c3a21a0012345678",
      "name": "Maria Silva",
      "email": "maria@example.com",
      "role": "customer"
    }
  },
  "code": 200,
  "status": "OK"
}
```

A senha não é incluída na resposta de login.

### Usuários

#### `POST /users` — cadastro (pública)

`role` é opcional e o controller usa `customer` quando omitido. O endpoint atualmente aceita `role` informado no corpo; por segurança, não permita que clientes escolham `seller` ou `admin` em uma aplicação pública sem uma regra de autorização no servidor.

Request:

```http
POST /users
Content-Type: application/json
```

```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "password": "senhaSegura123"
}
```

Response `201 Created` (exemplo abreviado):

```json
{
  "success": true,
  "message": "Usuário criado com sucesso!",
  "data": {
    "newUser": {
      "_id": "66f4b8f2c3a21a0012345678",
      "name": "Maria Silva",
      "email": "maria@example.com",
      "password": "<hash bcrypt>",
      "role": "customer",
      "createdAt": "2026-09-25T12:00:00.000Z",
      "updatedAt": "2026-09-25T12:00:00.000Z"
    }
  },
  "code": 201,
  "status": "CREATED"
}
```

**Atenção:** o controller atual inclui o hash da senha no objeto retornado pelo cadastro. Embora não seja a senha original, esse hash não deve ser exposto; o backend deve removê-lo antes de responder.

#### `GET /users` — listar usuários (admin)

Request:

```http
GET /users
Authorization: Bearer <token-admin>
```

Response `200 OK` (exemplo abreviado):

```json
{
  "success": true,
  "message": "Usuarios encontrados:",
  "data": {
    "users": [
      {
        "_id": "66f4b8f2c3a21a0012345678",
        "name": "Maria Silva",
        "email": "maria@example.com",
        "role": "customer"
      }
    ]
  },
  "code": 200,
  "status": "OK"
}
```

#### `DELETE /users/:id` — excluir usuário (usuário autenticado; dono ou admin)

Request:

```http
DELETE /users/66f4b8f2c3a21a0012345678
Authorization: Bearer <token>
```

Response `200 OK`:

```json
{
  "success": true,
  "message": "Usuário do id: 66f4b8f2c3a21a0012345678 foi deletado com sucesso.",
  "code": 200,
  "status": "OK"
}
```

### Produtos

#### `POST /products` — criar produto (seller ou admin)

O `user` do produto é definido pelo usuário autenticado. Não envie esse campo no body.

Request:

```http
POST /products
Authorization: Bearer <token-seller>
Content-Type: application/json
```

```json
{
  "title": "Teclado Mecânico RGB",
  "description": "Teclado mecânico com iluminação RGB.",
  "price": 299.9,
  "stock": 10
}
```

Response `201 Created` (formato atual, abreviado):

```json
{
  "success": true,
  "message": "Produto cadastrado com sucesso!",
  "data": {
    "data": {
      "_id": "66f4b8f2c3a21a0012345679",
      "title": "Teclado Mecânico RGB",
      "description": "Teclado mecânico com iluminação RGB.",
      "price": 299.9,
      "stock": 10,
      "user": "66f4b8f2c3a21a0012345678",
      "createdAt": "2026-09-25T12:00:00.000Z",
      "updatedAt": "2026-09-25T12:00:00.000Z"
    }
  },
  "code": 201,
  "status": "CREATED"
}
```

O objeto `data.data` é aninhado porque o controller passa `{ data: newProduct }` para o `responser`.

#### `GET /products` — catálogo (customer ou admin)

Request:

```http
GET /products
Authorization: Bearer <token-customer-ou-admin>
```

Response `200 OK` (exemplo abreviado):

```json
{
  "success": true,
  "message": "Lista de produtos completa:",
  "data": {
    "products": [
      {
        "_id": "66f4b8f2c3a21a0012345679",
        "title": "Teclado Mecânico RGB",
        "description": "Teclado mecânico com iluminação RGB.",
        "price": 299.9,
        "stock": 10,
        "user": {
          "_id": "66f4b8f2c3a21a0012345678",
          "name": "João Vendedor",
          "email": "joao@example.com",
          "role": "seller"
        }
      }
    ]
  },
  "code": 200,
  "status": "OK"
}
```

#### `GET /products/my-products` — produtos do vendedor (seller ou admin)

A consulta filtra produtos pelo ID do usuário autenticado.

Request:

```http
GET /products/my-products
Authorization: Bearer <token-seller>
```

Response `200 OK` (formato igual ao catálogo; lista abreviada):

```json
{
  "success": true,
  "message": "Busca completa!",
  "data": {
    "products": [
      {
        "_id": "66f4b8f2c3a21a0012345679",
        "title": "Teclado Mecânico RGB",
        "price": 299.9,
        "stock": 10,
        "user": {
          "_id": "66f4b8f2c3a21a0012345678",
          "name": "João Vendedor",
          "email": "joao@example.com"
        }
      }
    ]
  },
  "code": 200,
  "status": "OK"
}
```

#### `PUT /products/:id` — atualizar produto (seller ou admin; dono do produto ou admin)

Request:

```http
PUT /products/66f4b8f2c3a21a0012345679
Authorization: Bearer <token-seller>
Content-Type: application/json
```

O controller valida o body com os campos do produto. Exemplo:

```json
{
  "title": "Teclado Mecânico RGB V2",
  "description": "Versão atualizada.",
  "price": 329.9,
  "stock": 8
}
```

Response `200 OK` (abreviado):

```json
{
  "success": true,
  "message": "Produto atualizado com sucesso!",
  "data": {
    "updatedProduct": {
      "_id": "66f4b8f2c3a21a0012345679",
      "title": "Teclado Mecânico RGB V2",
      "description": "Versão atualizada.",
      "price": 329.9,
      "stock": 8
    }
  },
  "code": 200,
  "status": "OK"
}
```

#### `DELETE /products/:id` — excluir produto (seller ou admin; dono do produto ou admin)

Request:

```http
DELETE /products/66f4b8f2c3a21a0012345679
Authorization: Bearer <token-seller>
```

Response `200 OK`:

```json
{
  "success": true,
  "message": {
    "success": true,
    "message": "Produto removido com sucesso!"
  },
  "code": 200,
  "status": "OK"
}
```

O controller atualmente passa um objeto como primeiro argumento de `send_ok`; por isso o campo `message` pode conter um objeto. Esse formato é inconsistente com as outras respostas.

### Pedidos

#### `POST /orders` — criar pedido (customer ou admin)

O pedido é criado para o usuário autenticado. O estoque é validado e reduzido durante a operação. `quantity` é opcional e assume `1`.

Request:

```http
POST /orders
Authorization: Bearer <token-customer>
Content-Type: application/json
```

```json
{
  "productId": "66f4b8f2c3a21a0012345679",
  "quantity": 2
}
```

Response `201 Created` (formato atual, abreviado):

```json
{
  "success": true,
  "message": "Produto adquirido com sucesso!",
  "data": {
    "data": {
      "_id": "66f4b8f2c3a21a0012345680",
      "customer": {
        "_id": "66f4b8f2c3a21a0012345678",
        "name": "Maria Silva",
        "email": "maria@example.com"
      },
      "product": {
        "_id": "66f4b8f2c3a21a0012345679",
        "title": "Teclado Mecânico RGB",
        "price": 299.9
      },
      "seller": {
        "_id": "66f4b8f2c3a21a0012345681",
        "name": "João Vendedor",
        "email": "joao@example.com"
      },
      "totalAmount": 599.8,
      "quantity": 2,
      "status": "pending",
      "createdAt": "2026-09-25T12:00:00.000Z",
      "updatedAt": "2026-09-25T12:00:00.000Z"
    }
  },
  "code": 201,
  "status": "CREATED"
}
```

#### `GET /orders/my-orders` — compras do usuário (customer ou admin)

Request:

```http
GET /orders/my-orders
Authorization: Bearer <token-customer>
```

Response `200 OK` (formato atual):

```json
{
  "success": true,
  "message": "Operação concluída",
  "data": {
    "data": []
  },
  "code": 200,
  "status": "OK"
}
```

A lista é filtrada pelo ID do usuário autenticado.

#### `GET /orders/my-sales` — vendas do usuário (seller ou admin)

Request:

```http
GET /orders/my-sales
Authorization: Bearer <token-seller>
```

Response `200 OK` (exemplo abreviado):

```json
{
  "success": true,
  "message": "Operação concluída",
  "data": {
    "sales": [
      {
        "_id": "66f4b8f2c3a21a0012345680",
        "customer": {
          "_id": "66f4b8f2c3a21a0012345678",
          "name": "Maria Silva",
          "email": "maria@example.com"
        },
        "product": {
          "_id": "66f4b8f2c3a21a0012345679",
          "title": "Teclado Mecânico RGB",
          "price": 299.9
        },
        "quantity": 2,
        "totalAmount": 599.8,
        "status": "pending"
      }
    ]
  },
  "code": 200,
  "status": "OK"
}
```

#### `PATCH /orders/:id/cancel` — cancelar pedido (customer ou seller associado ao pedido)

A rota exige autenticação. O service permite cancelar apenas se o usuário autenticado for o cliente ou o vendedor associado àquele pedido. O estoque do produto é devolvido.

Request:

```http
PATCH /orders/66f4b8f2c3a21a0012345680/cancel
Authorization: Bearer <token>
```

Response `200 OK` (formato atual, abreviado):

```json
{
  "success": true,
  "message": "Pedido cancelado e estoque devolvido com sucesso!",
  "data": {
    "data": {
      "_id": "66f4b8f2c3a21a0012345680",
      "status": "canceled",
      "quantity": 2,
      "totalAmount": 599.8
    }
  },
  "code": 200,
  "status": "OK"
}
```

#### `PATCH /orders/:id/pay` — marcar pedido como pago (seller ou admin; vendedor dono da venda)

O service exige que o pedido não esteja cancelado ou pago e verifica que o usuário é o vendedor associado. Apesar de `admin` passar pelo middleware de papel, a verificação de propriedade também é aplicada no service.

Request:

```http
PATCH /orders/66f4b8f2c3a21a0012345680/pay
Authorization: Bearer <token-seller>
```

Response `200 OK` (formato atual, abreviado):

```json
{
  "success": true,
  "message": "Pagamento do pedido atualizado com sucesso!",
  "data": {
    "data": {
      "_id": "66f4b8f2c3a21a0012345680",
      "status": "paid",
      "quantity": 2,
      "totalAmount": 599.8
    }
  },
  "code": 200,
  "status": "OK"
}
```

#### `DELETE /orders/:id/delete` — excluir pedido cancelado (customer dono ou admin)

Somente pedidos com status `canceled` podem ser removidos.

Request:

```http
DELETE /orders/66f4b8f2c3a21a0012345680/delete
Authorization: Bearer <token-customer>
```

Response `200 OK`:

```json
{
  "success": true,
  "message": "Pedido cancelado foi removido com sucesso!",
  "code": 200,
  "status": "OK"
}
```

## Erros comuns

- `400 Bad Request`: validação falhou, registro não encontrado ou regra de negócio não satisfeita.
- `401 Unauthorized`: token ausente ou inválido.
- `403 Forbidden`: usuário autenticado sem o papel ou a propriedade exigida.
- `500 Internal Server Error`: erro inesperado no servidor.

O middleware global de autenticação protege os grupos `/products` e `/orders`. O middleware de autorização verifica os papéis definidos em cada rota; os services também aplicam regras de propriedade para alterações e exclusões.
