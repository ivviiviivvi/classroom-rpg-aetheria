# Portfolio Video Satellite

Specialized video generation system for creating portfolio presentations and promotional content for Classroom RPG: Aetheria.

## 🎯 Overview

This satellite extends the base video production system with portfolio-specific templates, scripts, and workflows for creating professional project presentations.

## 📚 Documentation

- **[PORTFOLIO_VIDEO_INDEX.md](./PORTFOLIO_VIDEO_INDEX.md)** - Documentation index
- **[PORTFOLIO_VIDEO_README.md](./PORTFOLIO_VIDEO_README.md)** - Complete guide
- **[PORTFOLIO_VIDEO_QUICKSTART.md](./PORTFOLIO_VIDEO_QUICKSTART.md)** - Quick start
- **[PORTFOLIO_VIDEO_SCRIPT.md](./PORTFOLIO_VIDEO_SCRIPT.md)** - Example script
- **[PORTFOLIO_VIDEO_STORYBOARD.md](./PORTFOLIO_VIDEO_STORYBOARD.md)** - Visual planning

## 🚀 Quick Start

### Prerequisites

The portfolio satellite uses the video-production engine. Ensure you have:
- Video production satellite set up
- Python 3.11+
- FFmpeg and espeak installed

### Generate Portfolio Video

```bash
# From repository root
python3 satellites/video-production/video_production_agent.py \
  --script satellites/portfolio/PORTFOLIO_VIDEO_SCRIPT.md
```

### Via GitHub Actions

1. Navigate to **Actions** → **Generate Portfolio Videos**
2. Click **Run workflow**
3. Select branch and options
4. Download artifacts when complete

## 📝 Script Templates

### Creating a New Portfolio Script

1. Copy `PORTFOLIO_VIDEO_SCRIPT.md` as a template
2. Edit timecodes and content
3. Review `PORTFOLIO_VIDEO_STORYBOARD.md` for visual planning
4. Generate video using video-production satellite

### Script Format

```markdown
# Portfolio Video Script

**00:00** - Introduction and hook
**00:05** - Problem statement
**00:10** - Solution overview
**00:15** - Key features demonstration
**00:20** - Technical highlights
**00:25** - Call to action
```

## 🎨 Features

- ✅ Portfolio-optimized templates
- ✅ Project showcase scripts
- ✅ Visual storyboards
- ✅ Professional presentation format
- ✅ Integrated with main video production
- ✅ GitHub Actions automation

## 📁 Structure

```
satellites/portfolio/
├── README.md                         # This file
├── PORTFOLIO_VIDEO_INDEX.md          # Documentation index
├── PORTFOLIO_VIDEO_README.md         # Complete documentation
├── PORTFOLIO_VIDEO_QUICKSTART.md     # Quick start guide
├── PORTFOLIO_VIDEO_SCRIPT.md         # Example script
├── PORTFOLIO_VIDEO_STORYBOARD.md     # Visual planning
└── PORTFOLIO_VIDEO_CONFIG.env.example # Configuration template
```

## 🔧 Configuration

Copy the example config and customize:

```bash
cp PORTFOLIO_VIDEO_CONFIG.env.example PORTFOLIO_VIDEO_CONFIG.env
# Edit with your settings
```

## 🎬 Use Cases

### Project Presentations
- Investor pitches
- Conference talks
- Demo days
- Team showcases

### Marketing Content
- Product launches
- Feature announcements
- Social media content
- Website videos

### Educational Content
- Tutorial videos
- Explainer content
- Course materials
- Documentation videos

## 🔄 Workflow

1. **Plan**: Review storyboard and outline content
2. **Script**: Write or adapt script with timecodes
3. **Generate**: Run video production with script
4. **Review**: Check output quality
5. **Iterate**: Refine script and regenerate
6. **Publish**: Use final video in portfolio/marketing

## 🔗 Integration

Works seamlessly with:
- [Video Production Satellite](../video-production/) - Core generation engine
- [GitHub Actions](../../.github/workflows/generate_videos.yml) - Automation
- [Main Documentation](../../docs/) - Project docs

## 💡 Tips

- Keep scripts concise (30-60 seconds typical)
- Use clear, action-oriented language
- Plan visuals with storyboard first
- Test audio timing before final render
- Iterate based on feedback

## 📊 Examples

See the included example files:
- `PORTFOLIO_VIDEO_SCRIPT.md` - Full script example
- `PORTFOLIO_VIDEO_STORYBOARD.md` - Visual planning example

## 🐛 Troubleshooting

### Video Generation Issues

Refer to the [video-production README](../video-production/README.md#troubleshooting) for common issues.

### Custom Script Not Found

Ensure script path is correct:
```bash
ls -la satellites/portfolio/PORTFOLIO_VIDEO_SCRIPT.md
```

## 🤝 Contributing

To contribute new scripts or improve templates:

1. Create script in this directory
2. Test generation locally
3. Document any new patterns
4. Submit PR with description

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for general guidelines.

## 📄 License

Part of Classroom RPG: Aetheria - MIT License

---

**Status**: ✅ Active  
**Last Updated**: 2025-12  
**Maintainer**: Classroom RPG Team
