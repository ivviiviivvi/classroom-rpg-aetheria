# Autonomous Video Production Agent

An execution-capable agent that generates finished MP4 videos from portfolio scripts using a fully automated, local-first workflow.

## Overview

This agent transforms finalized narration scripts (like `PORTFOLIO_VIDEO_SCRIPT.md`) into professional MP4 videos suitable for non-technical hiring decision-makers. It uses local text-to-speech, FFmpeg video rendering, and automated visual generation.

## Features

- ✅ **Script Parsing**: Automatically detects scenes, timecodes, and visual notes
- ✅ **Audio Generation**: Local TTS with fallback to silent audio
- ✅ **Visual Creation**: Automated title cards and scene graphics
- ✅ **Timeline Sync**: Precise synchronization of audio and visuals
- ✅ **MP4 Rendering**: High-quality video output via FFmpeg
- ✅ **Failure Handling**: Graceful fallbacks and comprehensive logging
- ✅ **Batch Processing**: Process multiple scripts in one run

## Prerequisites

### System Requirements

- **Python 3.11+**
- **FFmpeg** (required for video rendering)
- **espeak** or **pico2wave** (optional, for TTS)
- **DejaVu fonts** (for text rendering in videos)

### Installation

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install -y ffmpeg espeak fonts-dejavu-core
```

#### macOS
```bash
brew install ffmpeg espeak
```

#### Windows
Download and install:
- [FFmpeg](https://ffmpeg.org/download.html)
- [eSpeak NG](https://github.com/espeak-ng/espeak-ng/releases)

## Usage

### Environment Configuration

Set environment variables to customize behavior:

```bash
# Repository configuration
export REPO_ROOT="/path/to/repo"              # Default: current directory
export SCRIPT_DIR="/path/to/scripts"          # Default: REPO_ROOT
export SCRIPT_PATTERN="*SCRIPT*.md"           # Default: *SCRIPT*.md

# Video configuration
export VIDEO_OUT_DIR="./video_output"         # Default: ./video_output
export VIDEO_RESOLUTION="1920x1080"           # Default: 1920x1080
export FPS="30"                                # Default: 30

# Voice configuration
export VOICE_MODE="local_tts"                 # Default: local_tts
export VOICE_SAMPLE_WAV=""                    # Optional: voice sample path

# Execution configuration
export LLM_MODE="local_llm"                   # Default: local_llm
export HEADLESS="true"                        # Default: true
export DEMO_URL=""                            # Optional: deployed app URL
```

### Running Locally

```bash
# Simple run with defaults
python video_production_agent.py

# Custom configuration
export SCRIPT_PATTERN="PORTFOLIO_VIDEO_SCRIPT.md"
export VIDEO_RESOLUTION="1280x720"
export FPS="24"
python video_production_agent.py
```

### Running via GitHub Actions

The workflow can be triggered:

1. **Automatically**: On push to script files or the agent itself
2. **Manually**: Via workflow_dispatch with custom parameters

To trigger manually:
1. Go to **Actions** tab in GitHub
2. Select **Generate Portfolio Videos**
3. Click **Run workflow**
4. Optionally customize inputs
5. Click **Run workflow**

The generated videos will be available as workflow artifacts.

## Script Format

The agent expects Markdown scripts with the following structure:

```markdown
## Scene Title (0:00 - 0:30)

Narration text goes here. This will be converted to speech.

[ON SCREEN: Visual description]

**[Visual note: Additional visual guidance]**

More narration text...
```

### Supported Patterns

- **Timecodes**: `(0:00 - 0:30)` or `[0:00-0:30]` in section headings
- **Visual Notes**: `[ON SCREEN: ...]` or `[Visual: ...]`
- **Scene Boundaries**: Detected via `##` or `###` Markdown headings
- **Paragraphs**: Auto-split into scenes if no headings exist

## Output Structure

