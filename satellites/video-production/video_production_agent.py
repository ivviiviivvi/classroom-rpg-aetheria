#!/usr/bin/env python3
"""
Autonomous Video Production Agent

This agent generates finished MP4 videos from repository-provided scripts using
a fully automated, local-first workflow.

Usage:
    python video_production_agent.py

Environment Variables:
    REPO_ROOT: Absolute path to repository (default: current directory)
    SCRIPT_DIR: Path containing finalized scripts (default: current directory)
    SCRIPT_PATTERN: Script file pattern (default: *SCRIPT*.md)
    DEMO_URL: Optional deployed app URL
    VIDEO_OUT_DIR: Output directory (default: ./video_output)
    VOICE_MODE: Voice mode (default: local_tts)
    VOICE_SAMPLE_WAV: Optional voice sample path
    VIDEO_RESOLUTION: Video resolution (default: 1920x1080)
    FPS: Frames per second (default: 30)
    LLM_MODE: LLM mode (default: local_llm)
    HEADLESS: Headless browser mode (default: true)
"""

import os
import sys
import glob
import re
import subprocess
import json
import logging
from pathlib import Path
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime
import shutil

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('video_production.log')
    ]
)
logger = logging.getLogger(__name__)

# Configuration constants
PICO2WAVE_TEXT_LIMIT = 32767  # Maximum text length for pico2wave TTS
SPEAKING_RATE_WPM = 150  # Words per minute for speech estimation
MIN_SCENE_DURATION = 3.0  # Minimum scene duration in seconds

# Font configuration (fallback to system defaults)
FONT_PATHS = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',  # Linux
    '/System/Library/Fonts/Helvetica.ttc',  # macOS
    'C:\\Windows\\Fonts\\arial.ttf',  # Windows
]
FONT_PATHS_REGULAR = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',  # Linux
    '/System/Library/Fonts/Helvetica.ttc',  # macOS
    'C:\\Windows\\Fonts\\arial.ttf',  # Windows
]

# Title card styling
TITLE_FONT_SIZE = 72
SUBTITLE_FONT_SIZE = 36
TITLE_Y_OFFSET = -50
SUBTITLE_Y_OFFSET = 50


@dataclass
class Scene:
    """Represents a scene in the video"""
    index: int
    title: str
    content: str
    timecode: Optional[str] = None
    duration_seconds: float = 5.0
    visual_notes: str = ""


@dataclass
class VideoJob:
    """Represents a video production job"""
    script_path: Path
    scenes: List[Scene]
    output_path: Path
    audio_path: Optional[Path] = None
    total_duration: float = 0.0
    fallbacks_used: List[str] = None
    
    def __post_init__(self):
        if self.fallbacks_used is None:
            self.fallbacks_used = []


