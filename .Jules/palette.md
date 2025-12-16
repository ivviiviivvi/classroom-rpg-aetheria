## 2024-05-23 - Accessibility for SoundSettings
**Learning:** Icon-only buttons (like mute toggles) are common accessibility traps. Adding `aria-label` is critical for screen readers, especially when the icon changes state (muted/unmuted) to communicate current status.
**Action:** Always verify `aria-label` on `Button` components with `size="icon"`.
