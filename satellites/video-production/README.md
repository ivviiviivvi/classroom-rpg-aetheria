# Video Production Satellite

Autonomous video production pipeline for creating promotional and educational content for Classroom RPG: Aetheria.

## 🎬 Overview

This satellite provides a complete video generation system that transforms scripts into professional MP4 videos with:
- Text-to-speech audio generation
- Automated visual generation using FFmpeg
- Timeline synchronization with timecodes
- GitHub Actions integration

## 🚀 Quick Start

See [VIDEO_PRODUCTION_QUICKSTART.md](./VIDEO_PRODUCTION_QUICKSTART.md) for a rapid introduction.

### Local Execution

```bash
# From repository root
python3 satellites/video-production/video_production_agent.py

# Or use the convenience script
bash satellites/video-production/run_video_production.sh
```

### GitHub Actions

1. Go to **Actions** tab
2. Select **Generate Portfolio Videos** workflow
3. Click **Run workflow**
4. Download generated videos from workflow artifacts

## 📚 Documentation

- **[VIDEO_PRODUCTION_README.md](./VIDEO_PRODUCTION_README.md)** - Complete documentation
- **[VIDEO_PRODUCTION_QUICKSTART.md](./VIDEO_PRODUCTION_QUICKSTART.md)** - Quick start guide
- **[VIDEO_PRODUCTION_SUMMARY.md](./VIDEO_PRODUCTION_SUMMARY.md)** - Technical summary

## ✨ Features

✅ **Script Parsing**: Automatic timecode detection and scene extraction  
✅ **Text-to-Speech**: Local audio generation using espeak  
✅ **Visual Generation**: FFmpeg-powered video rendering  
✅ **Timeline Sync**: Precise audio-visual synchronization  
✅ **MP4 Output**: Production-ready videos (1920x1080@30fps)  
✅ **CI/CD Integration**: Automated generation via GitHub Actions

## 🔧 Requirements

### Local Development
- Python 3.11+
- FFmpeg
- espeak (for TTS)
- Required Python packages (see requirements below)

### Python Dependencies
```bash
pip install pillow
```

### System Dependencies
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg espeak

# macOS
brew install ffmpeg espeak
```

## 📖 Usage Examples

### Basic Video Generation

```bash
# Generate from default script
python3 video_production_agent.py
```

### Custom Script

Create a markdown file with timecode markers:

```markdown
# My Video Script

**00:00** - Opening scene text
**00:05** - Next scene text
**00:10** - Final scene text
```

## 🎯 Script Format

Scripts use markdown with special timecode syntax:

```markdown
**MM:SS** - Scene description and dialogue
```

Example:
```markdown
**00:00** - Welcome to Classroom RPG: Aetheria!
**00:05** - Transform your classroom into an adventure.
**00:10** - Get started today!
```

## 🔄 Integration

This satellite integrates with:
- GitHub Actions for automated generation
- Main repository for script sources
- Artifact storage for video outputs

## 📁 Project Structure

```
satellites/video-production/
├── README.md                          # This file
├── video_production_agent.py          # Main script
├── run_video_production.sh           # Convenience launcher
├── VIDEO_PRODUCTION_README.md        # Complete documentation
├── VIDEO_PRODUCTION_QUICKSTART.md    # Quick start guide
└── VIDEO_PRODUCTION_SUMMARY.md       # Technical summary
```

## 🐛 Troubleshooting

### FFmpeg Not Found
```bash
# Install FFmpeg
sudo apt-get install ffmpeg  # Linux
brew install ffmpeg          # macOS
```

### Espeak Not Found
```bash
# Install espeak
sudo apt-get install espeak  # Linux
brew install espeak          # macOS
```

### Python Dependencies
```bash
pip install -r ../../requirements.txt
```

## 🔗 Related

- [Portfolio Satellite](../portfolio/) - Portfolio-specific video generation
- [Main Documentation](../../docs/) - Project documentation
- [GitHub Actions Workflows](../../.github/workflows/generate_videos.yml) - CI/CD automation

## 📝 License

Part of Classroom RPG: Aetheria - MIT License

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

---

**Status**: ✅ Active and maintained  
**Last Updated**: 2025-12  
**Maintainer**: Classroom RPG Team
