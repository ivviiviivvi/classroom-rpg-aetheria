# 🎮 Classroom RPG: Aetheria

[![CI](https://github.com/ivviiviivvi/classroom-rpg-aetheria/actions/workflows/ci.yml/badge.svg)](https://github.com/ivviiviivvi/classroom-rpg-aetheria/actions/workflows/ci.yml)
[![CodeQL](https://github.com/ivviiviivvi/classroom-rpg-aetheria/actions/workflows/codeql.yml/badge.svg)](https://github.com/ivviiviivvi/classroom-rpg-aetheria/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An innovative educational RPG platform built with React, TypeScript, and GitHub Spark, designed to gamify classroom learning experiences.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Classroom RPG: Aetheria transforms traditional classroom activities into engaging role-playing game experiences. Students embark on educational quests, earn experience points, and develop their characters while learning core curriculum concepts.

### Key Objectives

- **Engagement**: Increase student participation through gamification
- **Learning**: Reinforce educational concepts through interactive gameplay
- **Collaboration**: Foster teamwork and social learning
- **Progress Tracking**: Provide clear feedback on learning achievements

## ✨ Features

### Core Features

- 🎯 **Quest System**: Transform lessons into engaging quests
- 👥 **Character Creation**: Customizable student avatars
- 📊 **Progress Tracking**: Real-time learning analytics
- 🏆 **Achievement System**: Rewards for milestones and accomplishments
- 🎨 **Modern UI**: Built with Radix UI and Tailwind CSS
- ⚡ **Fast Development**: Vite-powered with hot module replacement

### Video Production Features

- 🎬 **Autonomous Video Production**: Generate professional MP4 videos from scripts
- 🗣️ **Text-to-Speech**: Local TTS audio generation (espeak)
- 🎥 **Automated Visuals**: FFmpeg-powered visual generation
- ⏱️ **Timeline Sync**: Precise timecode synchronization
- 🤖 **GitHub Actions**: Automated video generation workflows

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **Git**
- **Python 3.11+** (for video production features)
- **FFmpeg** (for video production features)

### Installation

1. **Clone the repository**

\`\`\`bash
git clone https://github.com/ivviiviivvi/classroom-rpg-aetheria.git
cd classroom-rpg-aetheria
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Start development server**

\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:5173\`

### Quick Commands

\`\`\`bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run optimize     # Optimize dependencies

# Utilities
npm run kill         # Kill process on port 5000
\`\`\`

## 📖 Documentation

### Project Documentation

- [**CONTRIBUTING.md**](CONTRIBUTING.md) - How to contribute to the project
- [**CODE_OF_CONDUCT.md**](CODE_OF_CONDUCT.md) - Community guidelines
- [**SUPPORT.md**](SUPPORT.md) - Getting help and support
- [**SECURITY.md**](SECURITY.md) - Security policies and reporting
- [**CHANGELOG.md**](CHANGELOG.md) - Version history and changes
- [**TECHNICAL_ROADMAP.md**](TECHNICAL_ROADMAP.md) - Future plans and roadmap

### Video Production

- [**VIDEO_PRODUCTION_QUICKSTART.md**](VIDEO_PRODUCTION_QUICKSTART.md) - Quick start guide
- [**VIDEO_PRODUCTION_README.md**](VIDEO_PRODUCTION_README.md) - Complete documentation
- [**PORTFOLIO_VIDEO_SCRIPT.md**](PORTFOLIO_VIDEO_SCRIPT.md) - Example script

### Additional Resources

- [**docs/**](docs/) - Detailed documentation and guides
- [**GitHub Discussions**](https://github.com/ivviiviivvi/classroom-rpg-aetheria/discussions) - Community discussions
- [**GitHub Issues**](https://github.com/ivviiviivvi/classroom-rpg-aetheria/issues) - Bug reports and feature requests

## 🛠️ Development

### Technology Stack

#### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animations

#### Backend & Tools
- **Python 3.11+** - Video production automation
- **FFmpeg** - Video rendering
- **GitHub Actions** - CI/CD automation

### Project Structure

\`\`\`
classroom-rpg-aetheria/
├── .github/              # GitHub configuration
│   ├── ISSUE_TEMPLATE/   # Issue templates
│   ├── PULL_REQUEST_TEMPLATE/ # PR templates
│   └── workflows/        # GitHub Actions workflows
├── src/                  # Source code
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── styles/           # Global styles
│   └── assets/           # Static assets
├── docs/                 # Documentation
├── video_output/         # Generated videos (gitignored)
└── public/               # Public assets
\`\`\`

### Development Workflow

1. Create a feature branch: \`git checkout -b feature/your-feature\`
2. Make your changes
3. Run linter: \`npm run lint\`
4. Build: \`npm run build\`
5. Commit: Follow [Conventional Commits](https://www.conventionalcommits.org/)
6. Push and create a pull request

### Code Quality

We use several tools to maintain code quality:

- **ESLint** - JavaScript/TypeScript linting
- **TypeScript** - Type checking
- **Pre-commit hooks** - Automated checks before commits
- **EditorConfig** - Consistent coding styles
- **Prettier** - Code formatting (via ESLint)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Code of Conduct
- Development setup
- Coding standards
- Commit message guidelines
- Pull request process

### Good First Issues

New to the project? Look for issues labeled:

- \`good first issue\` - Perfect for newcomers
- \`help wanted\` - Extra attention needed
- \`documentation\` - Documentation improvements

## 🎬 Video Production

### Quick Start

\`\`\`bash
# Generate videos locally
python3 video_production_agent.py

# Or use GitHub Actions
# Go to: Actions → Generate Portfolio Videos → Run workflow
\`\`\`

### Features

✅ Script parsing with timecode detection  
✅ Local TTS audio generation (espeak)  
✅ Automated visual generation (FFmpeg)  
✅ Timeline synchronization  
✅ MP4 rendering (1920x1080@30fps)  
✅ GitHub Actions integration

See [VIDEO_PRODUCTION_README.md](VIDEO_PRODUCTION_README.md) for complete documentation.

## 🔒 Security

Security is a top priority. If you discover a security vulnerability:

- **DO NOT** open a public issue
- Follow our [Security Policy](SECURITY.md)
- Report privately to the maintainers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

\`\`\`
MIT License

Copyright GitHub, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
\`\`\`

## 🙏 Acknowledgments

- Built with [GitHub Spark](https://githubnext.com/projects/github-spark)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/) and [Phosphor Icons](https://phosphoricons.com/)

## 📧 Contact & Support

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For questions and community interaction
- **Email**: See repository settings for maintainer contact

## 🗺️ Roadmap

See our [Technical Roadmap](TECHNICAL_ROADMAP.md) for planned features and improvements.

---

**Made with ❤️ for educators and students**

*Transforming classrooms into adventures, one quest at a time.*
