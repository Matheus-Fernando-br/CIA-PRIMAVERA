# 🔧 Guia de Configuração - CIA Primavera

Instruções passo a passo para configurar o projeto localmente e fazer deploy em produção.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 22+ ([Download](https://nodejs.org/))
- **pnpm** 10+ ([Instalação](https://pnpm.io/installation))
- **Git** ([Download](https://git-scm.com/))
- **Conta Supabase** ([Criar conta](https://supabase.com/))

---

## 🔑 Dados do Supabase

Você já possui as credenciais do Supabase:

```
PROJECT ID: cmvluyyqyzojrhttoveb
SERVICE ROLE: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtdmx1eXlxeXpvanJodHRvdmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzg4MjYwNCwiZXhwIjoyMDgzNDU4NjA0fQ.5tHurQWI9PS7FB5iI_k1sYYOVbaJrkfeaz2Oyw3VZm0
```

---

## 🚀 Instalação Local

### 1. Clonar o Repositório

```bash
git clone https://github.com/Matheus-Fernando-br/CIA-PRIMAVERA.git
cd CIA-PRIMAVERA
```

### 2. Configurar BackEnd

```bash
cd BackEnd

# Instalar dependências
pnpm install

# Criar arquivo .env
cat > .env << 'EOF'
# Supabase
SUPABASE_URL=https://cmvluyyqyzojrhttoveb.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Banco de Dados
DATABASE_URL=postgresql://postgres:password@localhost:5432/cia_primavera

# JWT
JWT_SECRET=sua_chave_secreta_muito_longa_e_aleatoria

# YouTube
YOUTUBE_API_KEY=sua_chave_youtube_api

# Instagram (opcional)
INSTAGRAM_ACCESS_TOKEN=seu_token_instagram
EOF

# Executar migrações
pnpm db:push

# Iniciar servidor
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

### 3. Configurar FrontEnd

```bash
cd ../FrontEnd

# Instalar dependências
pnpm install

# Criar arquivo .env
cat > .env << 'EOF'
VITE_SUPABASE_URL=https://cmvluyyqyzojrhttoveb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:3000
EOF

# Iniciar aplicação
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 🔐 Configurar Supabase Auth

### 1. Criar Usuário Admin

1. Acesse [Supabase Dashboard](https://app.supabase.com/)
2. Selecione o projeto `CIA-PRIMAVERA`
3. Vá para **Authentication > Users**
4. Clique em **Add user**
5. Preencha:
   - **Email**: admin@ciaonlineprimavera.com
   - **Password**: ADMcia2026#JC0**
6. Clique em **Create user**

### 2. Configurar Email Templates (Opcional)

1. Vá para **Authentication > Email Templates**
2. Customize os templates de email conforme necessário

### 3. Configurar OAuth Providers (Opcional)

Para permitir login com Google, GitHub, etc:

1. Vá para **Authentication > Providers**
2. Ative os provedores desejados
3. Configure as credenciais

---

## 🎬 Configurar Integração YouTube

### 1. Obter API Key do YouTube

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative a **YouTube Data API v3**
4. Crie uma chave de API
5. Copie a chave

### 2. Configurar no BackEnd

Adicione a chave ao arquivo `.env`:

```bash
YOUTUBE_API_KEY=sua_chave_aqui
```

### 3. Sincronizar Vídeos

No painel administrativo, vá para **Configurações** e clique em **Sincronizar Agora**.

---

## 📸 Configurar Instagram

### Opção 1: Web Scraping (Simples)

A solução atual usa web scraping para obter os últimos 3 posts. Nenhuma configuração necessária!

### Opção 2: Instagram Graph API (Avançado)

Para usar a API oficial:

1. Crie um app no [Meta Developers](https://developers.facebook.com/)
2. Configure o Instagram Graph API
3. Obtenha um access token
4. Adicione ao `.env`:

```bash
INSTAGRAM_ACCESS_TOKEN=seu_token_aqui
```

---

## 💾 Configurar Supabase Storage

### 1. Criar Bucket

1. Acesse [Supabase Dashboard](https://app.supabase.com/)
2. Vá para **Storage > Buckets**
3. Clique em **New bucket**
4. Nome: `cia-images`
5. Deixe como **Public**
6. Clique em **Create bucket**

### 2. Configurar Políticas de Acesso

1. Clique no bucket `cia-images`
2. Vá para **Policies**
3. Adicione permissões para upload/download

---

## 🌐 Deploy em Produção

### Deploy Frontend (Vercel)

#### 1. Conectar Repositório

1. Acesse [Vercel](https://vercel.com/)
2. Clique em **New Project**
3. Selecione seu repositório GitHub
4. Clique em **Import**

#### 2. Configurar Projeto

- **Framework Preset**: Vite
- **Root Directory**: `FrontEnd`
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`

#### 3. Variáveis de Ambiente

Adicione no Vercel:

```
VITE_SUPABASE_URL=https://cmvluyyqyzojrhttoveb.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon
VITE_API_URL=https://cia-primavera.onrender.com
```

#### 4. Deploy

Clique em **Deploy**. A aplicação estará disponível em um URL do Vercel.

### Deploy Backend (Render)

#### 1. Conectar Repositório

1. Acesse [Render](https://render.com/)
2. Clique em **New +**
3. Selecione **Web Service**
4. Conecte seu repositório GitHub

#### 2. Configurar Serviço

- **Name**: cia-primavera-api
- **Environment**: Node
- **Build Command**: `cd BackEnd && pnpm install && pnpm build`
- **Start Command**: `cd BackEnd && pnpm start`
- **Root Directory**: `.`

#### 3. Variáveis de Ambiente

Adicione no Render:

```
SUPABASE_URL=https://cmvluyyqyzojrhttoveb.supabase.co
SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
DATABASE_URL=postgresql://...
JWT_SECRET=sua_chave_secreta
YOUTUBE_API_KEY=sua_chave_youtube
NODE_ENV=production
```

#### 4. Deploy

Clique em **Create Web Service**. O deploy será automático.

---

## 🔄 Deploy Automático com GitHub

### Configurar Webhook

Toda vez que você faz push para `main`, o deploy acontece automaticamente:

1. **Vercel**: Conecta automaticamente ao GitHub
2. **Render**: Conecta automaticamente ao GitHub

Basta fazer push e aguardar o deploy!

```bash
git add .
git commit -m "Atualização do site"
git push origin main
```

---

## 🧪 Testes

### Executar Testes Localmente

```bash
cd BackEnd
pnpm test
```

### Testes com Cobertura

```bash
pnpm test:coverage
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'supabase'"

```bash
cd BackEnd
pnpm install
```

### Erro: "SUPABASE_URL is not defined"

Verifique se o arquivo `.env` está configurado corretamente.

### Erro: "Database connection failed"

Verifique:
- `DATABASE_URL` está correto
- Banco de dados está rodando
- Firewall permite conexão

### Erro: "YouTube API key invalid"

- Verifique se a chave está correta
- Confirme que a API está ativada no Google Cloud
- Verifique limites de quota

---

## 📊 Monitoramento

### Logs em Produção

**Vercel**: Dashboard > Deployments > Logs  
**Render**: Dashboard > Logs

### Alertas

Configure alertas para:
- Erros de aplicação
- Falhas de deploy
- Uso de recursos

---

## 🔒 Segurança em Produção

### Checklist

- [ ] Altere a senha do admin no Supabase
- [ ] Use HTTPS em todos os endpoints
- [ ] Configure CORS corretamente
- [ ] Ative rate limiting
- [ ] Configure backup do banco de dados
- [ ] Monitore logs regularmente
- [ ] Atualize dependências regularmente

### Variáveis Sensíveis

Nunca commite `.env` no Git! Use:

```bash
echo ".env" >> .gitignore
```

---

## 📞 Suporte

Para dúvidas:

- **Documentação**: Consulte README.md
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs

---

**Desenvolvido com ❤️ para CIA Primavera**
