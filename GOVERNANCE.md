# Repository Governance & Best Practices

This document outlines the governance structure, policies, and best practices for the Classroom RPG: Aetheria repository.

## 📋 Table of Contents

- [Repository Settings](#repository-settings)
- [Branch Protection](#branch-protection)
- [Labels and Milestones](#labels-and-milestones)
- [Security Policies](#security-policies)
- [Code Review Process](#code-review-process)
- [Release Management](#release-management)

## 🔧 Repository Settings

### Recommended Settings

#### General
- **Description**: Clear, concise project description
- **Topics**: Add relevant topics for discoverability
  - `education`, `gamification`, `react`, `typescript`, `rpg`, `classroom`, `learning`, `github-spark`
- **Website**: Link to deployment or documentation
- **Features**:
  - ✅ Issues enabled
  - ✅ Projects enabled
  - ✅ Discussions enabled (recommended)
  - ⚠️ Wiki (optional, use docs/ instead)

#### Pull Requests
- ✅ Allow merge commits
- ✅ Allow squash merging (default)
- ✅ Allow rebase merging
- ✅ Automatically delete head branches
- ✅ Allow auto-merge
- ⚠️ Require approval before merging (see branch protection)

## 🛡️ Branch Protection

### Main Branch Protection Rules

The `main` branch should have the following protection rules enabled:

#### Required Reviews
- ✅ Require pull request reviews before merging
- **Required approving reviews**: 1
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners (CODEOWNERS file)

#### Status Checks
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- **Required status checks**:
  - `lint` (CI workflow)
  - `build` (CI workflow)
  - `type-check` (CI workflow)
  - `CodeQL` (security scanning)

#### Additional Rules
- ✅ Require conversation resolution before merging
- ✅ Require signed commits (recommended)
- ✅ Require linear history (optional)
- ✅ Include administrators (enforce rules for admins)
- ⚠️ Restrict who can push to matching branches (org only)

### Development Branches

Development branches (e.g., `develop`, `staging`) should have lighter protection:
- Require pull request reviews: Yes
- Required approving reviews: 1
- Require status checks: Yes
- Allow force pushes: No
- Allow deletions: No

## 🏷️ Labels and Milestones

### Standard Labels

#### Type Labels
- `bug` - Something isn't working (red)
- `enhancement` - New feature or request (blue)
- `documentation` - Improvements or additions to documentation (cyan)
- `question` - Further information is requested (purple)
- `chore` - Maintenance tasks (gray)

#### Priority Labels
- `priority: critical` - Critical priority (red)
- `priority: high` - High priority (orange)
- `priority: medium` - Medium priority (yellow)
- `priority: low` - Low priority (green)

#### Status Labels
- `status: blocked` - Blocked by another issue (red)
- `status: in-progress` - Currently being worked on (yellow)
- `status: needs-review` - Needs review from maintainers (blue)
- `status: ready` - Ready for implementation (green)
- `stale` - No recent activity (gray)

#### Area Labels
- `area: frontend` - Frontend related (blue)
- `area: backend` - Backend related (green)
- `area: ci-cd` - CI/CD related (orange)
- `area: video-production` - Video production features (purple)

#### Special Labels
- `good first issue` - Good for newcomers (green)
- `help wanted` - Extra attention is needed (green)
- `security` - Security related (red)
- `dependencies` - Dependency updates (cyan)
- `needs-triage` - Needs initial triage (yellow)

### Milestones

Create milestones for:
- Version releases (e.g., `v1.0.0`, `v1.1.0`)
- Feature sets (e.g., `Quest System`, `Character Creation`)
- Sprints or iterations (e.g., `Sprint 1`, `Q1 2024`)

## 🔒 Security Policies

### Security Features to Enable

1. **Dependabot Alerts**: ✅ Enabled
2. **Dependabot Security Updates**: ✅ Enabled
3. **Dependabot Version Updates**: ✅ Enabled (via `.github/dependabot.yml`)
4. **Code Scanning (CodeQL)**: ✅ Enabled (via workflow)
5. **Secret Scanning**: ✅ Enabled (if available)
6. **Security Policy**: ✅ Present (`SECURITY.md`)

### Security Best Practices

- Never commit secrets or credentials
- Use environment variables for sensitive data
- Keep dependencies up to date
- Review Dependabot PRs promptly
- Run CodeQL on all PRs
- Use signed commits (recommended)
- Enable 2FA for all contributors

## 🔍 Code Review Process

### Review Requirements

1. **All code changes** must go through pull requests
2. **At least one approval** required before merge
3. **All CI checks** must pass
4. **All conversations** must be resolved
5. **Code owners** must approve changes to their areas

### Review Guidelines

#### For Authors
- Write clear PR descriptions
- Keep PRs focused and small
- Respond to feedback promptly
- Update PR as needed
- Ensure all CI checks pass

#### For Reviewers
- Review code promptly (within 2 business days)
- Provide constructive feedback
- Test changes locally if needed
- Approve only when confident
- Request changes if necessary

### Review Checklist

- [ ] Code follows project style guidelines
- [ ] Changes are well-documented
- [ ] Tests are included and passing
- [ ] No security vulnerabilities introduced
- [ ] Performance implications considered
- [ ] Accessibility requirements met
- [ ] Breaking changes documented

## 📦 Release Management

### Versioning

Follow [Semantic Versioning](https://semver.org/) (SemVer):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes

Example: `v1.2.3`

### Release Process

1. **Create release branch**: `release/vX.Y.Z`
2. **Update version numbers**: `package.json`, etc.
3. **Update CHANGELOG.md**: Document all changes
4. **Create PR**: Target `main` branch
5. **Review and test**: Ensure everything works
6. **Merge PR**: Use merge commit (not squash)
7. **Create GitHub Release**: Tag `vX.Y.Z`
8. **Publish**: Deploy to production (if applicable)

### Changelog Format

Follow [Keep a Changelog](https://keepachangelog.com/):

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing features

### Deprecated
- Features to be removed

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security fixes
```

## 🤝 Contribution Workflow

1. **Fork** the repository
2. **Create branch**: `feature/your-feature` or `fix/your-fix`
3. **Make changes**: Follow coding standards
4. **Commit**: Use conventional commits
5. **Push**: Push to your fork
6. **Create PR**: Use PR template
7. **Address feedback**: Respond to review comments
8. **Merge**: Maintainer merges when approved

## 📊 Repository Metrics

Track these metrics:

- **Open issues** and PRs
- **Time to first response**
- **Time to merge**
- **Code coverage**
- **Dependency health**
- **Security alerts**

## 🔄 Continuous Improvement

This governance document should be:

- Reviewed quarterly
- Updated as needed
- Discussed with community
- Adapted to project needs

## 📚 Additional Resources

- [GitHub Best Practices](https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

Last Updated: 2024-12-23
