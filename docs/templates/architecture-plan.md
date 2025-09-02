# Architecture Plan - [Feature Name]

**Data:** [Data de criação]  
**System Architect:** [Nome]  
**Based on Stories:** [Link ou referência para as user stories]  
**Status:** [Draft/Review/Approved]

## 🎯 Architecture Overview

**Feature Summary:** [Breve descrição da feature]  
**Technical Complexity:** [Baixa/Média/Alta]  
**Integration Scope:** [Componentes que serão afetados]

## 📊 Database Architecture

### New Tables Required

#### Table: `[table_name]`
```sql
CREATE TABLE [table_name] (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  [column_name] [data_type] [constraints],
  [column_name] [data_type] [constraints],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** [Por que esta tabela é necessária]  
**Relationships:** [Como se relaciona com outras tabelas]  
**Indexes:** [Índices necessários para performance]

#### Table: `[another_table]` (se necessário)
```sql
-- Schema SQL aqui
```

### Table Modifications

#### Modify: `existing_table`
```sql
-- ALTER statements necessários
ALTER TABLE existing_table ADD COLUMN [new_column] [type];
```

**Reason:** [Por que a modificação é necessária]  
**Impact:** [Impacto em código existente]  
**Migration:** [Estratégia de migração]

### Database Relationships
```
[table_1] → [relationship] → [table_2]
[table_3] ← [relationship] ← [table_4]
```

## 🔌 API Architecture

### New REST Endpoints

#### `POST /api/[resource]`
**Purpose:** [Para que serve este endpoint]  
**Authentication:** [Required/Optional + role]  
**Request:**
```typescript
interface CreateRequest {
  [property]: [type];
  [property]: [type];
}
```

**Response:**
```typescript
interface CreateResponse {
  id: string;
  [property]: [type];
  created_at: string;
}
```

**Validation:** [Regras de validação]  
**Error Handling:** [Tipos de erro possíveis]

#### `GET /api/[resource]`
**Purpose:** [Para que serve]  
**Authentication:** [Required/Optional + role]  
**Query Parameters:**
- `limit`: number (default: 20, max: 100)
- `offset`: number (default: 0)
- `filter`: string (optional)

**Response:**
```typescript
interface ListResponse {
  data: ResourceItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}
```

#### `PUT /api/[resource]/:id`
**Purpose:** [Para que serve]  
**Authentication:** [Required + role]  
**Request & Response:** [Schemas]

### GraphQL Schema (se aplicável)
```graphql
type [TypeName] {
  id: ID!
  [field]: [Type]
  [field]: [Type]
  createdAt: DateTime!
}

extend type Query {
  [queryName]([args]): [TypeName]
}

