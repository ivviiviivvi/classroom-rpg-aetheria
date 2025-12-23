# Contributing to Classroom RPG: Aetheria

First off, thank you for considering contributing to Classroom RPG: Aetheria! It's people like you that make this project such a great tool for education and engagement.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the repository maintainers.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment (see below)
4. Create a new branch for your changes
5. Make your changes
6. Test your changes
7. Submit a pull request

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Python 3.11+ (for video production features)
- FFmpeg (for video production features)

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/classroom-rpg-aetheria.git
cd classroom-rpg-aetheria

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Detailed steps to reproduce the issue
- Expected behavior vs. actual behavior
- Screenshots or code samples if applicable
- Your environment (OS, Node version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a detailed description of the proposed feature
- Explain why this enhancement would be useful
- Include mockups or examples if applicable

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `documentation` - Documentation improvements

## Coding Standards

### TypeScript/JavaScript

- Follow ESLint configuration provided in the project
- Use TypeScript for type safety
- Use functional components with hooks in React
- Follow React best practices and hooks rules
- Use meaningful variable and function names
- Write self-documenting code with comments where necessary

### Python

- Follow PEP 8 style guide
- Use Python 3.11+ features
- Add type hints where applicable
- Write docstrings for functions and classes

### File Organization

The repository is organized into clear sections:

```
classroom-rpg-aetheria/
├── src/              # Production source code
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions and helpers
│   ├── styles/       # Global styles
│   └── assets/       # Static assets
├── research/         # 🔬 Research, analysis, evaluations
├── drafts/           # 📝 Work in progress, iterations
├── satellites/       # 🛰️ Auxiliary tools and utilities
│   ├── video-production/  # Video generation system
│   └── portfolio/         # Portfolio videos
└── docs/             # Technical documentation
    └── guides/       # Development workflow guides
```

**Where should my contribution go?**

- **Research & Analysis**: Upload to `/research/` (see [Research Guidelines](docs/guides/RESEARCH_GUIDELINES.md))
- **Draft Specifications**: Place in `/drafts/` until finalized
- **Production Code**: Implement in `/src/`
- **Supporting Tools**: Create in `/satellites/` if independent
- **Documentation**: Add to `/docs/`

**Development Process**: See [Development Workflow](docs/guides/DEVELOPMENT_WORKFLOW.md) for the full Ingestion → Digestion → Implementation process.

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system or dependency changes
- `ci`: CI/CD configuration changes
- `chore`: Other changes that don't modify src or test files

### Examples

```
feat(game): add character customization options

fix(ui): resolve dialog rendering issue on mobile

docs(readme): update installation instructions

chore(deps): update react to version 19.0.0
```

## Pull Request Process

1. **Update Documentation**: Update the README.md or relevant docs with details of changes
2. **Update Tests**: Add or update tests as needed
3. **Follow Style Guide**: Ensure code follows project style guidelines
4. **Run Linter**: Run `npm run lint` before submitting
5. **Build Successfully**: Ensure `npm run build` completes without errors
6. **Descriptive PR**: Write a clear PR description explaining:
   - What changes were made
   - Why the changes were needed
   - How to test the changes
   - Related issues (use "Closes #issue-number")

7. **PR Template**: Fill out the pull request template completely
8. **Review Process**: Address review comments promptly
9. **Squash Commits**: Consider squashing commits for cleaner history

### PR Title Format

Use the same format as commit messages:

```
feat(scope): brief description
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

- Write tests for new features and bug fixes
- Maintain or improve code coverage
- Use descriptive test names
- Follow existing test patterns in the codebase
- Test edge cases and error conditions

## Documentation

### Code Documentation

- Add JSDoc comments for functions and components
- Include parameter and return type documentation
- Explain complex logic with inline comments
- Keep comments up-to-date with code changes

### User Documentation

- Update README.md for user-facing changes
- Add usage examples for new features
- Update configuration documentation
- Create or update guides in the docs/ folder

## Questions?

If you have questions or need help:

1. Check existing documentation
2. Search closed issues for similar questions
3. Open a new issue with the `question` label
4. See [SUPPORT.md](SUPPORT.md) for additional resources

## Recognition

Contributors will be recognized in:

- The project's README.md
- Release notes for significant contributions
- The project's contributors page on GitHub

Thank you for contributing to Classroom RPG: Aetheria! 🎮✨
