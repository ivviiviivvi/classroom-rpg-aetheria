# Research Contribution Guidelines

This guide explains how to contribute research, analysis, and evaluation documents to the Classroom RPG: Aetheria project.

## 🎯 Purpose

Research documents help the team:
- Make informed decisions about features and architecture
- Understand user needs and pain points
- Evaluate product-market fit
- Identify opportunities and risks
- Validate design choices
- Track competitive landscape

## 📚 Types of Research

### 1. User Research
- User interviews and surveys
- Usability testing results
- User personas and journey maps
- Behavioral analytics
- Feature usage statistics

### 2. Market Research
- Competitive analysis
- Market trends and opportunities
- Industry benchmarks
- Pricing and business model analysis

### 3. Technical Research
- Architecture evaluations
- Performance benchmarks
- Technology comparisons
- Security audits
- Accessibility audits

### 4. Design Research
- Design system evaluations
- UI/UX critiques
- Visual design analysis
- Interaction pattern studies

### 5. Educational Research
- Pedagogical effectiveness studies
- Learning outcome assessments
- Gamification impact analysis
- Curriculum alignment reviews

## 📝 Document Structure

### Required Sections

Every research document should include:

```markdown
# [Research Title]

**Date**: YYYY-MM-DD
**Author**: Name or Team
**Type**: [User Research | Market Research | Technical | etc.]
**Status**: [Draft | In Review | Published]

## Executive Summary
[2-3 paragraph overview of key findings]

## Background
[Context and motivation for the research]

## Methodology
[How the research was conducted]

## Findings
[Detailed results and observations]

## Recommendations
[Actionable next steps]

## Appendix
[Supporting data, charts, raw data]
```

### Optional Sections
- Related Work
- Limitations
- Future Research
- References

## 📥 Submission Process

### Step 1: Prepare Your Document

1. **Choose appropriate filename**
   ```
   [TYPE]_[descriptive-name]_[YYYY-MM].md
   
   Examples:
   - STUDY_onboarding-usability_2025-12.md
   - ANALYSIS_competitive-lms-features_2025-12.md
   - BENCHMARK_page-load-performance_2025-12.md
   - AUDIT_accessibility-wcag_2025-12.md
   ```

2. **Include metadata at top**
   ```markdown
   ---
   title: "Onboarding Usability Study"
   date: 2025-12-23
   author: "UX Research Team"
   type: "User Research"
   status: "Published"
   related_issues: [#42, #58]
   ---
   ```

3. **Add supporting files**
   - Create subdirectory if you have images, data files, etc.
   - Example: `/research/onboarding-study-2025-12/`
   - Keep main document as `README.md` or named file in that directory

### Step 2: Upload to Repository

**Option A: Via Pull Request (Recommended)**

1. Fork the repository (if external contributor)
2. Create a branch: `research/your-research-name`
3. Add your document to `/research/`
4. Update `/research/README.md` index
5. Commit with message: `docs(research): add [research title]`
6. Create pull request with description of research

**Option B: Via GitHub Web Interface**

1. Navigate to `/research/` directory
2. Click "Add file" → "Create new file"
3. Name your file appropriately
4. Paste content
5. Commit with descriptive message

### Step 3: Update Index

Add entry to `/research/README.md`:

```markdown
## 📊 Current Research

- ✅ [Your Research Title](./YOUR_FILE.md) - Brief description (YYYY-MM)
```

### Step 4: Create Discussion

1. Go to GitHub Discussions
2. Create new discussion in "Research" category
3. Link to your research document
4. Summarize key findings
5. Ask for feedback or questions

## ✅ Quality Standards

### Required Elements
- ✅ Clear, descriptive title
- ✅ Date and author information
- ✅ Executive summary
- ✅ Methodology explained
- ✅ Findings presented clearly
- ✅ Actionable recommendations
- ✅ Proper formatting (Markdown)
- ✅ Links to related issues/PRs

### Best Practices
- ✅ Use data visualization (charts, graphs) when appropriate
- ✅ Include direct quotes from users (anonymized)
- ✅ Link to raw data or appendices
- ✅ Cite sources for external information
- ✅ Be objective and evidence-based
- ✅ Include both positive and negative findings
- ✅ Consider limitations and biases

