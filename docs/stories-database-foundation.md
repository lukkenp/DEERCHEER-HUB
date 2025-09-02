# User Stories - Database Foundation

**Data:** 02/09/2025  
**Product Manager:** Claude Code  
**Epic:** Database Foundation & Core Infrastructure  
**Status:** Draft

## 📋 Resumo Executivo

**Objetivo:** Estabelecer a base de dados completa para suportar todas as funcionalidades do DEERCHEER HUB, incluindo sistema de perfis, persistência de filmes, votação real-time e chat da comunidade.  
**Valor para o negócio:** Remove o principal bloqueador técnico permitindo desenvolvimento de todas as features principais. Transforma protótipo em aplicação funcional.  
**Usuários-alvo:** Streamers e Viewers (foundation para ambos)

## 🎯 User Stories

### Story 1: Sistema de Perfis de Usuário
**Como** usuário do DEERCHEER HUB  
**Eu quero** ter um perfil persistente com minha identidade e preferências  
**Para que** eu possa ter experiências personalizadas e histórico das minhas atividades

#### Acceptance Criteria:
- [ ] **Given** sou um novo usuário, **When** faço login pela primeira vez, **Then** um perfil é automaticamente criado vinculado ao meu auth.uid
- [ ] **Given** sou um streamer, **When** acesso meu perfil, **Then** vejo campos específicos como canal_twitch, bio, stats de sessões
- [ ] **Given** sou um viewer, **When** acesso meu perfil, **Then** vejo meu histórico de participação, filmes votados e estatísticas
- [ ] **Given** estou editando perfil, **When** atualizo informações, **Then** mudanças são salvas e refletidas imediatamente
- [ ] **Given** acesso qualquer tela, **When** carrego dados, **Then** meu perfil está sempre disponível via context

#### Definition of Done:
- [ ] Tabela `profiles` criada com fields para streamer e viewer
- [ ] RLS policies implementadas para privacidade
- [ ] Hook `useProfile` criando/carregando perfis automaticamente
- [ ] Componente ProfileForm para edição
- [ ] Migration SQL documentada e testada
- [ ] Tipos TypeScript gerados e integrados
- [ ] Testes unitários para CRUD operations

**Priority:** Alta  
**Complexity:** 3 story points  
**Dependencies:** Supabase auth system (existente)

---

### Story 2: Persistência e Gestão de Filmes
**Como** streamer  
**Eu quero** gerenciar minha biblioteca de filmes de forma persistente  
**Para que** eu possa organizar movie nights sem perder dados e ter controle total sobre o conteúdo

#### Acceptance Criteria:
- [ ] **Given** sou streamer, **When** adiciono filme via interface, **Then** filme é salvo com metadata completa (título, year, genre, poster_url, etc)
- [ ] **Given** tenho filmes cadastrados, **When** acesso MovieRoulette, **Then** vejo apenas meus filmes disponíveis para sorteio
- [ ] **Given** estou editando filme, **When** atualizo informações, **Then** alterações são salvas e refletidas no roulette
- [ ] **Given** removo filme, **When** confirmo exclusão, **Then** filme é removido da biblioteca mas permanece no histórico de sessões anteriores
- [ ] **Given** filme tem poster_url inválida, **When** sistema detecta erro, **Then** fallback image é exibida e admin é notificado

#### Definition of Done:
- [ ] Tabela `movies` criada com campos completos de metadata
- [ ] CRUD APIs implementadas com validação
- [ ] MovieLibrary component substituindo localStorage
- [ ] Integração com MovieRoulette atualizada
- [ ] Upload/gestão de posters implementada
- [ ] Bulk import functionality para migração
- [ ] Error handling para external URLs

**Priority:** Alta  
**Complexity:** 4 story points  
**Dependencies:** Sistema de Perfis, External image hosting

---

### Story 3: Histórico de Sessões e Tracking
**Como** streamer  
**Eu quero** ter registro completo das minhas sessões de movie night  
**Para que** eu possa acompanhar estatísticas, evitar repetições e melhorar o engajamento

#### Acceptance Criteria:
- [ ] **Given** inicio uma sessão, **When** ativo MovieRoulette, **Then** nova sessão é criada automaticamente com timestamp
- [ ] **Given** sessão está ativa, **When** filme é sorteado, **Then** resultado é registrado com vencedor, votos, participantes
- [ ] **Given** sessão termina, **When** finalizo stream, **Then** sessão é marcada como concluída com duração total
- [ ] **Given** acesso histórico, **When** visualizo sessões passadas, **Then** vejo dados completos: filme assistido, viewers, engagement
- [ ] **Given** sou viewer, **When** participo de sessão, **Then** minha participação é registrada no meu perfil

#### Definition of Done:
- [ ] Tabelas `streaming_sessions` e `session_participants` criadas
- [ ] Auto-tracking de início/fim de sessões
- [ ] Dashboard de histórico implementado
- [ ] Relatórios de engagement básicos
- [ ] Viewer participation tracking
- [ ] Data export functionality
- [ ] Performance optimization para queries históricas

**Priority:** Média  
**Complexity:** 4 story points  
**Dependencies:** Sistema de Perfis, Persistência de Filmes

