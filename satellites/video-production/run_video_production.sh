#!/bin/bash
# Example usage script for video production agent
# Run from repository root: bash satellites/video-production/run_video_production.sh

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the repository root (two levels up from this script)
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Set environment variables for video production
export REPO_ROOT="$REPO_ROOT"
export SCRIPT_DIR="$REPO_ROOT/satellites/portfolio"
export SCRIPT_PATTERN="PORTFOLIO_VIDEO_SCRIPT.md"
export VIDEO_OUT_DIR="$REPO_ROOT/video_output"
export VOICE_MODE="local_tts"
export VIDEO_RESOLUTION="1920x1080"
export FPS="30"
export LLM_MODE="local_llm"
export HEADLESS="true"

# Run the video production agent
echo "Starting video production agent..."
echo "Configuration:"
echo "  Repository root: $REPO_ROOT"
echo "  Script directory: $SCRIPT_DIR"
echo "  Script pattern: $SCRIPT_PATTERN"
echo "  Output: $VIDEO_OUT_DIR"
echo "  Resolution: $VIDEO_RESOLUTION @ ${FPS}fps"
echo ""

# Change to the script directory and run
cd "$SCRIPT_DIR/.."
python3 video-production/video_production_agent.py

echo ""
echo "Video production complete!"
echo "Output files:"
ls -lh "$VIDEO_OUT_DIR"/*.mp4 2>/dev/null || echo "No videos generated"