extend type Mutation {
  [mutationName]([args]): [TypeName]
}
```

### Real-time Subscriptions

#### WebSocket Events
```typescript
// Subscription channels needed
interface SubscriptionChannels {
  '[feature]:[event]': {
    payload: [PayloadType];
    auth: [AuthLevel];
  };
}
```

**Usage:** [Como será usado no frontend]  
**Performance:** [Considerações de performance]

## 🎨 Frontend Architecture

### New Components

#### `[ComponentName]`
**Location:** `src/components/[ComponentName].tsx`  
**Purpose:** [O que o componente faz]  
**Props:**
```typescript
interface ComponentProps {
  [prop]: [type];
  [prop]: [type];
  onAction?: (data: [Type]) => void;
}
```

**State Management:** [Estado local vs global]  
**Styling:** [Classes Tailwind específicas]  
**Dependencies:** [Hooks/componentes que usa]

### Modified Components

#### `ExistingComponent`
**Changes Required:**
- [Mudança 1 necessária]
- [Mudança 2 necessária]
- [Nova prop/funcionalidade]

**Impact:** [Componentes filhos afetados]

### New Hooks

#### `use[HookName]`
**Location:** `src/hooks/use[HookName].ts`  
**Purpose:** [Lógica que encapsula]
```typescript
interface HookReturn {
  [property]: [type];
  [method]: ([params]) => [return_type];
}
```

**Dependencies:** [APIs/estado que usa]

### State Management

#### Global State Changes
**Context:** [Qual context será afetado]  
**New State:**
```typescript
interface [StateInterface] {
  [property]: [type];
  [property]: [type];
}
```

**Actions:**
```typescript
interface [ActionsInterface] {
  [actionName]: ([params]) => Promise<[return]>;
  [actionName]: ([params]) => void;
}
```

#### Local Component State
- **Component:** `[ComponentName]` - **State:** `[state description]`
- **Component:** `[ComponentName]` - **State:** `[state description]`

## 🔐 Security & Permissions

### Authentication Requirements
- **Route Protection:** [Rotas que precisam de auth]
- **API Protection:** [Endpoints que precisam de auth]
- **Role-based Access:** [Diferentes níveis de acesso]

### Row Level Security (RLS)
```sql
-- Policies necessárias
CREATE POLICY "[policy_name]" ON [table_name]
FOR [operation] TO [role]
USING ([condition]);
```

### Data Validation
- **Frontend:** [Validação no cliente]
- **Backend:** [Validação no servidor]
- **Database:** [Constraints de integridade]

## 🚀 Integration Plan

### Phase 1: Backend Foundation
**Estimated Time:** [X days]
**Agent:** Backend & Database Agent

**Tasks:**
- [ ] Create database migrations
- [ ] Implement REST APIs
- [ ] Set up authentication/permissions
- [ ] Configure real-time subscriptions (if needed)
- [ ] Write API tests

**Dependencies:** [O que precisa estar pronto antes]

### Phase 2: Frontend Core
**Estimated Time:** [X days]  
**Agent:** Frontend & UI Agent (shadcn-ui-builder)

**Tasks:**
- [ ] Create new components with gaming theme
- [ ] Implement state management hooks
- [ ] Integrate with APIs
- [ ] Add responsive design
- [ ] Implement error handling

**Dependencies:** Phase 1 completion

### Phase 3: Streaming Integration
**Estimated Time:** [X days]  
**Agent:** Streaming Features Agent

**Tasks:**
- [ ] Integrate with streaming dashboard
- [ ] Add OBS overlay support (if applicable)
- [ ] Implement real-time features
- [ ] Add hotkey support (if needed)
- [ ] Test with streaming scenarios

**Dependencies:** Phases 1 & 2 completion

### Phase 4: Advanced Features
**Estimated Time:** [X days]  
**Agent:** [Specific agent depending on features]

**Tasks:**
- [ ] [Advanced feature 1]
- [ ] [Advanced feature 2]
- [ ] Performance optimizations
- [ ] Mobile optimizations (if needed)

**Dependencies:** Core functionality complete

## 📊 Performance Considerations

### Database Performance
- **Indexes:** [Índices necessários para queries eficientes]
- **Query Optimization:** [Queries que podem ser lentas]
- **Connection Pooling:** [Configurações de pool]

### Frontend Performance
- **Bundle Impact:** [Impacto no tamanho do bundle]
- **Lazy Loading:** [Componentes para lazy load]
- **Memoization:** [Componentes/funções para memoizar]

### Real-time Performance
- **WebSocket Optimization:** [Otimizações de WebSocket]
- **Event Throttling:** [Eventos que precisam de throttle]
- **Memory Management:** [Preocupações de memória]

## 🧪 Testing Strategy

### Backend Testing
- [ ] **Unit Tests:** API endpoints and business logic
- [ ] **Integration Tests:** Database interactions
- [ ] **API Tests:** Full request/response cycle

### Frontend Testing
- [ ] **Component Tests:** Individual component behavior
- [ ] **Hook Tests:** Custom hooks functionality
- [ ] **Integration Tests:** Component + API interaction

### E2E Testing
- [ ] **Critical Paths:** [Fluxos críticos a testar]
- [ ] **Edge Cases:** [Cenários edge importantes]
- [ ] **Performance Tests:** [Testes de carga se necessário]

## ⚠️ Risk Analysis

### Technical Risks
- **High Risk:** [Risco alto identificado]
  - **Mitigation:** [Como vamos mitigar]
  - **Contingency:** [Plano B se necessário]

- **Medium Risk:** [Risco médio identificado]
  - **Mitigation:** [Como vamos mitigar]

### Integration Risks
- **External Dependencies:** [Dependências externas]
- **Breaking Changes:** [Mudanças que podem quebrar funcionalidades]
- **Performance Impact:** [Impacto na performance existente]

## 📋 Agent Task Distribution

### 🛠️ Backend & Database Agent
**Priority:** [High/Medium/Low]  
**Estimated Effort:** [X story points]

**Specific Tasks:**
- [ ] [Task específica com detalhes]
- [ ] [Task específica com detalhes]
- [ ] [Task específica com detalhes]

**Notes:** [Considerações específicas para o backend agent]

### 🎨 Frontend & UI Agent (shadcn-ui-builder)
**Priority:** [High/Medium/Low]  
**Estimated Effort:** [X story points]

**Specific Tasks:**
- [ ] [Task específica com detalhes]
- [ ] [Task específica com detalhes]
- [ ] [Task específica com detalhes]

**Design Requirements:** [Requisitos específicos de design]

### ⚡ Streaming Features Agent
**Priority:** [High/Medium/Low]  
**Estimated Effort:** [X story points]

**Specific Tasks:**
- [ ] [Task específica com detalhes]
- [ ] [Task específica com detalhes]

**Integration Points:** [Pontos de integração específicos]

### 🔐 Authentication & Security Agent (se aplicável)
**Priority:** [High/Medium/Low]  
**Estimated Effort:** [X story points]

**Specific Tasks:**
- [ ] [Task relacionada a segurança]
- [ ] [Task relacionada a autenticação]

## 📝 Implementation Notes

### Code Standards
- [Padrões específicos para esta feature]
- [Convenções de naming]
- [Estruturas de arquivo recomendadas]

### Documentation Requirements
- [ ] API documentation updates
- [ ] Component documentation
- [ ] User guide updates (if needed)
- [ ] Developer setup instructions

### Deployment Considerations
- **Environment Variables:** [Novas variáveis necessárias]
- **Migration Strategy:** [Como fazer deploy sem quebrar]
- **Rollback Plan:** [Como fazer rollback se necessário]

## 📝 CLAUDE.md Update Requirements

**Update Needed:** [Yes/No - based on architecture changes]

### Sections to Update:
- [ ] **Agent Priorities:** [Update specific agent priorities/status]
- [ ] **Feature Status:** [Update "Features Ready" vs "Limitations & Next Steps"]
- [ ] **Database Architecture:** [Update database status description]
- [ ] **Authentication System:** [Update auth integration status]
- [ ] **Project Structure:** [Update key files or component organization]
- [ ] **Routing Structure:** [New routes or route changes]
- [ ] **Development Commands:** [New scripts or environment requirements]

### Specific Updates Required:
```markdown
### Before:
[Current CLAUDE.md text that needs updating]

### After:
[Proposed new text for CLAUDE.md]
```

### Impact on Other Agents:
- **Agent Name:** [How this affects their priorities or capabilities]
- **Agent Name:** [New responsibilities or completed tasks]

**CLAUDE.md Update Template:** Use `docs/templates/claude-md-update.md` for systematic updates

---

**Status:** Ready for implementation by specialized agents  
**Next Step:** 1) Apply CLAUDE.md updates, 2) Distribute tasks to appropriate agents