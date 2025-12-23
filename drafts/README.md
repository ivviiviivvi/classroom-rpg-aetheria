# Drafts & Iterations

This directory contains draft documents, work-in-progress features, experimental implementations, and version history.

## 📝 Contents

### Implementation Drafts
- **IMPLEMENTATION_SUMMARY.md** - Summary of implementation approaches and decisions

### Purpose

This section houses:
- Draft documents before they become official
- Experimental feature implementations
- Alternative approaches and prototypes
- Historical versions of documents
- Brainstorming and ideation materials
- Requirements gathering and specifications (PRD drafts)

## 🎯 Usage Guidelines

### When to Use /drafts/

- **Early Stage Work**: Documents still being refined
- **Experimental Features**: Code or designs being tested
- **Alternative Approaches**: Different solutions to explore
- **Version History**: Keeping track of how ideas evolved

### Organization

Files in this directory should be organized by:
- **Feature area** (e.g., `quest-system/`, `ui-redesign/`)
- **Stage** (e.g., `v1-draft/`, `v2-iteration/`)
- **Date** (e.g., `2025-12-planning/`)

### Lifecycle

```
Draft → Review → Refinement → Finalization → Move to appropriate location
```

**Draft** files eventually become:
- Official documentation (moved to `/docs/`)
- Production features (merged into `/src/`)
- Research findings (moved to `/research/`)
- Archived (if not pursued)

## 📋 Current Drafts

- Implementation summaries and decision logs
- Feature specifications in development

## 🔄 Integration Process

### Draft → Production Flow

1. **Creation**: Initial draft created in this directory
2. **Iteration**: Refinements and feedback incorporated
3. **Review**: Team evaluates readiness for production
4. **Migration**: Move to appropriate final location
5. **Archive**: Keep in `/drafts/archive/` if needed for reference

### Best Practices

- ✅ Use clear version numbers or dates
- ✅ Include status in document header (Draft, Review, Ready)
- ✅ Link to related issues or discussions
- ✅ Update this README when adding significant drafts
- ✅ Clean up obsolete drafts periodically

## 🗂️ Archive

Old drafts that are no longer active should be moved to `/drafts/archive/` with context about their fate (implemented, abandoned, superseded).

## 🔗 Related Directories

- [/research/](../research/) - Research and analysis
- [/satellites/](../satellites/) - Auxiliary functionality
- [/src/](../src/) - Production code
- [/docs/](../docs/) - Official documentation
