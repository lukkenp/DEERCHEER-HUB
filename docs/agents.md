# Agents Especializados - DEERCHEER HUB

Este documento define os agentes especializados Claude para o desenvolvimento do projeto DEERCHEER HUB, uma plataforma de streaming com funcionalidades de sorteio de filmes e dashboard interativo.

## 🎨 Frontend & UI Agent (shadcn-ui-builder)

**Especialização:** Desenvolvimento de interface usando shadcn/ui e React

**Responsabilidades:**
- Criar e aprimorar componentes da UI usando shadcn/ui
- Implementar layouts responsivos com Tailwind CSS
- Desenvolver animações e transições com tema gaming
- Otimizar componentes para streaming dashboard
- Implementar padrões de design consistentes

**Contexto do Projeto:**
- Tema gaming com cores personalizadas (purple, blue, cyan, pink)
- Sistema de design baseado em CSS variables
- Componentes com efeitos neon e glow
- Interface otimizada para streamers

**Ferramentas Principais:**
- shadcn/ui components
- Tailwind CSS com configuração customizada
- Lucide React icons
- React Hook Form para formulários

---

## ⚡ Streaming Features Agent

**Especialização:** Funcionalidades específicas de streaming e interatividade

**Responsabilidades:**
- Desenvolver sistema de roleta de filmes
- Implementar dashboard de streaming com painel lateral
- Criar overlays para OBS Studio
- Desenvolver hotkeys e atalhos de teclado
- Implementar funcionalidades em tempo real

**Funcionalidades Atuais:**
- MovieRoulette: Sistema de sorteio de filmes
- StreamingDashboard: Interface principal do streamer
- OverlayRoulette: Página para integração com OBS
- Modo Studio com atalhos de teclado
- Painel colapsável com tabs (Roleta, Histórico, Chat)

**Tecnologias:**
- React hooks para estado local
- LocalStorage para persistência
- React Resizable Panels
- Integração com clipboard API

---

## 🔐 Authentication & Security Agent

**Especialização:** Autenticação e segurança com Supabase

**Responsabilidades:**
- Gerenciar autenticação de usuários
- Implementar controle de acesso às rotas
- Configurar políticas de segurança do Supabase
- Otimizar fluxos de login/logout
- Implementar proteção de rotas

**Sistema Atual:**
- useAuth hook com React Context
- Autenticação via Supabase Auth
- Persistência de sessão em localStorage
- Redirecionamento automático para login
- Proteção de rotas do dashboard

**Considerações:**
- Database schema ainda não definido (types.ts vazio)
- Apenas autenticação implementada, sem dados persistentes
- Potencial para implementar perfis de usuário

---

## 🛠️ Backend & Database Agent

**Especialização:** API, banco de dados e integração Supabase

**Necessidade Identificada:** ALTA PRIORIDADE

**Justificativa:**
- Atualmente o projeto usa apenas Supabase Auth
- Database schema vazio (sem tabelas definidas)
- Funcionalidades como histórico de filmes precisam de persistência
- Chat da comunidade requer backend em tempo real
- Sistema de votação precisa de APIs

**Responsabilidades Sugeridas:**
- Projetar e implementar schema do banco Supabase
- Criar APIs para persistência de filmes e histórico
- Implementar sistema de votação em tempo real
- Desenvolver funcionalidades de chat/comunidade
- Criar endpoints para dados de streaming
- Configurar Row Level Security (RLS)

**Tabelas Necessárias:**
```sql
-- Sugestão de schema inicial
- movies: armazenar filmes para sorteio
- movie_sessions: histórico de sorteios
- users_movies: filmes favoritos por usuário
- voting_sessions: sessões de votação ativas
- chat_messages: mensagens do chat (futuro)
```

---

## 📱 Mobile & PWA Agent

**Especialização:** Otimização mobile e Progressive Web App

**Justificativa:**
- Dashboard pode ser usado em dispositivos móveis
- Viewers podem participar via mobile
- PWA permitiria notificações push

**Responsabilidades:**
- Otimizar interface para dispositivos móveis
- Implementar funcionalidades PWA
- Criar versão mobile do dashboard
- Otimizar performance em dispositivos menores
- Implementar touch gestures

---

## 🎥 OBS Integration Agent

**Especialização:** Integração com software de streaming

**Funcionalidades Atuais:**
- URL de overlay para OBS (`/overlay/roulette`)
- Cópia automática de URL do overlay

**Responsabilidades Futuras:**
- Criar múltiplos tipos de overlays
- Implementar WebSocket para updates em tempo real
- Desenvolver controles remotos para OBS
- Criar templates de overlay customizáveis
- Integração com APIs do OBS Studio

---

## 🚀 DevOps & Performance Agent

**Especialização:** Deploy, performance e otimização

**Responsabilidades:**
- Otimizar build e bundle size
- Configurar deploy automatizado
- Implementar monitoramento de performance
- Otimizar loading e lazy loading
- Configurar CDN e cache strategies

**Contexto Atual:**
- Projeto Vite com build otimizado
- Deploy via Lovable (mencionado no README)
- Bundle splitting potencial com dynamic imports

---

## Recomendações de Implementação

### Prioridade 1 (Crítica):
1. **Backend & Database Agent** - Implementar schema e APIs
2. **shadcn-ui-builder Agent** - Continuar desenvolvimento da UI

### Prioridade 2 (Alta):
3. **Streaming Features Agent** - Expandir funcionalidades existentes
4. **Authentication & Security Agent** - Implementar perfis de usuário

### Prioridade 3 (Média):
5. **OBS Integration Agent** - Melhorar integração com streaming
6. **Mobile & PWA Agent** - Otimização mobile

### Prioridade 4 (Baixa):
7. **DevOps & Performance Agent** - Otimizações avançadas

---

## Coordenação Entre Agents

- **Frontend + Backend**: Trabalhar em paralelo nas APIs e interfaces
- **Streaming + OBS**: Coordenar overlays e funcionalidades ao vivo
- **Auth + Backend**: Integrar autenticação com dados do usuário
- **Mobile + UI**: Otimizar componentes para responsividade

Cada agent deve manter consistência com o CLAUDE.md principal e seguir os padrões estabelecidos no projeto.