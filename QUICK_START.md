# 🚀 Quick Start - CIA Primavera

Guia rápido para começar a usar o projeto localmente.

---

## 📋 Pré-requisitos

- Node.js 22+
- pnpm
- Git

---

## ⚡ 3 Passos para Começar

### 1️⃣ Clonar e Instalar

```bash
git clone https://github.com/Matheus-Fernando-br/CIA-PRIMAVERA.git
cd CIA-PRIMAVERA

# BackEnd
cd BackEnd
cp .env.example .env
pnpm install
pnpm db:push
pnpm dev

# Em outro terminal - FrontEnd
cd FrontEnd
cp .env.example .env
pnpm install
pnpm dev
```

### 2️⃣ Acessar a Aplicação

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

### 3️⃣ Login no Painel Admin

- **Email**: admin@ciaonlineprimavera.com
- **Senha**: ADMcia2026#JC0**

---

## 🔧 Configurar Variáveis de Ambiente

### BackEnd/.env

```bash
SUPABASE_URL=https://cmvluyyqyzojrhttoveb.supabase.co
SUPABASE_ANON_KEY=<sua_chave_anon>
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://...
JWT_SECRET=sua_chave_secreta_aqui
YOUTUBE_API_KEY=sua_chave_youtube_aqui
NODE_ENV=development
```

### FrontEnd/.env

```bash
VITE_SUPABASE_URL=https://cmvluyyqyzojrhttoveb.supabase.co
VITE_SUPABASE_ANON_KEY=<sua_chave_anon>
VITE_API_URL=http://localhost:3000
```

---

## 📚 Documentação Completa

Para instruções detalhadas, consulte:

- **[README.md](./README.md)** - Visão geral do projeto
- **[SETUP.md](./SETUP.md)** - Configuração completa e deploy
- **[BackEnd/README.md](./BackEnd/README.md)** - Documentação do servidor
- **[FrontEnd/README.md](./FrontEnd/README.md)** - Documentação do frontend

---

## 🎯 Próximos Passos

1. ✅ Configure as variáveis de ambiente
2. ✅ Execute as migrações do banco de dados
3. ✅ Inicie o servidor de desenvolvimento
4. ✅ Acesse o painel admin
5. ✅ Comece a adicionar conteúdo!

---

## 📞 Precisa de Ajuda?

Consulte a documentação completa em [SETUP.md](./SETUP.md) ou entre em contato:

- **Telefone**: +55 31 9994-5139
- **Instagram**: [@ciaonline_primavera](https://www.instagram.com/ciaonline_primavera)

---

**Desenvolvido com ❤️ para CIA Primavera**
