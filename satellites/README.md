# Satellite Projects & Utilities

This directory contains auxiliary functionalities, tools, and features that operate alongside the main application but are not core to the primary user experience.

## 🛰️ What are Satellites?

Satellites are:
- **Autonomous tools** that support the main project
- **Auxiliary features** that can be developed independently
- **Utilities and scripts** for developers and maintainers
- **Supporting services** that enhance the project ecosystem

## 📦 Current Satellites

### Video Production System
**Location**: `/satellites/video-production/`

A complete autonomous video production pipeline for creating promotional and educational content.

**Features**:
- Script parsing with timecode detection
- Text-to-speech audio generation
- Automated visual generation with FFmpeg
- GitHub Actions integration for automated workflows

**Quick Start**: See [video-production/README.md](video-production/README.md)

### Portfolio Video Generator
**Location**: `/satellites/portfolio/`

Specialized video generator for creating project portfolio presentations.

**Features**:
- Portfolio-specific scripts and storyboards
- Custom visual templates
- Automated generation workflows

**Quick Start**: See [portfolio/README.md](portfolio/README.md)

## 🎯 Satellite Guidelines

### When to Create a Satellite

Create a satellite project when:
- ✅ The functionality is useful but not part of core user experience
- ✅ It can be developed and maintained independently
- ✅ It has its own dependencies or build process
- ✅ It could potentially be extracted as a separate tool

### Structure

Each satellite should have:
```
satellites/
├── satellite-name/
│   ├── README.md           # Complete documentation
│   ├── package.json        # Dependencies (if applicable)
│   ├── src/                # Source code
│   ├── tests/              # Tests
│   └── docs/               # Additional documentation
```

### Integration

Satellites should:
- ✅ Be independently runnable
- ✅ Have clear documentation
- ✅ Include setup and usage instructions
- ✅ Specify dependencies and requirements
- ✅ Provide both manual and automated execution methods

## 🔄 Development Workflow

### Creating a New Satellite

1. **Plan**: Define scope and purpose
2. **Create**: Set up directory structure
3. **Document**: Write comprehensive README
4. **Develop**: Build the functionality
5. **Test**: Ensure reliability
6. **Integrate**: Add to automation (if applicable)
7. **Announce**: Update this index

### Best Practices

- Keep satellites focused on a single purpose
- Minimize coupling with main application
- Document all dependencies clearly
- Provide examples and usage guides
- Include error handling and logging
- Consider CI/CD integration

## 🚀 Running Satellites

### Video Production

```bash
# Manual execution
python3 satellites/video-production/video_production_agent.py

# Or via GitHub Actions
# Actions → Generate Portfolio Videos → Run workflow
```

### Adding Your Own Satellite

1. Create a new directory in `/satellites/`
2. Add comprehensive README.md
3. Implement your functionality
4. Update this index file
5. Add CI/CD workflows if needed

## 📊 Satellite Status

| Satellite | Status | Last Updated | Maintainer |
|-----------|--------|--------------|------------|
| video-production | ✅ Active | 2025-12 | Team |
| portfolio | ✅ Active | 2025-12 | Team |

## 🔗 Related Directories

- [/research/](../research/) - Research and analysis
- [/drafts/](../drafts/) - Work in progress
- [/src/](../src/) - Core application code
- [/.github/workflows/](../.github/workflows/) - CI/CD automation

## 💡 Ideas for Future Satellites

Potential satellite projects:
- Analytics dashboard
- Content migration tools
- Accessibility testing suite
- Performance monitoring
- Backup and restore utilities
- Development environment setup scripts