---

### Story 4: Sistema de Votação Real-Time
**Como** viewer  
**Eu quero** votar nos filmes disponíveis durante o sorteio  
**Para que** eu possa influenciar na escolha e ter experiência mais interativa

#### Acceptance Criteria:
- [ ] **Given** MovieRoulette está ativo, **When** vejo lista de filmes, **Then** posso votar em qualquer filme disponível
- [ ] **Given** votei em filme, **When** outros viewers votam, **Then** vejo contadores atualizados em tempo real
- [ ] **Given** sou mesmo viewer, **When** tento votar novamente, **Then** sistema substitui voto anterior
- [ ] **Given** votação termina, **When** filme é sorteado, **Then** sistema considera pesos dos votos no algoritmo
- [ ] **Given** sou viewer anônimo, **When** tento votar, **Then** sou redirecionado para login/cadastro

#### Definition of Done:
- [ ] Tabela `votes` com real-time subscriptions
- [ ] Componente VotingInterface integrado ao MovieRoulette
- [ ] WebSocket/subscription para updates em tempo real
- [ ] Algoritmo de sorteio considerando votos
- [ ] Rate limiting e anti-spam measures
- [ ] Vote analytics para streamers
- [ ] Mobile-responsive voting UI

**Priority:** Alta  
**Complexity:** 5 story points  
**Dependencies:** Sistema de Perfis, Persistência de Filmes, Supabase Realtime

---

### Story 5: Chat da Comunidade
**Como** usuário (streamer ou viewer)  
**Eu quero** conversar com outros participantes durante a sessão  
**Para que** eu possa interagir socialmente e criar comunidade em torno dos movie nights

#### Acceptance Criteria:
- [ ] **Given** estou em sessão ativa, **When** envio mensagem, **Then** todos participantes veem em tempo real
- [ ] **Given** sou streamer, **When** preciso moderar, **Then** tenho controles para deletar mensagens/silenciar users
- [ ] **Given** mensagem contém conteúdo impróprio, **When** sistema detecta, **Then** auto-moderação básica é aplicada
- [ ] **Given** chat está muito ativo, **When** muitas mensagens aparecem, **Then** sistema mantém performance sem lag
- [ ] **Given** entro na sessão, **When** carrego chat, **Then** vejo histórico das últimas 50 mensagens

#### Definition of Done:
- [ ] Tabela `chat_messages` com real-time subscriptions
- [ ] ChatInterface component com auto-scroll e emoji support
- [ ] Moderation tools para streamers
- [ ] Basic auto-moderation (profanity filter)
- [ ] Message history loading
- [ ] Rate limiting por usuário
- [ ] Mobile chat interface otimizada

**Priority:** Média  
**Complexity:** 4 story points  
**Dependencies:** Sistema de Perfis, Supabase Realtime

---

### Story 6: Dashboard Analytics para Streamers
**Como** streamer  
**Eu quero** ver métricas detalhadas das minhas sessões  
**Para que** eu possa entender minha audiência e melhorar meu conteúdo

#### Acceptance Criteria:
- [ ] **Given** acesso dashboard, **When** visualizo métricas, **Then** vejo stats de viewers únicos, tempo médio, filmes mais votados
- [ ] **Given** seleciono período, **When** filtro dados, **Then** dashboard atualiza com métricas do período escolhido
- [ ] **Given** preciso comparar, **When** visualizo trends, **Then** vejo crescimento/declínio de engajamento
- [ ] **Given** quero insights, **When** acesso recommendations, **Then** sistema sugere melhorias baseadas nos dados
- [ ] **Given** preciso reportar, **When** exporto dados, **Then** recebo relatório completo em formato utilizável

#### Definition of Done:
- [ ] Views/queries otimizadas para analytics
- [ ] StreamerDashboard component com charts e métricas
- [ ] Time-range filtering e comparisons
- [ ] Data visualization com recharts/similar
- [ ] Export functionality (CSV/PDF)
- [ ] Mobile-friendly dashboard
- [ ] Caching para performance das queries

**Priority:** Baixa  
**Complexity:** 3 story points  
**Dependencies:** Histórico de Sessões, Sistema de Votação

---

## 🗺️ Feature Roadmap

### Fase 1: MVP Database Foundation (2-3 semanas)
**Timeline:** Sprint 1-2
- [ ] Story: Sistema de Perfis de Usuário
- [ ] Story: Persistência e Gestão de Filmes  
- [ ] Story: Histórico de Sessões e Tracking (básico)

### Fase 2: Interactive Features (2-3 semanas)
**Timeline:** Sprint 3-4
- [ ] Story: Sistema de Votação Real-Time
- [ ] Story: Chat da Comunidade
- [ ] Story: Histórico de Sessões (completo com analytics)

### Fase 3: Advanced Analytics (1-2 semanas)
**Timeline:** Sprint 5
- [ ] Story: Dashboard Analytics para Streamers

## 🎨 UI/UX Requirements