class VideoProductionAgent:
    """Main video production agent"""
    
    def __init__(self):
        """Initialize the agent with environment configuration"""
        self.repo_root = Path(os.getenv('REPO_ROOT', os.getcwd()))
        self.script_dir = Path(os.getenv('SCRIPT_DIR', self.repo_root))
        self.script_pattern = os.getenv('SCRIPT_PATTERN', '*SCRIPT*.md')
        self.demo_url = os.getenv('DEMO_URL', '')
        self.video_out_dir = Path(os.getenv('VIDEO_OUT_DIR', self.repo_root / 'video_output'))
        self.voice_mode = os.getenv('VOICE_MODE', 'local_tts')
        self.voice_sample_wav = os.getenv('VOICE_SAMPLE_WAV', '')
        self.video_resolution = os.getenv('VIDEO_RESOLUTION', '1920x1080')
        self.fps = int(os.getenv('FPS', '30'))
        self.llm_mode = os.getenv('LLM_MODE', 'local_llm')
        self.headless = os.getenv('HEADLESS', 'true').lower() == 'true'
        
        # Create output directory
        self.video_out_dir.mkdir(parents=True, exist_ok=True)
        
        # Check dependencies
        self._check_dependencies()
        
        logger.info(f"Initialized VideoProductionAgent")
        logger.info(f"  Repository root: {self.repo_root}")
        logger.info(f"  Script directory: {self.script_dir}")
        logger.info(f"  Output directory: {self.video_out_dir}")
        logger.info(f"  Resolution: {self.video_resolution}")
        logger.info(f"  FPS: {self.fps}")
    
    def _check_dependencies(self):
        """Check if required dependencies are available"""
        # Check for FFmpeg
        if not shutil.which('ffmpeg'):
            logger.warning("FFmpeg not found - video rendering will fail")
        else:
            logger.info("FFmpeg found")
    
    def scan_scripts(self) -> List[Path]:
        """
        Scan for scripts matching the pattern
        
        Returns:
            List of script file paths
        """
        logger.info(f"Scanning for scripts in {self.script_dir} with pattern {self.script_pattern}")
        
        script_paths = list(self.script_dir.glob(self.script_pattern))
        
        logger.info(f"Found {len(script_paths)} script(s): {[p.name for p in script_paths]}")
        
        return script_paths
    
    def parse_script(self, script_path: Path) -> List[Scene]:
        """
        Parse script file and extract scenes with timing information
        
        Args:
            script_path: Path to script file
            
        Returns:
            List of Scene objects
        """
        logger.info(f"Parsing script: {script_path.name}")
        
        with open(script_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        scenes = []
        scene_index = 0
        
        # Split by heading patterns (## or ###)
        # Look for timecode patterns like (0:00 - 0:30) or [0:00-0:30]
        sections = re.split(r'\n(?:#{2,3})\s+', content)
        
        for section in sections[1:]:  # Skip first split (before any heading)
            lines = section.strip().split('\n', 1)
            if not lines:
                continue
                
            title = lines[0].strip()
            scene_content = lines[1] if len(lines) > 1 else ""
            
            # Extract timecode from title if present
            timecode_match = re.search(r'[\(\[](\d+:\d+)\s*[-–]\s*(\d+:\d+)[\)\]]', title)
            timecode = None
            duration = 5.0  # Default duration
            
            if timecode_match:
                timecode = f"{timecode_match.group(1)}-{timecode_match.group(2)}"
                # Calculate duration
                start_parts = timecode_match.group(1).split(':')
                end_parts = timecode_match.group(2).split(':')
                
                start_seconds = int(start_parts[0]) * 60 + int(start_parts[1])
                end_seconds = int(end_parts[0]) * 60 + int(end_parts[1])
                duration = end_seconds - start_seconds
            else:
                # Estimate duration based on content length
                word_count = len(scene_content.split())
                # Use configured speaking rate
                duration = max(MIN_SCENE_DURATION, (word_count / SPEAKING_RATE_WPM) * 60)
            
            # Extract visual notes (look for [ON SCREEN: ...] or **[...]**)
            visual_notes = ""
            visual_matches = re.findall(r'\[(?:ON SCREEN:|Visual:)\s*([^\]]+)\]', scene_content, re.IGNORECASE)
            if visual_matches:
                visual_notes = " | ".join(visual_matches)
            
            # Clean narration text (remove visual directives and formatting)
            narration = re.sub(r'\[(?:ON SCREEN:|Visual:)[^\]]+\]', '', scene_content)
            narration = re.sub(r'\*\*\[([^\]]+)\]\*\*', '', narration)
            narration = narration.strip()
            
            scene = Scene(
                index=scene_index,
                title=title,
                content=narration,
                timecode=timecode,
                duration_seconds=duration,
                visual_notes=visual_notes
            )
            
            scenes.append(scene)
            scene_index += 1
        
        logger.info(f"Parsed {len(scenes)} scenes from {script_path.name}")
        
        return scenes
    
    def generate_audio(self, scenes: List[Scene], output_path: Path) -> Path:
        """
        Generate audio narration from script text using TTS
        
        Args:
            scenes: List of scenes with narration text
            output_path: Base output path for audio
            
        Returns:
            Path to generated audio file
        """
        logger.info("Generating audio narration using TTS")
        
        audio_dir = self.video_out_dir / 'audio'
        audio_dir.mkdir(exist_ok=True)
        
        # Combine all scene content into full narration
        full_narration = "\n\n".join([
            f"{scene.title}\n{scene.content}" 
            for scene in scenes 
            if scene.content.strip()
        ])
        
        # Save narration text
        narration_file = audio_dir / f"{output_path.stem}_narration.txt"
        with open(narration_file, 'w', encoding='utf-8') as f:
            f.write(full_narration)
        
        logger.info(f"Saved narration text to {narration_file}")
        
        # Generate audio using espeak or similar TTS
        audio_file = audio_dir / f"{output_path.stem}_audio.wav"
        
        # Try different TTS methods
        tts_success = False
        
        # Method 1: Try espeak if available
        if shutil.which('espeak'):
            try:
                subprocess.run([
                    'espeak',
                    '-f', str(narration_file),
                    '-w', str(audio_file),
                    '-s', '160',  # Speed: 160 words per minute
                    '-v', 'en-us'
                ], check=True, capture_output=True)
                tts_success = True
                logger.info(f"Generated audio using espeak: {audio_file}")
            except subprocess.CalledProcessError as e:
                logger.warning(f"espeak failed: {e}")
        
        # Method 2: Try pico2wave if available
        if not tts_success and shutil.which('pico2wave'):
            try:
                subprocess.run([
                    'pico2wave',
                    '-l', 'en-US',
                    '-w', str(audio_file),
                    full_narration[:PICO2WAVE_TEXT_LIMIT]  # pico2wave text length limit
                ], check=True, capture_output=True)
                tts_success = True
                logger.info(f"Generated audio using pico2wave: {audio_file}")
            except subprocess.CalledProcessError as e:
                logger.warning(f"pico2wave failed: {e}")
        
        # Method 3: Generate silent audio as fallback
        if not tts_success:
            logger.warning("No TTS engine available, generating silent audio track")
            total_duration = sum(scene.duration_seconds for scene in scenes)
            try:
                subprocess.run([
                    'ffmpeg', '-f', 'lavfi', '-i',
                    f'anullsrc=r=44100:cl=stereo',
                    '-t', str(total_duration),
                    '-y',
                    str(audio_file)
                ], check=True, capture_output=True)
                logger.info(f"Generated silent audio: {audio_file}")
            except subprocess.CalledProcessError as e:
                logger.error(f"Failed to generate silent audio: {e}")
                raise
        
        return audio_file
    
    def generate_visuals(self, scenes: List[Scene], output_path: Path) -> List[Path]:
        """
        Generate visual assets for the video
        
        Args:
            scenes: List of scenes with visual notes
            output_path: Base output path
            
        Returns:
            List of generated visual asset paths
        """
        logger.info("Generating visual assets")
        
        visuals_dir = self.video_out_dir / 'visuals'
        visuals_dir.mkdir(exist_ok=True)
        
        visual_assets = []
        
        for scene in scenes:
            # Generate title card for each scene
            scene_visual = visuals_dir / f"{output_path.stem}_scene_{scene.index:03d}.png"
            
            # Create simple title card using ImageMagick or FFmpeg
            self._create_title_card(
                scene.title,
                scene.visual_notes or scene.content[:200],
                scene_visual
            )
            
            visual_assets.append(scene_visual)
        
        logger.info(f"Generated {len(visual_assets)} visual assets")
        
        return visual_assets
    
    def _create_title_card(self, title: str, subtitle: str, output_path: Path):
        """
        Create a simple title card using FFmpeg
        
        Args:
            title: Main title text
            subtitle: Subtitle or description text
            output_path: Output image path
        """
        width, height = map(int, self.video_resolution.split('x'))
        
        # Clean text for FFmpeg
        title_clean = title.replace(':', '\\:').replace("'", "\\'")[:100]
        subtitle_clean = subtitle.replace(':', '\\:').replace("'", "\\'")[:200]
        
        # Find available fonts
        font_bold = None
        font_regular = None
        
        for font_path in FONT_PATHS:
            if Path(font_path).exists():
                font_bold = font_path
                break
        
        for font_path in FONT_PATHS_REGULAR:
            if Path(font_path).exists():
                font_regular = font_path
                break
        
        # Create title card with FFmpeg
        try:
            if font_bold and font_regular:
                # With custom fonts
                subprocess.run([
                    'ffmpeg',
                    '-f', 'lavfi',
                    '-i', f'color=c=0x1e293b:s={width}x{height}:d=1',
                    '-vf', f"drawtext=text='{title_clean}':fontcolor=white:fontsize={TITLE_FONT_SIZE}:x=(w-text_w)/2:y=(h-text_h)/2{TITLE_Y_OFFSET}:fontfile={font_bold},"
                           f"drawtext=text='{subtitle_clean}':fontcolor=0xcccccc:fontsize={SUBTITLE_FONT_SIZE}:x=(w-text_w)/2:y=(h-text_h)/2+{SUBTITLE_Y_OFFSET}:fontfile={font_regular}",
                    '-frames:v', '1',
                    '-y',
                    str(output_path)
                ], check=True, capture_output=True)
            else:
                # Without font specification (use FFmpeg defaults)
                subprocess.run([
                    'ffmpeg',
                    '-f', 'lavfi',
                    '-i', f'color=c=0x1e293b:s={width}x{height}:d=1',
                    '-vf', f"drawtext=text='{title_clean}':fontcolor=white:fontsize={TITLE_FONT_SIZE}:x=(w-text_w)/2:y=(h-text_h)/2{TITLE_Y_OFFSET},"
                           f"drawtext=text='{subtitle_clean}':fontcolor=0xcccccc:fontsize={SUBTITLE_FONT_SIZE}:x=(w-text_w)/2:y=(h-text_h)/2+{SUBTITLE_Y_OFFSET}",
                    '-frames:v', '1',
                    '-y',
                    str(output_path)
                ], check=True, capture_output=True)
            logger.debug(f"Created title card: {output_path.name}")
        except subprocess.CalledProcessError as e:
            logger.warning(f"Failed to create title card with text, creating solid color card: {e}")
            # Fallback: create simple solid color card
            subprocess.run([
                'ffmpeg',
                '-f', 'lavfi',
                '-i', f'color=c=0x1e293b:s={width}x{height}:d=1',
                '-frames:v', '1',
                '-y',
                str(output_path)
            ], check=True, capture_output=True)
    
    def render_video(
        self, 
        scenes: List[Scene], 
        audio_path: Path, 
        visual_assets: List[Path],
        output_path: Path
    ) -> Path:
        """
        Render final video using FFmpeg
        
        Args:
            scenes: List of scenes with timing info
            audio_path: Path to audio file
            visual_assets: List of visual asset paths
            output_path: Output video path
            
        Returns:
            Path to rendered video file
        """
        logger.info(f"Rendering video: {output_path.name}")
        
        if not visual_assets:
            logger.error("No visual assets to render")
            raise ValueError("Cannot render video without visual assets")
        
        # Create a concat file for FFmpeg
        concat_file = self.video_out_dir / f"{output_path.stem}_concat.txt"
        
        with open(concat_file, 'w') as f:
            for i, (scene, visual) in enumerate(zip(scenes, visual_assets)):
                if visual.exists():
                    f.write(f"file '{visual.absolute()}'\n")
                    f.write(f"duration {scene.duration_seconds}\n")
            
            # Repeat last image to ensure proper duration
            if visual_assets and visual_assets[-1].exists():
                f.write(f"file '{visual_assets[-1].absolute()}'\n")
        
        logger.info(f"Created concat file: {concat_file}")
        
        # Render video with FFmpeg
        try:
            cmd = [
                'ffmpeg',
                '-f', 'concat',
                '-safe', '0',
                '-i', str(concat_file),
                '-i', str(audio_path),
                '-c:v', 'libx264',
                '-preset', 'medium',
                '-crf', '23',
                '-pix_fmt', 'yuv420p',
                '-r', str(self.fps),
                '-c:a', 'aac',
                '-b:a', '192k',
                '-shortest',
                '-y',
                str(output_path)
            ]
            
            logger.info(f"Running FFmpeg: {' '.join(cmd)}")
            
            result = subprocess.run(
                cmd,
                check=True,
                capture_output=True,
                text=True
            )
            
            logger.info(f"Video rendered successfully: {output_path}")
            
            # Get video info
            info_result = subprocess.run(
                ['ffprobe', '-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', str(output_path)],
                capture_output=True,
                text=True
            )
            
            if info_result.returncode == 0:
                info = json.loads(info_result.stdout)
                duration = float(info.get('format', {}).get('duration', 0))
                size_mb = int(info.get('format', {}).get('size', 0)) / (1024 * 1024)
                logger.info(f"Video duration: {duration:.1f}s, size: {size_mb:.1f}MB")
            
            return output_path
            
        except subprocess.CalledProcessError as e:
            logger.error(f"FFmpeg rendering failed: {e}")
            logger.error(f"stderr: {e.stderr}")
            raise
    
    def generate_render_log(self, job: VideoJob) -> Path:
        """
        Generate a render log for the video job
        
        Args:
            job: Completed video job
            
        Returns:
            Path to log file
        """
        log_path = job.output_path.with_suffix('.log.txt')
        
        log_content = f"""Video Render Log
{'=' * 80}

Script: {job.script_path.name}
Output: {job.output_path.name}
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Configuration:
- Resolution: {self.video_resolution}
- FPS: {self.fps}
- Voice Mode: {self.voice_mode}
- Scenes: {len(job.scenes)}
- Total Duration: {job.total_duration:.1f}s

Scenes:
"""
        
        for scene in job.scenes:
            log_content += f"\n{scene.index + 1}. {scene.title} ({scene.duration_seconds:.1f}s)\n"
            if scene.timecode:
                log_content += f"   Timecode: {scene.timecode}\n"
            if scene.visual_notes:
                log_content += f"   Visuals: {scene.visual_notes}\n"
        
        if job.fallbacks_used:
            log_content += f"\nFallbacks Used:\n"
            for fallback in job.fallbacks_used:
                log_content += f"- {fallback}\n"
        
        log_content += f"\nOutput Path: {job.output_path.absolute()}\n"
        
        with open(log_path, 'w', encoding='utf-8') as f:
            f.write(log_content)
        
        logger.info(f"Generated render log: {log_path}")
        
        return log_path
    
    def process_script(self, script_path: Path) -> VideoJob:
        """
        Process a single script and generate video
        
        Args:
            script_path: Path to script file
            
        Returns:
            Completed VideoJob
        """
        logger.info(f"\n{'=' * 80}")
        logger.info(f"Processing script: {script_path.name}")
        logger.info(f"{'=' * 80}\n")
        
        job = VideoJob(
            script_path=script_path,
            scenes=[],
            output_path=self.video_out_dir / f"{script_path.stem}_video.mp4"
        )
        
        try:
            # Step 1: Parse script
            job.scenes = self.parse_script(script_path)
            job.total_duration = sum(scene.duration_seconds for scene in job.scenes)
            
            # Step 2: Generate audio
            job.audio_path = self.generate_audio(job.scenes, job.output_path)
            
            # Step 3: Generate visuals
            visual_assets = self.generate_visuals(job.scenes, job.output_path)
            
            # Step 4: Render video
            self.render_video(job.scenes, job.audio_path, visual_assets, job.output_path)
            
            # Step 5: Generate log
            self.generate_render_log(job)
            
            logger.info(f"\n✓ Successfully generated video: {job.output_path}")
            
        except Exception as e:
            logger.error(f"\n✗ Failed to process script {script_path.name}: {e}")
            job.fallbacks_used.append(f"Error: {str(e)}")
            raise
        
        return job
    
    def run(self):
        """Main execution method"""
        logger.info("\n" + "=" * 80)
        logger.info("AUTONOMOUS VIDEO PRODUCTION AGENT - STARTING")
        logger.info("=" * 80 + "\n")
        
        # Step 1: Scan for scripts
        script_paths = self.scan_scripts()
        
        if not script_paths:
            logger.warning("No scripts found matching pattern. Exiting.")
            return
        
        # Step 2: Process each script
        jobs = []
        for script_path in script_paths:
            try:
                job = self.process_script(script_path)
                jobs.append(job)
            except Exception as e:
                logger.error(f"Failed to process {script_path.name}: {e}")
                continue
        
        # Summary
        logger.info("\n" + "=" * 80)
        logger.info("VIDEO PRODUCTION SUMMARY")
        logger.info("=" * 80)
        logger.info(f"Total scripts processed: {len(script_paths)}")
        logger.info(f"Videos generated: {len(jobs)}")
        logger.info(f"Output directory: {self.video_out_dir.absolute()}")
        
        for job in jobs:
            logger.info(f"\n  ✓ {job.output_path.name}")
            logger.info(f"    Scenes: {len(job.scenes)}")
            logger.info(f"    Duration: {job.total_duration:.1f}s")
            if job.fallbacks_used:
                logger.info(f"    Fallbacks: {', '.join(job.fallbacks_used)}")
        
        logger.info("\n" + "=" * 80)
        logger.info("EXECUTION COMPLETE")
        logger.info("=" * 80 + "\n")


def main():
    """Entry point"""
    try:
        agent = VideoProductionAgent()
        agent.run()
        return 0
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        return 1


if __name__ == '__main__':
    sys.exit(main())
