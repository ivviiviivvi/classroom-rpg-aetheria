#!/bin/bash
# Example usage script for video production agent

# Set environment variables for video production
export REPO_ROOT="$(pwd)"
export SCRIPT_DIR="$(pwd)"
export SCRIPT_PATTERN="PORTFOLIO_VIDEO_SCRIPT.md"
export VIDEO_OUT_DIR="./video_output"
export VOICE_MODE="local_tts"
export VIDEO_RESOLUTION="1920x1080"
export FPS="30"
export LLM_MODE="local_llm"
export HEADLESS="true"

# Run the video production agent
echo "Starting video production agent..."
echo "Configuration:"
echo "  Script: $SCRIPT_PATTERN"
echo "  Output: $VIDEO_OUT_DIR"
echo "  Resolution: $VIDEO_RESOLUTION @ ${FPS}fps"
echo ""

python3 video_production_agent.py

echo ""
echo "Video production complete!"
echo "Output files:"
ls -lh "$VIDEO_OUT_DIR"/*.mp4 2>/dev/null || echo "No videos generated"
