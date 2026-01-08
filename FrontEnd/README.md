# 🎨 FrontEnd - CIA Primavera

Aplicação React + Vite com design responsivo e integração com Supabase.

---

## 📁 Estrutura

```
FrontEnd/
├── client/
│   ├── src/
│   │   ├── pages/              # Páginas da aplicação
│   │   │   ├── Home.tsx        # Homepage pública
│   │   │   ├── AdminLogin.tsx  # Login do admin
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminSermons.tsx
│   │   │   ├── AdminProducts.tsx
│   │   │   ├── AdminEvents.tsx
│   │   │   └── ...
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── Header.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── trpc.ts         # Cliente tRPC
│   │   │   └── supabase.ts     # Cliente Supabase
│   │   ├── contexts/           # React contexts
│   │   ├── hooks/              # Custom hooks
│   │   ├── App.tsx             # Roteamento
│   │   ├── main.tsx            # Entrada
│   │   └── index.css           # Estilos globais
│   ├── public/                 # Arquivos estáticos
│   └── index.html
├── vite.config.ts
├── components.json
└── tsconfig.json
```

---

## 🚀 Quick Start

```bash
# Instalar dependências
pnpm install

# Configurar .env
cat > .env << 'EOF'
VITE_SUPABASE_URL=https://cmvluyyqyzojrhttoveb.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=http://localhost:3000
EOF

# Iniciar servidor de desenvolvimento
pnpm dev
```

Aplicação rodará em `http://localhost:5173`

---

## 📝 Variáveis de Ambiente

```bash
# Supabase
VITE_SUPABASE_URL=https://cmvluyyqyzojrhttoveb.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon

# API
VITE_API_URL=http://localhost:3000  # Desenvolvimento
VITE_API_URL=https://cia-primavera.onrender.com  # Produção
```

---

## 🎨 Design

### Componentes

Utilizamos **shadcn/ui** + **Tailwind CSS** para design consistente:

```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MyComponent() {
  return (
    <Card>
      <Button>Clique aqui</Button>
    </Card>
  );
}
```

### Tema

O tema pode ser customizado em `client/src/index.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    /* ... outras cores ... */
  }
}
```

---

## 📱 Páginas Principais

### Home (Pública)

- Header com logo, título e menu hambúrguer
- Seção hero com CTA
- Últimos 3 posts do Instagram
- Últimas 3 pregações do YouTube
- Próximos 2 eventos
- Últimos 3 produtos
- Footer com informações de contato

### Admin Login

- Formulário de login com email/senha
- Integração com Supabase Auth
- Redirecionamento para dashboard após login

### Admin Dashboard

- Estatísticas gerais
- Resumo de pregações, produtos e eventos
- Links rápidos para gerenciamento

### Admin Sermons

- Listar pregações
- Criar nova pregação
- Editar pregação
- Deletar pregação
- Sincronizar YouTube

### Admin Products

- Listar produtos
- Criar novo produto
- Editar produto
- Deletar produto
- Upload de imagem

### Admin Events

- Listar eventos
- Criar novo evento
- Editar evento
- Deletar evento

---

## 🔐 Autenticação

### Login

```typescript
import { supabase } from "@/lib/supabase";

const { data, error } = await supabase.auth.signInWithPassword({
  email: "admin@ciaonlineprimavera.com",
  password: "ADMcia2026#JC0**"
});
```

### Proteção de Rotas

```typescript
import { useAuth } from "@/hooks/useAuth";

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/login" />;

  return <div>Conteúdo admin</div>;
}
```

---

## 🎬 Integração YouTube

### Status de Live

```typescript
import { trpc } from "@/lib/trpc";

export default function LiveBanner() {
  const { data: liveStatus } = trpc.youtube.liveStatus.useQuery();

  if (!liveStatus?.isLive) return null;

  return (
    <div className="bg-red-600 text-white p-4">
      🔴 TRANSMISSÃO AO VIVO AGORA!
    </div>
  );
}
```

### Listar Pregações

```typescript
const { data: sermons } = trpc.sermons.list.useQuery();

return (
  <div>
    {sermons?.map(sermon => (
      <div key={sermon.id}>
        <h3>{sermon.title}</h3>
        <p>{sermon.speaker}</p>
        <a href={sermon.youtubeUrl}>Assistir</a>
      </div>
    ))}
  </div>
);
```

---

## 📸 Instagram

### Listar Posts

```typescript
const { data: posts } = trpc.instagram.posts.useQuery();

return (
  <div className="grid grid-cols-3 gap-4">
    {posts?.map(post => (
      <a key={post.id} href={post.link} target="_blank">
        <img src={post.imageUrl} alt={post.caption} />
      </a>
    ))}
  </div>
);
```

---

## 📦 Supabase Storage

### Upload de Imagem

```typescript
import { supabase } from "@/lib/supabase";

const file = event.target.files?.[0];
if (!file) return;

const { data, error } = await supabase.storage
  .from("cia-images")
  .upload(`products/${Date.now()}-${file.name}`, file);

if (error) {
  console.error("Erro ao fazer upload:", error);
  return;
}

const imageUrl = supabase.storage
  .from("cia-images")
  .getPublicUrl(data.path).data.publicUrl;
```

---

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Modo watch
pnpm test:watch
```

---

## 🚀 Build e Deploy

### Build Local

```bash
pnpm build
```

Gera arquivos em `dist/`

### Deploy no Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Variáveis de Ambiente no Vercel

Configure no dashboard do Vercel:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=https://cia-primavera.onrender.com
```

---

## 📊 Performance

### Otimizações

- Code splitting automático com Vite
- Lazy loading de componentes
- Otimização de imagens
- Cache de requisições tRPC

### Métricas

- Lighthouse Score
- Core Web Vitals
- Bundle Size

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@/lib/supabase'"

```bash
# Verifique tsconfig.json
# Deve ter: "baseUrl": ".", "paths": { "@/*": ["client/src/*"] }
```

### Erro: "VITE_SUPABASE_URL is undefined"

Verifique se o arquivo `.env` está configurado corretamente.

### Erro: "Cannot connect to API"

Verifique se o BackEnd está rodando em `http://localhost:3000`

---

## 📚 Recursos

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase Docs](https://supabase.com/docs)

---

**Desenvolvido com ❤️ para CIA Primavera**
