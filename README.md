# 🙏 Centro Internacional de Avivamento Primavera (CIA)

Plataforma web completa para gerenciamento de conteúdo, eventos e integração com redes sociais da Igreja CIA Primavera.

**Localização**: [Ver no Google Maps](https://maps.app.goo.gl/o86G64g28DMgyByh9)  
**Telefone**: +55 31 9994-5139  
**Instagram**: [@ciaonline_primavera](https://www.instagram.com/ciaonline_primavera)  
**YouTube**: [@ciaprimaveraon3264](https://www.youtube.com/@ciaprimaveraon3264)

---

## 📁 Estrutura do Projeto

```
CIA-PRIMAVERA/
├── BackEnd/                 # Servidor Node.js + Express + tRPC
│   ├── server/             # Lógica do servidor
│   ├── drizzle/            # Migrações e schema do banco
│   ├── shared/             # Código compartilhado
│   ├── package.json
│   └── README.md           # Instruções do BackEnd
│
├── FrontEnd/               # Aplicação React + Vite
│   ├── client/             # Código React
│   ├── vite.config.ts
│   ├── components.json
│   └── README.md           # Instruções do FrontEnd
│
├── README.md               # Este arquivo
├── SETUP.md                # Guia de configuração completo
└── .git/                   # Repositório Git
```

---

## 🚀 Quick Start

### 1. BackEnd (Node.js + Express + Supabase)

```bash
cd BackEnd
pnpm install
pnpm db:push
pnpm dev
```

O servidor rodará em `http://localhost:3000`

**Variáveis de Ambiente Necessárias**:
- `SUPABASE_URL` - URL do projeto Supabase
- `SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço do Supabase
- `DATABASE_URL` - String de conexão do banco de dados

### 2. FrontEnd (React + Vite)

```bash
cd FrontEnd
pnpm install
pnpm dev
```

A aplicação rodará em `http://localhost:5173`

**Variáveis de Ambiente Necessárias**:
- `VITE_SUPABASE_URL` - URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` - Chave anônima do Supabase

---

## 📚 Documentação Detalhada

Para instruções completas de configuração, deploy e desenvolvimento, consulte:

- **[SETUP.md](./SETUP.md)** - Guia passo a passo de configuração
- **[BackEnd/README.md](./BackEnd/README.md)** - Documentação do servidor
- **[FrontEnd/README.md](./FrontEnd/README.md)** - Documentação do frontend

---

## ✨ Funcionalidades Principais

### 🎬 Pregações e Lives
- Integração automática com YouTube
- Notificação quando há transmissão ao vivo
- Galeria de pregações anteriores
- Sincronização automática de novos vídeos

### 📸 Instagram Integration
- Exibição dos 3 últimos posts
- Link direto para o perfil
- Atualização automática

### 🛍️ Gerenciamento de Conteúdo
- Painel administrativo com login/senha
- CRUD de seções, produtos e eventos
- Upload de imagens via Supabase Storage
- Edição em tempo real

### 📅 Calendário de Eventos
- Retiros, cultos e reuniões
- Informações de data, hora e local
- Capacidade de inscrição

### 🛒 Loja de Produtos
- Venda de camisetas e itens exclusivos
- Gerenciamento de estoque
- Integração com pagamentos (futuro)

---

## 🔐 Autenticação

O painel administrativo utiliza **Supabase Auth** com credenciais pré-configuradas:

- **Email**: admin@ciaonlineprimavera.com
- **Senha**: ADMcia2026#JC0**

> ⚠️ **Segurança**: Altere a senha no Supabase após o primeiro login!

---

## 🌐 Deploy

### Frontend (Vercel)
```bash
cd FrontEnd
vercel deploy
```

### Backend (Render)
```bash
cd BackEnd
# Configure as variáveis de ambiente no Render
# Deploy automático via Git
```

Consulte [SETUP.md](./SETUP.md) para instruções detalhadas de deploy.

---

## 🛠️ Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, Express, tRPC, TypeScript |
| **Banco de Dados** | Supabase (PostgreSQL) |
| **Autenticação** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Deploy** | Vercel (Frontend), Render (Backend) |

---

## 📞 Suporte

Para dúvidas ou problemas:

- **Telefone**: +55 31 9994-5139
- **Email**: contato@ciaprimavera.com
- **Instagram**: [@ciaonline_primavera](https://www.instagram.com/ciaonline_primavera)

---

## 📄 Licença

© 2024 Centro Internacional de Avivamento Primavera. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para a comunidade CIA Primavera**
