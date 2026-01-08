# Church Website - TODO List

## Fase 1: Estrutura Base e Banco de Dados
- [x] Criar schema do banco de dados com Drizzle ORM (usuários, seções, produtos, eventos)
- [x] Configurar migrações do banco de dados
- [x] Implementar helpers de query no server/db.ts

## Fase 2: Autenticação e Painel Administrativo
- [x] Configurar autenticação com Manus OAuth
- [x] Criar componente AdminLayout para painel admin
- [x] Implementar proteção de rotas para admin
- [x] Criar UI para gerenciamento de seções (textos, imagens, links)
- [ ] Implementar upload de imagens para S3
- [x] Criar tRPC procedures para CRUD de seções

## Fase 3: Frontend - Seções Principais
- [x] Criar layout principal com navegação elegante
- [x] Implementar seção de Pregações (listagem de vídeos)
- [x] Implementar seção de Camisetas (produtos)
- [x] Implementar seção de Retiros (eventos)
- [x] Implementar seção de Cultos (informações e horários)
- [x] Criar página inicial com destaques

## Fase 4: Gerenciamento de Produtos
- [x] Criar schema para produtos (camisetas)
- [x] Implementar CRUD de produtos no admin
- [x] Criar galeria de produtos no frontend
- [ ] Adicionar carrinho de compras (estrutura básica)
- [ ] Implementar filtros e busca de produtos

## Fase 5: Calendário de Eventos
- [x] Criar schema para eventos (retiros, cultos)
- [x] Implementar CRUD de eventos no admin
- [x] Criar componente de calendário no frontend
- [ ] Implementar visualização de detalhes de eventos
- [ ] Adicionar notificações de eventos

## Fase 6: Integração YouTube API
- [x] Configurar credenciais da YouTube API
- [x] Implementar busca automática de lives/vídeos
- [x] Criar job para sincronizar vídeos periodicamente
- [x] Atualizar seção de pregações em tempo real
- [x] Implementar cache de vídeos

## Fase 7: Sistema de Atualização em Tempo Real
- [x] Implementar WebSocket para atualizações em tempo real (opcional com Socket.io)
- [x] Criar sistema de notificações para mudanças
- [x] Implementar refresh automático de conteúdo

## Fase 8: Deploy e CI/CD
- [ ] Configurar GitHub Actions para build e deploy
- [ ] Setup deploy frontend na Vercel
- [ ] Setup deploy backend no Render
- [ ] Configurar variáveis de ambiente
- [ ] Criar scripts de deployment

## Fase 9: Documentação
- [x] Documentar estrutura do projeto
- [x] Criar README.md com instruções de setup
- [x] Documentar API endpoints
- [x] Criar guia de uso do painel admin
- [x] Adicionar comentários no código

## Fase 10: Testes e Qualidade
- [x] Escrever testes unitários (Vitest)
- [x] Testar fluxos de autenticação
- [x] Testar CRUD de seções e produtos
- [x] Testar integração YouTube
- [x] Validar responsividade do frontend

## Fase 11: Design e UX (COMPLETO)
- [x] Implementar design elegante e moderno
- [x] Garantir responsividade em todos os dispositivos
- [x] Implementar animações e transições suaves
- [x] Otimizar performance de imagens
- [x] Implementar acessibilidade (WCAG)

## Fase 12: Segurança
- [x] Validar entrada de dados
- [x] Implementar rate limiting
- [x] Configurar CORS corretamente
- [x] Proteger endpoints administrativos
- [x] Implementar validação de JWT