```
video_output/
├── PORTFOLIO_VIDEO_SCRIPT_video.mp4          # Final video
├── PORTFOLIO_VIDEO_SCRIPT_video.log.txt      # Render log
├── audio/
│   ├── PORTFOLIO_VIDEO_SCRIPT_narration.txt  # Full narration text
│   └── PORTFOLIO_VIDEO_SCRIPT_audio.wav      # Generated audio
└── visuals/
    ├── PORTFOLIO_VIDEO_SCRIPT_scene_000.png  # Scene 1 title card
    ├── PORTFOLIO_VIDEO_SCRIPT_scene_001.png  # Scene 2 title card
    └── ...
```

## Architecture

### Processing Pipeline

```
1. Script Scanner
   ↓
2. Scene Parser (detect timecodes, visual notes)
   ↓
3. Audio Generator (TTS → WAV)
   ↓
4. Visual Generator (title cards, diagrams)
   ↓
5. Timeline Synchronizer (match audio + visuals)
   ↓
6. FFmpeg Renderer (→ MP4)
   ↓
7. Log Generator (summary + metadata)
```

### Fallback Strategy

The agent implements graceful degradation:

1. **TTS Failure**: Falls back to silent audio track
2. **Visual Failure**: Uses solid color cards
3. **Demo Capture Failure**: Uses static diagrams/title cards
4. **Font Missing**: FFmpeg uses default system fonts

All fallbacks are logged in the render log.

## Quality Constraints

- **Non-technical Friendly**: No code editors or terminal views (unless in script)
- **Clean Audio**: Stable levels, no clipping
- **Readable Text**: Minimum 36pt font, high contrast
- **Smooth Transitions**: Clean cuts between scenes
- **Professional Output**: No watermarks or draft indicators

## Troubleshooting

### No audio generated
- Install espeak: `sudo apt-get install espeak`
- Or install pico2wave: `sudo apt-get install libttspico-utils`
- Silent audio will be used as fallback if neither is available

### Video rendering fails
- Verify FFmpeg installation: `ffmpeg -version`
- Check available disk space
- Review logs in `video_production.log`

### Text not visible in videos
- Install DejaVu fonts: `sudo apt-get install fonts-dejavu-core`
- Or update font path in `_create_title_card()` method

### Script not found
- Verify `SCRIPT_DIR` and `SCRIPT_PATTERN` environment variables
- Check file permissions
- Ensure script files are in the specified directory

## Extending the Agent

### Adding Custom TTS Engines

Edit `generate_audio()` method to add new TTS providers:

```python
# Method 4: Custom TTS API
if not tts_success:
    response = requests.post('https://tts-api.example.com', 
                            json={'text': full_narration})
    with open(audio_file, 'wb') as f:
        f.write(response.content)
    tts_success = True
```

### Adding Demo Capture

Use Playwright or Selenium for browser automation:

```python
def capture_demo(self, demo_url: str, duration: float) -> Path:
    from playwright.sync_api import sync_playwright
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=self.headless)
        page = browser.new_page()
        page.goto(demo_url)
        # Capture video...
        browser.close()
```

### Custom Visual Generation

Extend `generate_visuals()` to create diagrams, animations, or screen recordings.

## CI/CD Integration

The GitHub Actions workflow provides:

- ✅ Automatic video generation on script updates
- ✅ Artifact upload (videos + logs)
- ✅ PR comments with video metadata
- ✅ Workflow summary with production stats
- ✅ Configurable via workflow inputs

Artifacts are retained for 30 days (videos) and 7 days (intermediate assets).

## Performance

Typical processing times:
- **Script parsing**: < 1 second
- **Audio generation**: 5-30 seconds (depends on TTS engine)
- **Visual generation**: 2-5 seconds per scene
- **Video rendering**: 10-60 seconds (depends on duration and resolution)

Total: **1-3 minutes** for a 4-minute video on standard hardware.

## License

MIT License - See repository LICENSE file

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review logs in `video_production.log`
3. Open an issue in the repository
