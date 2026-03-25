# Rinha de Ingressos

API para reserva de ingressos de eventos, desenvolvida em Node.js com Express e PostgreSQL (Neon), otimizada para alta concorrência.

## Descrição

Este projeto implementa uma API REST para gerenciamento de eventos e reservas de ingressos. A aplicação garante que não haja overbooking através de operações atômicas no banco de dados, utilizando UPDATE com condições para controle de concorrência.

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **Neon** - PostgreSQL como serviço
- **pg** - Cliente PostgreSQL para Node.js
- **dotenv** - Gerenciamento de variáveis de ambiente

## Pré-requisitos

- Node.js 18+
- PostgreSQL (ou Neon)
- npm ou yarn

## Como Rodar Localmente

1. Clone o repositório:

   ```bash
   git clone <url-do-repositorio>
   cd rinha-ingressos
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:

   ```env
   DATABASE_URL=postgresql://usuario:senha@host:porta/database?sslmode=require
   PORT=8080
   ```

4. Execute a aplicação:
   ```bash
   npm start
   ```

A aplicação estará rodando em `http://localhost:8080`.

## Como Rodar com Docker

1. Construa a imagem:

   ```bash
   docker build -t rinha-ingressos .
   ```

2. Execute o container:
   ```bash
   docker run -p 8080:8080 --env-file .env rinha-ingressos
   ```

## Estratégia de Concorrência

Para evitar overbooking em cenários de alta concorrência, utilizamos operações atômicas no PostgreSQL:

- **UPDATE atômico**: O UPDATE decrementa `ingressos_disponiveis` apenas se houver ingressos disponíveis (`ingressos_disponiveis > 0`)
- **Transação**: UPDATE e INSERT são executados em uma transação para garantir consistência
- **Pool de conexões otimizado**: Configurado com `max: 20` conexões para suportar alta carga

Esta abordagem garante que apenas uma reserva seja feita por ingresso disponível, mesmo sob alta concorrência.

## Endpoints da API

### Eventos

- `GET /eventos` - Lista todos os eventos
  - Resposta: `[{ id, nome, ingressos_disponiveis }]`

### Reservas

- `POST /reservas` - Faz uma reserva de ingresso
  - Corpo: `{ "evento_id": number, "usuario_id": number }`
  - Respostas:
    - 201: `{ "sucesso": true }`
    - 400: `{ "erro": "Dados inválidos" }`
    - 422: `{ "erro": "Ingressos esgotados" }`
    - 500: `{ "erro": "Erro interno" }`

## Configuração (.env)

```env
DATABASE_URL=postgresql://neondb_owner:senha@host/neondb?sslmode=require&channel_binding=require
PORT=8080
```

- `DATABASE_URL`: String de conexão do PostgreSQL (Neon)
- `PORT`: Porta do servidor (padrão 8080)

## Como Testar

### Com curl

Listar eventos:

```bash
curl http://localhost:8080/eventos
```

Fazer reserva:

```bash
curl -X POST http://localhost:8080/reservas \
  -H "Content-Type: application/json" \
  -d '{"evento_id": 1, "usuario_id": 123}'
```

### Com k6 (Teste de Carga)

Crie um script `test.js`:

```javascript
import http from "k6/http";
import { check } from "k6";

export let options = {
  vus: 10,
  duration: "30s",
};

export default function () {
  let response = http.post(
    "http://localhost:8080/reservas",
    JSON.stringify({
      evento_id: 1,
      usuario_id: Math.floor(Math.random() * 1000),
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  check(response, {
    "status is 201 or 422": (r) => r.status === 201 || r.status === 422,
  });
}
```

Execute:

```bash
k6 run test.js
```

## Estrutura do Projeto

```
rinha-ingressos/
├── src/
│   ├── controllers/
│   │   └── reservasController.js
│   ├── routes/
│   │   ├── eventos.js
│   │   └── reservas.js
│   ├── db.js
│   ├── env.js
│   └── server.js
├── Dockerfile
├── .dockerignore
├── package.json
├── .env
└── README.md
```

## Otimizações para Performance

- Pool de conexões otimizado para alta concorrência
- Operações atômicas no banco para evitar race conditions
- Middleware mínimo no Express
- Headers keep-alive para reduzir latência
- Sem logs em produção para reduzir I/O

## Licença

Este projeto é parte do desafio Rinha de Dev.
