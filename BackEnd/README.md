# 🔧 BackEnd - CIA Primavera

Servidor Node.js + Express + tRPC com integração Supabase.

---

## 📁 Estrutura

```
BackEnd/
├── server/
│   ├── _core/              # Infraestrutura do servidor
│   │   ├── index.ts        # Entrada do servidor
│   │   ├── context.ts      # Contexto tRPC
│   │   ├── trpc.ts         # Configuração tRPC
│   │   └── ...
│   ├── routers.ts          # Procedures tRPC
│   ├── db.ts               # Query helpers
│   ├── youtube.ts          # Integração YouTube
│   ├── instagram.ts        # Integração Instagram
│   └── *.test.ts           # Testes
├── drizzle/
│   ├── schema.ts           # Schema do banco
│   └── migrations/         # Migrações
├── shared/                 # Código compartilhado
├── package.json
└── tsconfig.json
```

---

## 🚀 Quick Start

```bash
# Instalar dependências
pnpm install

# Configurar .env
cp .env.example .env

# Executar migrações
pnpm db:push

# Iniciar servidor
pnpm dev
```

Servidor rodará em `http://localhost:3000`

---

## 📝 Variáveis de Ambiente

```bash
# Supabase
SUPABASE_URL=https://cmvluyyqyzojrhttoveb.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Banco de Dados
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=sua_chave_secreta

# YouTube
YOUTUBE_API_KEY=...

# Instagram (opcional)
INSTAGRAM_ACCESS_TOKEN=...
```

---

## 🗄️ Banco de Dados

### Schema

Tabelas principais:

- **users**: Usuários autenticados
- **sermons**: Pregações do YouTube
- **products**: Produtos (camisetas, etc)
- **events**: Eventos (retiros, cultos)
- **sections**: Conteúdo dinâmico
- **instagram_posts**: Posts do Instagram (cache)
- **youtube_live**: Status de lives

### Migrações

```bash
# Criar migração
pnpm db:push

# Ver status
pnpm db:studio
```

---

## 📡 API tRPC

### Procedures Públicas

```typescript
// Listar pregações
trpc.sermons.list.useQuery()

// Listar produtos
trpc.products.list.useQuery()

// Listar eventos
trpc.events.list.useQuery()

// Obter status de live
trpc.youtube.liveStatus.useQuery()

// Listar posts do Instagram
trpc.instagram.posts.useQuery()
```

### Procedures Protegidas (Admin)

```typescript
// Criar pregação
trpc.sermons.create.useMutation()

// Atualizar produto
trpc.products.update.useMutation()

// Deletar evento
trpc.events.delete.useMutation()

// Sincronizar YouTube
trpc.youtube.sync.useMutation()
```

---

## 🎬 YouTube Integration

### Sincronização Automática

O servidor monitora o canal do YouTube automaticamente:

1. **A cada 15 minutos**: Verifica se há nova live
2. **A cada hora**: Sincroniza novos vídeos
3. **Em tempo real**: Atualiza status de live

### Configuração

```typescript
// server/youtube.ts
startYouTubeSyncScheduler(
  "ciaprimaveraon3264",  // ID do canal
  60                      // Intervalo em minutos
);
```

### API Endpoints

```typescript
// Obter status de live
GET /api/trpc/youtube.liveStatus

// Sincronizar vídeos
POST /api/trpc/youtube.sync

// Listar pregações
GET /api/trpc/sermons.list
```

---

## 📸 Instagram Integration

### Web Scraping

Obtém os últimos 3 posts automaticamente:

```typescript
// server/instagram.ts
const posts = await getInstagramPosts("ciaonline_primavera");
```

### Cache

Posts são cacheados por 1 hora para melhor performance.

---

## 🔐 Autenticação

### Supabase Auth

Login com email/senha:

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: "admin@ciaonlineprimavera.com",
  password: "ADMcia2026#JC0**"
});
```

### Proteção de Rotas

Apenas usuários autenticados podem acessar procedures protegidas:

```typescript
protectedProcedure
  .input(z.object({ ... }))
  .mutation(({ ctx, input }) => {
    // ctx.user contém dados do usuário
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    // ...
  })
```

---

## 📦 Supabase Storage

### Upload de Imagens

```typescript
import { storagePut } from "./storage";

const { url } = await storagePut(
  "cia-images/produto-1.jpg",
  fileBuffer,
  "image/jpeg"
);
```

### Buckets

- `cia-images`: Imagens de produtos, eventos, etc

---

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Modo watch
pnpm test:watch

# Com cobertura
pnpm test:coverage
```

### Exemplo de Teste

```typescript
describe("sermons.list", () => {
  it("deve retornar lista de pregações", async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.sermons.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
```

---

## 🚀 Deploy

### Render

```bash
# Build
pnpm build

# Start
pnpm start
```

### Variáveis de Ambiente no Render

Configure no dashboard do Render:

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL=...
JWT_SECRET=...
YOUTUBE_API_KEY=...
NODE_ENV=production
```

---

## 📊 Monitoramento

### Logs

```bash
# Ver logs em tempo real
pnpm logs

# Logs do Render
# Dashboard > Logs
```

### Métricas

- Requisições por segundo
- Tempo de resposta
- Taxa de erro
- Uso de CPU/Memória

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

```bash
# Verifique DATABASE_URL
echo $DATABASE_URL

# Teste conexão
psql $DATABASE_URL
```

### Erro: "Supabase key invalid"

```bash
# Verifique as chaves
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

### Erro: "YouTube API quota exceeded"

Aguarde 24 horas ou aumente a quota no Google Cloud Console.

---

## 📚 Recursos

- [Express.js Docs](https://expressjs.com/)
- [tRPC Docs](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Supabase Docs](https://supabase.com/docs)

---

**Desenvolvido com ❤️ para CIA Primavera**
