# 🎮 Classroom RPG: Aetheria

[![CI](https://github.com/ivviiviivvi/classroom-rpg-aetheria/actions/workflows/ci.yml/badge.svg)](https://github.com/ivviiviivvi/classroom-rpg-aetheria/actions/workflows/ci.yml)
[![CodeQL](https://github.com/ivviiviivvi/classroom-rpg-aetheria/actions/workflows/codeql.yml/badge.svg)](https://github.com/ivviiviivvi/classroom-rpg-aetheria/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An innovative educational RPG platform built with React, TypeScript, and GitHub Spark, designed to gamify classroom learning experiences.

> 🏖️ **Try the Sandbox**: [Explore with demo data](https://ivviiviivvi.github.io/classroom-rpg-aetheria/?sandbox=true) - Safe environment for testing and exploration
> 
> 🎬 **NEW**: [Portfolio Video Presentation](#-portfolio-video) - A 25-minute comprehensive video showcasing the platform for investors and employers

## 📋 Table of Contents

- [Overview](#overview)
- [Sandbox Environment](#-sandbox-environment)
- [Portfolio Video](#-portfolio-video)
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

## 🏖️ Sandbox Environment

### Try It Now!

**Explore the platform safely with demo data**: [Launch Sandbox Mode](https://ivviiviivvi.github.io/classroom-rpg-aetheria/?sandbox=true)

The Sandbox Environment provides a safe, isolated space for external users to explore Classroom RPG: Aetheria without affecting real classroom data.

### What is Sandbox Mode?

- ✅ **Isolated Demo Data**: All changes are completely separate from real classrooms
- ✅ **Pre-populated Content**: 3 demo realms, 4 sample quests, and example progress
- ✅ **Risk-Free Exploration**: Try all features without consequences
- ✅ **Easy Reset**: Restore to defaults with one click
- ✅ **Visual Indicators**: Clear banner shows you're in sandbox mode

### Perfect For:

- 🎯 **Product Demonstrations**: Showcase to potential schools or investors
- 📚 **Teacher Training**: Experience the platform before classroom use
- 🧪 **Feature Testing**: Try changes safely before production
- 🔍 **User Research**: Gather feedback without risk
- 🎬 **Video Production**: Record demos with consistent data

### Quick Access:

```bash
# Any URL with sandbox parameter activates demo mode
?sandbox=true
?demo=true
```

**Complete Documentation**: See [SANDBOX_GUIDE.md](SANDBOX_GUIDE.md) for detailed usage instructions.

## 🎬 Portfolio Video

### Watch the Presentation

A comprehensive 25-minute video presentation showcasing Classroom RPG: Aetheria for potential investors and employers. The video demonstrates:

- **Business Problem**: 40% dropout rate in online learning platforms
- **Strategic Insight**: Applying game design psychology to education
- **Platform Solution**: AI-powered quest system with real-time feedback
- **Impact Analysis**: Time savings, engagement metrics, and measurable outcomes
- **Technical Approach**: Systems thinking and human-centered design

**Video Details:**
- 📹 **Duration**: 25 minutes 42 seconds (1542 seconds)
- 🎥 **Quality**: Full HD 1080p @ 30fps
- 🗣️ **Audio**: Computer-generated narration
- 📊 **Content**: 45 scenes covering problem, solution, and impact

### How to Access

**Quick Start: Generate the Video Locally (Recommended)**
```bash
# Make the script executable (first time only)
chmod +x generate_video.sh

# Generate the portfolio video (handles dependencies and environment setup)
./generate_video.sh

# Video will be created in: video_output/PORTFOLIO_VIDEO_SCRIPT_video.mp4
```

**Advanced: Manual Generation with Custom Configuration**
```bash
# Install dependencies (Linux/Ubuntu)
sudo apt-get install -y ffmpeg espeak espeak-data fonts-dejavu-core

# Set environment variables for custom configuration
export REPO_ROOT="$(pwd)"
export SCRIPT_DIR="$(pwd)/satellites/portfolio"
export SCRIPT_PATTERN="*SCRIPT*.md"
export VIDEO_OUT_DIR="$(pwd)/video_output"
export VIDEO_RESOLUTION="1920x1080"
export FPS="30"

# Run video production agent
python3 satellites/video-production/video_production_agent.py
```

**Option 2: Use GitHub Actions**
1. Go to **Actions** → **Generate Portfolio Videos**
2. Click **Run workflow**
3. Download video from workflow artifacts

**Option 3: Pre-built Version**
Check the [Releases](../../releases) section for pre-generated videos.

### Complete Documentation

- 📖 **[VIDEO_PRESENTATION_GUIDE.md](VIDEO_PRESENTATION_GUIDE.md)** - Complete video documentation
- 📝 **[Portfolio Video Script](satellites/portfolio/PORTFOLIO_VIDEO_SCRIPT.md)** - Full narration script
- 🎨 **[Storyboard](satellites/portfolio/PORTFOLIO_VIDEO_STORYBOARD.md)** - Visual specifications
- ⚙️ **[Production Agent](satellites/video-production/video_production_agent.py)** - Automation script

### Usage Tips

**For Job Applications:**
- Include video link in portfolio websites
- Share on LinkedIn profile
- Use in follow-up communications
- Perfect for product/strategy roles

**For Investor Pitches:**
- First 4:30 minutes = executive summary
- Full video = comprehensive technical detail
- Demonstrates strategic thinking capability

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

```bash
git clone https://github.com/ivviiviivvi/classroom-rpg-aetheria.git
cd classroom-rpg-aetheria
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Quick Commands

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run optimize     # Optimize dependencies

# Utilities
npm run kill         # Kill process on port 5000
```

## 📖 Documentation

### Project Documentation

- [**ORGANIZATION.md**](ORGANIZATION.md) - 📁 Repository structure and file organization guide
- [**CONTRIBUTING.md**](CONTRIBUTING.md) - How to contribute to the project
- [**CODE_OF_CONDUCT.md**](CODE_OF_CONDUCT.md) - Community guidelines
- [**SUPPORT.md**](SUPPORT.md) - Getting help and support
- [**SECURITY.md**](SECURITY.md) - Security policies and reporting
- [**CHANGELOG.md**](CHANGELOG.md) - Version history and changes
- [**TECHNICAL_ROADMAP.md**](TECHNICAL_ROADMAP.md) - Future plans and roadmap

### Development Guides

- [**docs/guides/DEVELOPMENT_WORKFLOW.md**](docs/guides/DEVELOPMENT_WORKFLOW.md) - Ingestion → Digestion → Implementation process
- [**docs/guides/RESEARCH_GUIDELINES.md**](docs/guides/RESEARCH_GUIDELINES.md) - How to contribute research

### Organized Sections

- 🔬 [**research/**](research/) - Research, analysis, and evaluation documents
- 📝 [**drafts/**](drafts/) - Work in progress, iterations, and experimental features
- 🛰️ [**satellites/**](satellites/) - Auxiliary tools and utilities
  - [Video Production](satellites/video-production/) - Autonomous video generation
  - [Portfolio Videos](satellites/portfolio/) - Portfolio presentation generator

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

```
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
├── docs/                 # Technical documentation
│   └── guides/           # Development guides and workflows
├── research/             # 🔬 Research, analysis, and evaluations
├── drafts/               # 📝 Work in progress and iterations
├── satellites/           # 🛰️ Auxiliary tools and utilities
│   ├── video-production/ # Autonomous video generation
│   └── portfolio/        # Portfolio video generator
└── public/               # Public assets
```

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run linter: `npm run lint`
4. Build: `npm run build`
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

- `good first issue` - Perfect for newcomers
- `help wanted` - Extra attention needed
- `documentation` - Documentation improvements

## 🎬 Video Production

### Quick Start

```bash
# Generate videos locally
python3 video_production_agent.py

# Or use GitHub Actions
# Go to: Actions → Generate Portfolio Videos → Run workflow
```

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

```
MIT License

Copyright GitHub, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

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
