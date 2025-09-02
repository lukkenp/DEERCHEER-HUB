# CLAUDE.md Automation Guidelines

## 🎯 System Overview

CLAUDE.md é o arquivo central que orienta todos os Claude Code agents sobre o projeto. Para manter sua precisão, criamos um sistema semi-automatizado de updates integrado ao workflow de desenvolvimento.

## 🔄 Update Triggers (Quando Atualizar)

### 1. ✅ **Phase Completion** - OBRIGATÓRIO
**Trigger:** Quando uma fase é movida para `completed/`
**Responsible:** System Architect Agent
**Action:** Update agent priorities, feature status, remove blockers

### 2. 🏗️ **Architecture Changes** - OBRIGATÓRIO  
**Trigger:** Database schema, API changes, new file structure
**Responsible:** System Architect Agent (via architecture-plan.md)
**Action:** Update technical specifications, file locations

### 3. 🔧 **Agent Role Changes** - RECOMENDADO
**Trigger:** Agent completes major responsibilities or new priorities emerge
**Responsible:** Any implementing agent can suggest, System Architect approves
**Action:** Update agent descriptions and priorities

### 4. 🚀 **Feature Integration** - CONFORME NECESSÁRIO
**Trigger:** New routes, components, or development commands
**Responsible:** Implementing agents suggest, System Architect decides
**Action:** Update routing, component organization, development notes

## 🛠️ Automation Workflow

### For System Architect Agent:
```markdown
1. In architecture-plan.md, ALWAYS include "CLAUDE.md Update Requirements" section
2. Specify exact sections that need updating with before/after text
3. List impact on other agents' priorities
4. Use claude-md-update.md template for complex updates
```

### For Implementation Agents:
```markdown
1. Note any new patterns/structures created during implementation
2. Report completion of features mentioned in CLAUDE.md limitations
3. Suggest priority changes for other agents based on new capabilities
4. Document integration points that affect other agents
```

### For All Agents:
```markdown
BEFORE starting work:
- ✅ Check current priorities in CLAUDE.md
- ✅ Understand feature status and limitations
- ✅ Note which other agents may be affected

DURING work:
- 🔄 Document new patterns/files created
- 🔄 Note when limitations are resolved
- 🔄 Identify impacts on other agents

AFTER completing work:
- ✅ Report feature status changes
- ✅ Suggest CLAUDE.md updates if significant changes made
- ✅ Update PROJECT-STATUS.md with completion
```

## 📋 Update Checklist

### High Priority Updates (Must Update):
- [ ] Agent completion status (❌ → ✅)
- [ ] Feature blockers removed
- [ ] Database/architecture status changes
- [ ] New critical file locations
- [ ] Development command changes

### Medium Priority Updates (Should Update):
- [ ] Agent priority reordering
- [ ] Feature capability descriptions
- [ ] Component organization changes
- [ ] Routing updates
- [ ] Authentication flow changes

### Low Priority Updates (Optional):
- [ ] Development notes refinements
- [ ] Limitation list updates
- [ ] Performance considerations
- [ ] Minor pattern documentation

## 🚀 Implementation Strategy

### Semi-Automated Approach:
1. **System Architect Agent** is primary owner of CLAUDE.md updates
2. **All agents** suggest updates via clear proposals
3. **Templates** ensure consistent update format
4. **PROJECT-STATUS.md** tracks when updates are needed

### Automation Tools:
- ✅ **Templates:** claude-md-update.md for systematic updates
- ✅ **Checklists:** Built into architecture-plan.md template
- ✅ **Tracking:** PROJECT-STATUS.md monitors update needs
- ✅ **Guidelines:** This document for reference

## 📊 Update Validation

### Before Applying Updates:
- [ ] All agent statuses accurate
- [ ] Feature descriptions match implementation
- [ ] No conflicting information between sections
- [ ] Next steps align with PROJECT-STATUS.md
- [ ] Development commands tested

### After Applying Updates:
- [ ] Update PROJECT-STATUS.md with CLAUDE.md update completion
- [ ] Archive update template in appropriate phase/completed/
- [ ] Notify affected agents of priority changes
- [ ] Test development commands still work

## 💡 Best Practices

### For Efficiency:
- ⚡ **Batch Updates:** Group related changes in single update
- ⚡ **Template Usage:** Always use claude-md-update.md for complex changes
- ⚡ **Clear Proposals:** Provide exact before/after text in proposals

### For Accuracy:
- 🎯 **Verify Implementation:** Only update status after actual completion
- 🎯 **Cross-Reference:** Ensure consistency with PROJECT-STATUS.md
- 🎯 **Test Commands:** Verify development commands still work after updates

### For Clarity:
- 📝 **Specific Changes:** Be precise about what sections need updating
- 📝 **Impact Assessment:** Consider how changes affect other agents
- 📝 **Future Focus:** Ensure "Next Steps" reflect actual priorities

## 🚨 Common Pitfalls to Avoid

❌ **Don't update CLAUDE.md without completing actual work**
❌ **Don't make updates that contradict PROJECT-STATUS.md**  
❌ **Don't forget to update agent priorities when phases complete**
❌ **Don't skip the architecture-plan.md CLAUDE.md section**
❌ **Don't update without considering impact on other agents**

✅ **Do use templates for systematic updates**
✅ **Do coordinate updates through System Architect Agent**
✅ **Do test development commands after updates**
✅ **Do maintain consistency across documentation files**

---

**Remember:** CLAUDE.md is the single source of truth for all agents. Keeping it accurate and up-to-date is critical for project success and agent coordination.

*Este sistema foi projetado para ser semi-automatizado - estruturado o suficiente para ser consistente, mas flexível o suficiente para se adaptar às necessidades do projeto.*