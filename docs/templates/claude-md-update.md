# CLAUDE.md Update Template

## Phase Information
**Phase Name**: [e.g., Frontend Integration]
**Completion Date**: [YYYY-MM-DD]
**Triggering Event**: [Phase completion / Architecture change / etc.]

## Required Updates

### 1. Agent Status Updates
**Completed Agents:**
- [ ] Agent Name → Status change (✅ COMPLETED / 🔄 IN PROGRESS / ❌ BLOCKED)
- [ ] Update priority levels and descriptions

**New Agent Priorities:**
- [ ] List agents that become high priority after this phase
- [ ] Update agent descriptions with new capabilities

### 2. Feature Status Updates
**Newly Available Features:**
- [ ] Feature Name - Description of new capability
- [ ] Update "Features Ready for Integration" vs "Features Requiring Backend"

**Architecture Changes:**
- [ ] Database schema updates (if applicable)
- [ ] New API endpoints or services
- [ ] Authentication/security changes

### 3. Project Structure Updates
**New Files/Directories:**
- [ ] Key new files that should be documented
- [ ] Component structure changes
- [ ] Configuration updates

**Routing Changes:**
- [ ] New routes added
- [ ] Route protection changes
- [ ] Special overlay routes

### 4. Next Development Phase
**Updated Limitations & Next Steps:**
- [ ] Remove completed limitations
- [ ] Add new development priorities
- [ ] Update phase progression plan

**Development Commands Updates:**
- [ ] New scripts or commands
- [ ] Environment requirements
- [ ] Build/deployment changes

## Specific Sections to Update

### Agent Priorities Section
```markdown
### 🛠️ [Agent Name] → Status
- Current capabilities
- Recent completions
- Next priorities
```

### Features Section
```markdown
#### [New Status] Features
- **Feature Name**: Updated description
- **Integration Status**: Current state
```

### Database Architecture Section
```markdown
### Database Architecture Status
**Current Status**: Updated description
**New Capabilities**: [List additions]
```

### Next Steps Section
```markdown
### Next Development Phase: [Phase Name]
1. **Priority 1**: Updated priority
2. **Priority 2**: New focus area
```

## Automation Checklist

### For System Architect Agent:
- [ ] Include CLAUDE.md update proposal in architecture-plan.md
- [ ] Specify exact sections to update
- [ ] Provide before/after text for key changes
- [ ] List impact on other agents' priorities

### For Implementation Agents:
- [ ] Note any new patterns or file structures created
- [ ] Document integration points with existing code
- [ ] Report completion of features mentioned in CLAUDE.md

## Update Validation

### Before Merging Updates:
- [ ] All agent statuses accurately reflect current state
- [ ] Feature descriptions match actual implementation
- [ ] Next steps align with PROJECT-STATUS.md
- [ ] No conflicting information between sections
- [ ] Development commands tested and working

### Post-Update Actions:
- [ ] Update PROJECT-STATUS.md with CLAUDE.md update completion
- [ ] Archive this update template in appropriate phase/completed/ folder
- [ ] Notify relevant agents of priority changes

---

**Template Usage**: Copy this template when System Architect Agent identifies CLAUDE.md updates needed
**Responsibility**: System Architect Agent proposes, Implementation Agents provide input, Project Lead approves