### Avoid
- ❌ Opinions without evidence
- ❌ Identifying information about users
- ❌ Proprietary or confidential data
- ❌ Overly technical jargon without explanation
- ❌ Conclusions without supporting data

## 🔍 Review Process

### Peer Review

1. **Initial Review** (within 1 week)
   - Maintainer checks format and completeness
   - Assigns reviewers from relevant teams
   - Research tagged with `needs-review` label

2. **Team Review** (1-2 weeks)
   - Reviewers evaluate methodology and findings
   - Discussion in GitHub Discussions
   - Feedback provided via PR comments

3. **Final Approval** (by sprint end)
   - Lead approves for merging
   - Research marked as "Published"
   - Team notified in stand-up or slack

### Criteria for Approval
- ✅ Methodology is sound
- ✅ Findings are well-supported
- ✅ Recommendations are actionable
- ✅ Document is well-structured
- ✅ No confidential information leaked
- ✅ Formatting is correct

## 🔗 Integration with Development

### Research → Action

Research should lead to:

1. **Issues Created**
   - Tag issues with `research-backed` label
   - Link to research document
   - Quote relevant findings

2. **Roadmap Updates**
   - Prioritize features based on research
   - Update technical roadmap
   - Adjust product strategy

3. **Design Changes**
   - Iterate on designs
   - Update design system
   - Improve UX flows

4. **Documentation Updates**
   - Update user guides
   - Revise onboarding
   - Clarify features

### Tracking Impact

- Note which issues stem from research
- Track implementation in CHANGELOG.md
- Measure outcomes post-implementation
- Conduct follow-up research

## 📊 Research Templates

### User Interview Template

```markdown
# User Interview: [Participant ID]

**Date**: YYYY-MM-DD
**Duration**: XX minutes
**Role**: [Student | Teacher | Admin]
**Experience Level**: [New | Intermediate | Expert]

## Background
- How long using the platform
- Primary use cases
- Context of use

## Questions & Responses
[Organized by theme]

## Key Insights
- [Insight 1]
- [Insight 2]

## Quotes
> "[Notable quote]" - Participant ID

## Follow-up Actions
- [ ] Action item 1
```

### Benchmark Template

```markdown
# Performance Benchmark: [Feature Name]

**Date**: YYYY-MM-DD
**Environment**: [Development | Staging | Production]
**Tool**: [Lighthouse | WebPageTest | etc.]

## Metrics
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Load Time | Xms | Yms | ❌/✅ |
| FCP | Xms | Yms | ❌/✅ |

## Analysis
[What the numbers mean]

## Recommendations
[How to improve]
```

### Competitive Analysis Template

```markdown
# Competitive Analysis: [Competitor Name]

**Date**: YYYY-MM-DD
**Competitor**: [Name]
**Market Position**: [Leader | Challenger | Niche]

## Overview
[Brief description]

## Features Comparison
| Feature | Aetheria | Competitor | Advantage |
|---------|----------|------------|-----------|
| Feature 1 | ✅ | ✅ | = |
| Feature 2 | ❌ | ✅ | Them |

## Strengths & Weaknesses
**Their Strengths**: ...
**Their Weaknesses**: ...
**Our Opportunities**: ...

## Key Takeaways
[What we can learn]
```

## 🤝 Collaboration

### Working with Teams

- **Design Team**: Share UX research and usability findings
- **Engineering Team**: Provide technical benchmarks and audits
- **Product Team**: Deliver market research and user insights
- **Education Team**: Supply pedagogical research and efficacy studies

### Research Projects

For larger research initiatives:
1. Create project in GitHub Projects
2. Break down into phases
3. Track progress with issues
4. Regular updates in discussions
5. Final report in `/research/`

## 📞 Questions?

- Post in [GitHub Discussions](https://github.com/ivviiviivvi/classroom-rpg-aetheria/discussions)
- Tag maintainers in your PR
- Check [SUPPORT.md](../../SUPPORT.md)

## 🎓 Resources

- [DEVELOPMENT_WORKFLOW.md](../guides/DEVELOPMENT_WORKFLOW.md) - Full development process
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - General contribution guidelines
- [Code of Conduct](../../CODE_OF_CONDUCT.md) - Community standards

---

**Thank you for contributing research to make Aetheria better! 🎮📚**
