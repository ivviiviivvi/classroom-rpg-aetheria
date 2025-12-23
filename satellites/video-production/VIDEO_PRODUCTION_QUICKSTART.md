# Video Production Quick Start

## 🚀 Quick Start

### Local Execution

```bash
# Simple run (uses defaults)
python3 video_production_agent.py

# Or use the convenience script
./run_video_production.sh
```

### GitHub Actions

1. Go to **Actions** tab
2. Select **Generate Portfolio Videos**
3. Click **Run workflow**
4. Download artifacts when complete

## 📝 Environment Variables

```bash
SCRIPT_PATTERN="*SCRIPT*.md"    # Script file pattern
VIDEO_RESOLUTION="1920x1080"    # Video resolution
FPS="30"                        # Frames per second
VIDEO_OUT_DIR="./video_output"  # Output directory
```

## 📦 Output

```
video_output/
├── PORTFOLIO_VIDEO_SCRIPT_video.mp4       # Final video
├── PORTFOLIO_VIDEO_SCRIPT_video.log.txt   # Render log
├── audio/                                 # Audio files
└── visuals/                               # Scene images
```

## 🔧 Requirements

- **Python 3.11+**
- **FFmpeg** (for video rendering)
- **espeak** (optional, for TTS)

### Install on Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install -y ffmpeg espeak fonts-dejavu-core
```

### Install on macOS

```bash
brew install ffmpeg espeak
```

## 📖 Full Documentation

See [VIDEO_PRODUCTION_README.md](VIDEO_PRODUCTION_README.md) for complete documentation.

## 🎯 Example Output

From `PORTFOLIO_VIDEO_SCRIPT.md`:
- **Scenes**: 45 parsed scenes
- **Duration**: ~17 minutes
- **Resolution**: 1920x1080 @ 30fps
- **Format**: H.264/AAC MP4
- **Size**: ~19MB

## 🐛 Troubleshooting

### No audio
```bash
# Install espeak
sudo apt-get install espeak
```

### Video fails to render
```bash
# Check FFmpeg
ffmpeg -version

# Check disk space
df -h
```

### Script not found
```bash
# Verify script location
export SCRIPT_DIR="/path/to/scripts"
export SCRIPT_PATTERN="*.md"
```

## 💡 Tips

- **Test locally first**: Run locally before using GitHub Actions
- **Check logs**: Review `video_production.log` for details
- **Customize resolution**: Lower resolution for faster rendering
- **Batch processing**: Use wildcards to process multiple scripts

## 🔗 Related Files

- `video_production_agent.py` - Main agent
- `.github/workflows/generate_videos.yml` - GitHub Actions workflow
- `VIDEO_PRODUCTION_README.md` - Full documentation
- `PORTFOLIO_VIDEO_SCRIPT.md` - Example script