### Design Requirements
- **Gaming Theme:** Manter paleta purple/blue/cyan com efeitos neon, gradientes gaming, cards com glow effects
- **Responsiveness:** Todas interfaces devem funcionar perfeitamente em mobile (viewers assistem pelo celular)
- **Accessibility:** Alto contraste, keyboard navigation, screen reader support para inclusività
- **Performance:** Carregamento < 2s para dados críticos, real-time updates < 500ms

### Component Requirements
- **Novos Componentes:** ProfileCard, MovieLibrary, VotingInterface, ChatInterface, StreamerDashboard, SessionHistory
- **Componentes Existentes:** Modificar MovieRoulette para integrar com BD, Navigation para profile access
- **shadcn/ui:** Utilizar Dialog, Sheet, Table, Chart, Badge, Avatar, Card, Tabs para consistência visual

## 🔧 Technical Requirements

### Frontend Requirements
- **State Management:** Zustand/Context para profile data, React Query para server state, real-time subscriptions
- **API Integration:** Supabase client com typed queries, error boundaries, retry logic
- **Real-time:** Supabase subscriptions para votes e chat, optimistic updates para UX
- **Offline Support:** Basic caching com React Query, graceful degradation quando offline

### Backend Requirements
- **Database:** PostgreSQL via Supabase com RLS policies rigorosas, indexes otimizados para queries frequentes
- **APIs:** Supabase REST/GraphQL auto-generated, custom functions para business logic complexa
- **Authentication:** Row Level Security baseado em auth.uid, role-based access (streamer vs viewer)
- **Performance:** Connection pooling, query optimization, CDN para assets

### Integration Requirements
- **OBS Studio:** Database pronta para overlay data fetching, WebSocket connections para real-time
- **External APIs:** TMDB integration para movie metadata, image optimization service
- **Real-time:** Supabase Realtime para chat, votes, session status, com fallback polling

## 📊 Success Metrics

### Métricas de Adoção
- **Target:** 95% dos usuários com perfis criados automaticamente após login
- **Timeline:** Imediato após implementação
- **Tracking:** Profile creation rate, profile completion rate

### Métricas de Engajamento
- **KPI Principal:** Average session participation rate (voting + chat activity)
- **KPIs Secundários:** Movies added per streamer, repeat viewer rate, chat messages per session
- **Benchmarks:** Atual: 0% (localStorage apenas), Target: 60% participation rate

### Métricas Técnicas
- **Performance:** < 2s database queries, < 500ms real-time updates, 99.9% uptime
- **Reliability:** Zero data loss, automatic failover, backup strategies
- **Scalability:** Suportar 100 concurrent sessions, 1000+ concurrent users

## 🧪 Testing Strategy

### Testing Approach
- [ ] **Unit Testing:** All database operations, validation logic, hooks, utils functions
- [ ] **Integration Testing:** Supabase client operations, real-time subscriptions, auth flows
- [ ] **E2E Testing:** Complete user journeys: profile creation → movie management → session participation
- [ ] **Performance Testing:** Database query performance, concurrent user simulation

### User Acceptance Testing
- [ ] **Streamer Testing:** Movie library management, session control, moderation tools
- [ ] **Viewer Testing:** Profile creation, voting workflow, chat participation  
- [ ] **Browser Testing:** Chrome, Firefox, Safari, Edge compatibility
- [ ] **Mobile Testing:** iOS Safari, Android Chrome, responsive behavior

## 🚧 Risks & Mitigation

### Technical Risks
- **Risk:** Supabase RLS policies blocking legitimate operations
  - **Impact:** Alto
  - **Probability:** Médio  
  - **Mitigation:** Extensive testing, policy documentation, admin override capabilities

- **Risk:** Real-time performance degradation with high concurrent users
  - **Impact:** Alto
  - **Probability:** Médio
  - **Mitigation:** Connection pooling, rate limiting, progressive enhancement fallbacks

- **Risk:** Data migration complexity from localStorage to database
  - **Impact:** Médio
  - **Probability:** Baixo
  - **Mitigation:** Gradual migration tools, data validation, backup strategies

### Product Risks
- **Risk:** Users resistant to account creation requirement  
  - **Impact:** Médio
  - **Probability:** Baixo
  - **Mitigation:** Streamlined signup flow, clear value communication, guest mode for basic features

- **Risk:** Real-time features increasing infrastructure costs significantly
  - **Impact:** Médio  
  - **Probability:** Médio
  - **Mitigation:** Usage monitoring, optimization strategies, tiered feature access

## 📝 Notes & Assumptions

### Assumptions
- Supabase free tier será suficiente para MVP testing e desenvolvimento inicial
- Usuários preferem persistent data sobre performance (aceitável trade-off de localStorage para database)
- Real-time features são critical differentiator versus simple movie picker tools

### Open Questions
- [ ] Quantos concurrent viewers por sessão devemos suportar inicialmente?
- [ ] Rate limiting policies para voting e chat - quais são os limites aceitáveis?
- [ ] Data retention policy - por quanto tempo manter histórico de sessões e chat?
- [ ] Backup e disaster recovery strategy para dados críticos de usuários?

---

**Próximo passo:** Enviar estas stories para o **System Architect Agent** para análise arquitetural e criação do plano técnico detalhado com database schema, APIs, e implementation roadmap.