# DEERCHEER HUB - Agentes Claude Especializados

Guia prático para uso de agentes especializados no desenvolvimento do DEERCHEER HUB - plataforma de streaming com movie roulette interativo.

## 🚀 Quick Start Guide

### Para Features Novas:
```
1. Use brainstorm template → Product Manager Agent
2. Stories criadas → System Architect Agent  
3. Plano técnico → Agentes especializados
```

### Para Correções/Melhorias:
```
1. System Architect Agent (análise de impacto)
2. Agente especializado apropriado
```

---

## 🎯 AGENTES ORQUESTRADORES

### 📋 Product Manager Agent

**Use quando:** Tiver ideias/brainstorms para novas features ou mudanças significativas.

**O que faz:**
- Converte brainstorms em user stories estruturadas
- Define critérios de aceitação testáveis
- Prioriza por valor vs complexidade
- Cria roadmap de desenvolvimento

**Como usar:**
1. Use template `docs/templates/brainstorm.md` OU input direto
2. Agent cria `stories.md` estruturado
3. Passe para System Architect Agent

**Template de output:**
```markdown
## FEATURE: Nome da Feature

### User Stories:
- Como [streamer/viewer], eu quero [funcionalidade] para que [benefício]

### Acceptance Criteria:
- [ ] Critério específico e testável
- [ ] Critério específico e testável

### Priority: Alta/Média/Baixa
### Complexity: 1-5 pontos
### Dependencies: [lista]
```

---

### 🏗️ System Architect Agent

**Use quando:** Tiver user stories prontas e precisar de plano técnico para implementação.

**O que faz:**
- Analisa impacto arquitetural das features
- Define schema de banco e APIs necessárias
- Coordena trabalho entre agentes especializados
- Cria plano de implementação detalhado

**Como usar:**
1. Input: stories.md do Product Manager Agent
2. Agent cria `architecture-plan.md` detalhado
3. Distribui tasks para agentes especializados

**Template de output:**
```markdown
## Architecture Plan: [Feature Name]

### Database Changes:
- Tabelas: [lista]
- APIs: [endpoints necessários]
- Real-time: [subscriptions WebSocket]

### Agent Assignment:
1. Backend Agent: [tasks específicas]
2. Frontend Agent: [tasks específicas]
3. Streaming Agent: [tasks específicas]

### Integration Plan:
- Dependencies: [ordem de implementação]
- Testing: [estratégia de testes]
```

---

## 🛠️ AGENTES ESPECIALIZADOS

### 🛠️ Backend & Database Agent **[PRIORIDADE CRÍTICA]**

**Use quando:** Implementar/modificar banco de dados, APIs, real-time features.

**Status atual:** Database schema VAZIO - bloqueia features principais.

**Tasks críticas:**
- Implementar schema Supabase (profiles, movies, sessions, votes, chat)
- Criar APIs RESTful para todas funcionalidades
- Configurar Supabase Real-time para chat/voting
- Implementar Row Level Security (RLS)

**Schema essencial:**
```sql
-- Ver template completo em architecture-plan.md
CREATE TABLE profiles (id, username, role, etc)
CREATE TABLE movies (id, title, votes, etc)
CREATE TABLE movie_sessions (id, streamer_id, etc)
CREATE TABLE voting_sessions (id, status, etc)
```

---

### 🎨 Frontend & UI Agent (shadcn-ui-builder)

**Use quando:** Criar/modificar componentes visuais, layouts, animações gaming.

**Especialização:**
- Componentes shadcn/ui com tema gaming customizado
- Layouts responsivos para streaming dashboard
- Overlays transparentes para OBS
- Animações e micro-interações

**Tecnologias:** shadcn/ui + Tailwind + gaming theme (--gaming-purple, --gaming-blue, etc)

**Padrões:** CSS variables, neon/glow effects, modo escuro nativo

---

### ⚡ Streaming Features Agent

**Use quando:** Implementar funcionalidades específicas de streaming, dashboard interativo, overlays OBS.

**Funcionalidades atuais:** MovieRoulette, StreamingDashboard, OverlayRoulette, hotkeys

**Responsabilidades:**
- Sistema de sorteio de filmes
- Dashboard com painéis redimensionáveis  
- Integração OBS e overlays
- Real-time voting e chat
- Hotkeys e controles de streaming

**Inclui:** OBS Integration (overlays múltiplos, WebSocket, controles remotos)

---

### 🔐 Authentication & Security Agent

**Use quando:** Implementar auth, segurança, controle de acesso, perfis de usuário.

**Status atual:** Supabase Auth implementado, falta perfis e roles

**Oportunidades:**
- Implementar perfis de usuário completos
- Sistema de roles (streamer/viewer/moderator)
- Autenticação social (Discord, Twitch)
- Sistema de moderação e bans

---

## 🔧 AGENTES OPCIONAIS

### 📱 Mobile & PWA Agent
**Use quando:** Otimização mobile, PWA features, touch interfaces
**Pode ser integrado:** Frontend & UI Agent para projetos menores

### 🚀 DevOps & Performance Agent  
**Use quando:** Otimização performance, deploy, monitoring
**Use conforme necessário:** Não essencial para desenvolvimento inicial

---

## ✅ ORDEM DE PRIORIDADE

### Fase 1 - Crítica (Desbloqueio):
1. **Backend & Database Agent** - Implementar schema e APIs
2. **Product Manager Agent** - Para features pendentes
3. **System Architect Agent** - Para coordenação

### Fase 2 - Core Features:
4. **Frontend & UI Agent** - Melhorar interfaces
5. **Streaming Features Agent** - Expandir funcionalidades
6. **Authentication & Security Agent** - Perfis completos

### Fase 3 - Enhancements:
7. **Mobile & PWA Agent** - Experiência mobile
8. **DevOps & Performance Agent** - Otimizações

---

## 📋 CHECKLIST DE USO

### Antes de usar qualquer agent:
- [ ] Problema/objetivo está claro?
- [ ] É uma feature nova (usar orquestradores) ou melhoria (direto ao especializado)?
- [ ] Dependências identificadas?

### Para features novas:
- [ ] Brainstorm completo (use template)
- [ ] Product Manager Agent → stories.md
- [ ] System Architect Agent → architecture-plan.md
- [ ] Agentes especializados conforme plano

### Para melhorias/correções:
- [ ] System Architect Agent (análise de impacto)
- [ ] Agente especializado apropriado
- [ ] Validação final

---

## 🎯 TEMPLATES DISPONÍVEIS

Todos em `docs/templates/`:
- `brainstorm.md` - Input para Product Manager Agent
- `stories.md` - Output do Product Manager Agent  
- `architecture-plan.md` - Output do System Architect Agent
- `README.md` - Guia completo dos templates

---

## ⚡ CONTEXTO DO PROJETO

**Stack:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui + Supabase
**Tema:** Gaming (cores neon, efeitos glow, modo escuro)
**Usuários:** Streamers (controle) + Viewers (participação)
**Integrações:** OBS Studio, plataformas de streaming
**Real-time:** WebSocket para chat, voting, updates

**Limitação atual:** Database schema vazio - usar Backend Agent primeiro!