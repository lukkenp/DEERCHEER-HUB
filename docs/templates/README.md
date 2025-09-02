# Process Templates - DEERCHEER HUB

Este diretório contém templates para o processo de desenvolvimento estruturado usando os agentes orquestradores.

## 📋 Templates Disponíveis

### 1. `brainstorm.md`
**Uso:** Input inicial para qualquer nova feature ou ideia  
**Propósito:** Capturar ideias, requisitos e contexto de forma estruturada  
**Próximo passo:** Enviar para Product Manager Agent

### 2. `stories.md`
**Uso:** Output do Product Manager Agent  
**Propósito:** User stories estruturadas com critérios de aceitação  
**Próximo passo:** Enviar para System Architect Agent

### 3. `architecture-plan.md`
**Uso:** Output do System Architect Agent  
**Propósito:** Plano técnico detalhado para implementação  
**Próximo passo:** Distribuir tasks para agentes especializados

## 🔄 Fluxo de Utilização

```
1. Usuário cria brainstorm.md
   ↓
2. Product Manager Agent → stories.md
   ↓
3. System Architect Agent → architecture-plan.md
   ↓
4. Agentes Especializados implementam
```

## 📝 Como Usar

### Para Features Grandes:
1. Copie `brainstorm.md` para `docs/features/[feature-name]/`
2. Preencha com suas ideias e contexto
3. Use Product Manager Agent para criar stories
4. Use System Architect Agent para criar plano técnico
5. Implemente usando agentes especializados

### Para Features Pequenas:
1. Use input direto para Product Manager Agent
2. System Architect Agent faz análise rápida
3. Implemente diretamente com agente especializado

## 📁 Estrutura Recomendada

```
docs/
├── features/
│   ├── feature-name-1/
│   │   ├── brainstorm.md
│   │   ├── stories.md
│   │   └── architecture-plan.md
│   └── feature-name-2/
│       ├── brainstorm.md
│       ├── stories.md
│       └── architecture-plan.md
└── templates/ (este diretório)
```

## ✅ Checklist de Processo

### Antes de Começar:
- [ ] Ideia clara do problema a resolver
- [ ] Contexto sobre usuários afetados (streamers/viewers)
- [ ] Alinhamento com objetivos do DEERCHEER HUB

### Durante o Planejamento:
- [ ] Brainstorm completo e estruturado
- [ ] User stories com critérios de aceitação claros
- [ ] Plano arquitetural validado
- [ ] Tasks distribuídas para agentes corretos

### Durante a Implementação:
- [ ] Seguir o plano arquitetural
- [ ] Manter consistência com padrões existentes
- [ ] Testar integração entre componentes
- [ ] Documentar mudanças importantes

### Após a Implementação:
- [ ] Validar contra critérios de aceitação
- [ ] Testar com cenários reais de streaming
- [ ] Atualizar documentação
- [ ] Coletar feedback para próximas iterações

## 🎯 Dicas de Boas Práticas

1. **Seja Específico:** Quanto mais detalhado o brainstorm, melhores as stories
2. **Pense no Usuário:** Sempre considere impacto em streamers e viewers
3. **Considere Performance:** Streaming requer baixa latência e alta performance
4. **Integração OBS:** Pense em como features afetam overlays e integração
5. **Mobile First:** Viewers frequentemente usam mobile
6. **Real-time:** Muitas features precisam de updates em tempo real

## 🚀 Exemplos

Veja os exemplos reais em `docs/features/` conforme o projeto evolui.