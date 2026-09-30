# API Solid — GymPass style

API REST de check-in em academias, no estilo GymPass, construída com Node.js e TypeScript seguindo princípios SOLID.

![Unit Tests](https://github.com/nathaliagiul/api-solid/actions/workflows/run-unit-tests.yml/badge.svg)
![E2E Tests](https://github.com/nathaliagiul/api-solid/actions/workflows/run-e2e-tests.yml/badge.svg)

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime e linguagem | Node.js 22, TypeScript |
| HTTP | Fastify, `@fastify/jwt`, `@fastify/cookie` |
| Validação | Zod |
| Banco de dados | PostgreSQL (Docker), Prisma ORM |
| Testes | Vitest (unitários e E2E), Supertest |
| CI | GitHub Actions |

## Arquitetura

```
src/
├── http/
│   ├── controllers/     # rotas e handlers por domínio (users, gyms, check-ins) + testes E2E
│   └── middlewares/     # verify-jwt, verify-user-role
├── use-cases/           # regras de negócio + testes unitários
│   ├── errors/
│   └── factories/       # montagem dos use-cases com suas dependências
├── repositories/
│   ├── prisma/          # implementação com banco real
│   └── in-memory/       # implementação para testes unitários
├── env/                 # validação das variáveis de ambiente com Zod
└── lib/prisma.ts
```

Os use-cases dependem de interfaces de repositório, não do Prisma. Nos testes unitários recebem a implementação
em memória; em execução, a implementação Prisma, montada pelas factories. Nos testes E2E, cada arquivo roda em um
schema isolado do PostgreSQL, criado e removido pelo ambiente `prisma/vitest-environment-prisma`.

## Como executar

Pré-requisitos: Node.js 22 e Docker.

```bash
npm install
cp .env.example .env
docker compose up -d
npx prisma migrate deploy
npm run start:dev
```

A API sobe em `http://localhost:3333`.

## Testes

| Comando | Descrição |
|---|---|
| `npm test` | Testes unitários dos use-cases |
| `npm run test:e2e` | Testes E2E das rotas HTTP (requer o PostgreSQL rodando) |
| `npm run test:coverage` | Cobertura de testes |

## Rotas

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/users` | — | Cadastro de usuário |
| POST | `/sessions` | — | Autenticação; retorna JWT e grava refresh token em cookie |
| PATCH | `/token/refresh` | Cookie | Renova o JWT |
| GET | `/me` | JWT | Perfil do usuário logado |
| GET | `/gyms/search` | JWT | Busca de academias por nome |
| GET | `/gyms/nearby` | JWT | Academias em até 10 km |
| POST | `/gyms` | JWT (ADMIN) | Cadastro de academia |
| POST | `/gyms/:gymId/check-ins` | JWT | Check-in em academia |
| GET | `/check-ins/history` | JWT | Histórico de check-ins |
| GET | `/check-ins/metrics` | JWT | Total de check-ins do usuário |
| PATCH | `/check-ins/:checkInId/validate` | JWT (ADMIN) | Validação de check-in |

## Requisitos

### Requisitos funcionais

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [x] Deve ser possível o usuário obter o seu histórico de check-ins;
- [x] Deve ser possível o usuário buscar academias próximas (10 km);
- [x] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia.

### Regras de negócio

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100 m) da academia;
- [x] O check-in só pode ser validado até 20 minutos após ser criado;
- [x] O check-in só pode ser validado por administradores;
- [x] A academia só pode ser cadastrada por administradores.

### Requisitos não funcionais

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token).

---

Projeto desenvolvido na pós-graduação em Desenvolvimento Full Stack da Rocketseat (descontinuada).
