# Aetheria: The Living Classroom - Product Requirements Document

Aetheria transforms traditional Learning Management Systems into an immersive, gamified 3D experience where courses become "Realms," assignments become "Quests," and student progress is visualized through glowing "Constellations" in a living, responsive environment.

**Experience Qualities**:
1. **Immersive** - Users should feel transported into a digital universe rather than using "just another education tool," achieved through 3D spatial navigation, glassmorphism UI, dynamic theming, ambient particle effects, and smooth animations that respond to their chosen reality.
2. **Empowering** - Both teachers and students should feel like powerful creators and adventurers respectively, reinforced through gamification mechanics (XP, levels, loot, level-up celebrations) and the recursive AI Oracle that provides immediate, constructive feedback loops.
3. **Alive** - The interface should feel reactive and breathing, with floating particles, smooth progress animations, pulsing constellation stars, parallax effects, and smooth transitions that make every interaction feel consequential and magical.

**Complexity Level**: Complex Application (advanced functionality, accounts)
- This is a dual-role LMS with sophisticated state management for courses/assignments/submissions, AI-powered recursive learning generation, animated canvas visualizations, dynamic theming system, and persistent user progression tracking across multiple data entities.

## Implementation Status

### ✅ Completed Core Features
1. **Reality Switch (Theme Engine)** - Four complete themes with instant visual transformation
2. **Realm Map (Course Navigation)** - Draggable 2D map with floating realm nodes and animated decorations
3. **Quest System with Oracle** - Full AI evaluation, Knowledge Crystals, and redemption quest generation
4. **Mastery Constellation** - Enhanced canvas-based visualization with glowing stars, animated connections, and progress tracking
5. **Character Progression** - XP tracking, level system, artifact collection, and level-up celebration animations
6. **Role Toggle** - Seamless switching between teacher/student with appropriate UI
7. **Realm Position Editor** - Teacher can customize realm positions on world map
8. **Realm & Quest Creation** - AI-assisted content generation with theme consistency
9. **Teacher Dashboard** - Complete management interface with stats and submission viewing
10. **Leaderboard** - Animated ranking system with champion highlighting
11. **Welcome Dialog** - First-time user onboarding with hero name entry
12. **Enhanced UI Polish** - Particle field backgrounds, loading animations, hover effects, and smooth transitions
13. **Fully Customizable Avatar System** - Character creation with extensive customization options

### 🎉 Latest Enhancements (Current Iteration)
- ✨ **Generative Music System** - Procedural ambient music that adapts to each theme with unique scales, tempos, and timbres
- ✨ **3D Themed Backgrounds** - Dynamic Three.js backgrounds for each realm with theme-specific geometries and effects
- ✨ **Enhanced Teacher Interface** - Calendar view, rubric management, and advanced grading interface
- ✨ **AI-Powered Rubric Generation** - Automatically create grading criteria with LLM assistance
- ✨ **Interactive Calendar** - Visual quest deadline management with drag-and-drop scheduling
- ✨ **Advanced Grading System** - Rubric-based grading with manual override, AI feedback generation, and detailed scoring
- ✨ **Motion Throughout** - Framer Motion animations on all view transitions, cards, and interactive elements
- ✨ **Themed Module Backgrounds** - Each realm opens with unique 3D particle effects matching its color and theme
- ✨ **Re-grading Capability** - Teachers can review and adjust AI-generated grades with custom rubrics

### Recent Enhancements (Previous Iteration)
- ✨ **Ambient Particle Field** - Network of floating particles throughout the app for depth
- ✨ **Enhanced Constellation View** - Responsive canvas with better star animations, glowing connections, and progress stats
- ✨ **Improved HUDSidebar** - Animated XP progress bar with shimmer effect, artifact count display, and smooth navigation transitions
- ✨ **Loading Oracle Component** - Dedicated animation for AI evaluation with rotating icons and pulsing effects
- ✨ **Level-Up Celebration** - Full-screen particle explosion animation when users level up
- ✨ **Enhanced Leaderboard** - Animated entry, champion badge, rotating crown icon, and improved visual hierarchy
- ✨ **Quick Stats Widget** - Dashboard showing total quests, completion rate, and artifact count
- ✨ **Better Quest Dialog** - Improved submission interface with Oracle loading state

## Essential Features

### Feature 1: Reality Switch (Theme Engine)
- **Functionality**: Instantly transforms the entire visual identity, typography, icons, and vocabulary across four themes (Fantasy, Sci-Fi, Medieval, Modern)
- **Purpose**: Creates personalization and engagement by letting users choose their preferred metaphorical lens for the learning experience
- **Trigger**: User clicks the "Reality" toggle button in the HUD sidebar
- **Progression**: Click button → Theme state changes → All UI elements re-render with new colors/fonts/terminology → 3D objects morph shapes → Confirmation animation plays
- **Success Criteria**: All text labels, colors, 3D geometries, and UI chrome update synchronously without layout shift; theme persists across sessions

### Feature 2: 3D Realm Map (Course Navigation)
- **Functionality**: Displays courses as floating 3D geometric nodes in a starfield with mouse-parallax camera movement
- **Purpose**: Replaces boring list views with spatial, memorable navigation that makes course selection feel like exploration
- **Trigger**: User enters the application or returns to "World Map" from sidebar
- **Progression**: Load World Map → Starfield animates in → Realm nodes float into position → User moves mouse (parallax effect) → User hovers node (glow effect) → User clicks node → Camera zooms into Realm detail view
- **Success Criteria**: At least 3 realm nodes visible simultaneously; parallax feels smooth (60fps); click transitions take <500ms; nodes are clearly labeled

### Feature 3: Quest System with Oracle Judgment (AI-Powered Assignments)
- **Functionality**: Presents assignments as "Quests" with submission interface and immediate AI evaluation that generates remedial content on failure
- **Purpose**: Core learning loop that provides instant feedback and automatically creates personalized study materials when students struggle
- **Trigger**: Student clicks a Quest card from within a Realm view
- **Progression**: Quest opens → Student reads briefing → Student enters submission text → Submits to Oracle → AI evaluates (2-3s loading) → Success: Flash green + award XP + light constellation star OR Failure: Flash red + generate Knowledge Crystal + generate Redemption Quest → Update Archives and Quest log
- **Success Criteria**: AI evaluation completes in <5 seconds; Knowledge Crystals contain 2-3 paragraphs of relevant study material; Redemption Quests are clearly linked to original quest; scores are displayed prominently

### Feature 4: Mastery Constellation (Visual Progress)
- **Functionality**: Renders student progress as a connected star map where each assignment is a glowing node
- **Purpose**: Provides immediate visual feedback on course completion and creates satisfying "fill the constellation" motivation
- **Trigger**: User navigates to Progress/Constellation view from sidebar or after completing a quest
- **Progression**: Open view → Canvas renders constellation shape → Each quest appears as star node → Completed quests glow gold/lit → Incomplete quests appear dim/grey → Lines connect related quests → Hovering a star shows quest name/score
- **Success Criteria**: At least 8-10 nodes visible in constellation; clear visual distinction between complete/incomplete; smooth animations when stars light up

### Feature 5: Character Progression & Inventory (Gamification)
- **Functionality**: Tracks XP, levels, and randomly generated "Artifact" loot rewards for high performance
- **Purpose**: Adds extrinsic motivation and creates memorable moments of achievement beyond numeric grades
- **Trigger**: XP awarded after quest completion; level-up triggers automatically; loot drops on 90%+ scores
- **Progression**: Complete quest → XP added to bar → Bar animates filling → If threshold crossed: Level-up animation + title changes → If critical success (90%+): "Loot Drop" animation → AI generates unique artifact → Artifact appears in inventory grid → User can click to read flavor text
- **Success Criteria**: XP bar visually updates smoothly; level thresholds are clear (e.g., 100/200/400 XP); artifacts have unique names/descriptions; inventory displays in grid with 4-6 slots visible

### Feature 6: Role Toggle (Teacher/Student View Switching)
- **Functionality**: Allows instant switching between Teacher (Creator) and Student (Player) perspectives
- **Purpose**: Enables teachers to test their courses from student view and provides demo functionality
- **Trigger**: User clicks role toggle in HUD sidebar
- **Progression**: Click toggle → Confirm switch (if needed) → UI re-renders → Teacher view shows "Create Quest" buttons and edit controls → Student view shows "Accept Quest" and submission interface → Profile updates to reflect role
- **Success Criteria**: Toggle completes in <300ms; role persists in session; appropriate features show/hide based on role

### Feature 7: Realm Position Editor (3D Layout Customization)
- **Functionality**: Provides an interactive interface for teachers to manually adjust the 3D position of realm nodes on the World Map through drag-and-drop or precise coordinate input
- **Purpose**: Enables teachers to create meaningful spatial arrangements (e.g., grouping related courses, creating visual hierarchies, or arranging nodes into recognizable patterns)
- **Trigger**: Teacher clicks "Edit Positions" button visible in World Map view when realms exist
- **Progression**: Click "Edit Positions" → Full-screen editor opens → 3D scene displays with grid and axes → Teacher drags realm nodes or enters X/Y/Z coordinates → Visual feedback shows selected realm → Click "Save Changes" → Positions persist to storage → Editor closes → World Map reflects new positions
- **Success Criteria**: Drag operations feel smooth (60fps); coordinate inputs update mesh in real-time; grid/axes provide spatial reference; "Reset Layout" returns to default circular arrangement; changes persist across sessions

### Feature 8: Realm & Quest Creation with AI Assistance
- **Functionality**: Teachers can create realms and quests with AI-generated descriptions that match the current theme
- **Purpose**: Reduces teacher workload and ensures theme-consistent content while maintaining creative control
- **Trigger**: Teacher clicks "Create Realm" or "Create Quest" buttons (visible when in teacher role)
- **Progression**: Click create button → Dialog opens → Enter name → Click "AI Generate" → LLM generates theme-appropriate description → Review/edit description → Select color (realm) or type/XP (quest) → Click "Create" → Item added to system
- **Success Criteria**: AI generation completes in <5 seconds; descriptions match theme vocabulary; teachers can edit AI output; created items immediately visible in UI

### Feature 9: Teacher Management Dashboard
- **Functionality**: Centralized view for teachers to see all realms, quests, and student submissions with statistics
- **Purpose**: Provides oversight of the entire learning system and enables content management
- **Trigger**: Teacher navigates to "Manage" from sidebar
- **Progression**: Open dashboard → View summary cards (realm count, quest count, submission count) → Browse realm list with quest counts → Browse quest list with completion stats → Click "View" on quest to see all submissions → Click delete on realm/quest to remove
- **Success Criteria**: Stats update in real-time; submission details show student responses and AI feedback; delete operations prevent orphaned data; dashboard is read-only for students

### Feature 10: Leaderboard
- **Functionality**: Displays all users ranked by XP with level, title, and artifact count
- **Purpose**: Adds competitive motivation and social comparison to encourage engagement
- **Trigger**: User navigates to "Leaderboard" from sidebar
- **Progression**: Open leaderboard → Users load sorted by XP descending → Top 3 highlighted with trophy/medal icons → Current user highlighted with ring → Scroll to see all participants
- **Success Criteria**: Rankings update when any user gains XP; current user always visible/highlighted; top 3 have distinct visual treatment

### Feature 11: Welcome Dialog with Name Entry
- **Functionality**: First-time users are prompted to enter their hero name before accessing the app
- **Purpose**: Personalizes the experience and establishes user identity in the system
- **Trigger**: App loads and detects no user name in profile
- **Progression**: App loads → Name dialog appears (modal, non-dismissible) → User enters name → Clicks "Begin Adventure" → Profile created with unique ID → Dialog closes → User enters app
- **Success Criteria**: Dialog blocks all interaction until name entered; name persists across sessions; profile gets unique ID for leaderboard tracking

## Edge Case Handling

- **Empty States**: New users see a tutorial Realm with sample Quest; empty inventories show "No artifacts yet" with encouraging message; empty Archives show placeholder for first Knowledge Crystal
- **AI Generation Failures**: If Oracle API fails, show graceful error with retry button; submission is saved locally and can be re-evaluated; fallback generic feedback provided
- **Network Interruptions**: All form inputs persist via useKV; unsaved submissions show warning banner; offline state disables Oracle but allows local navigation
- **Extreme Data**: Constellation view intelligently clusters if >20 quests; Realm Map uses pagination or zoom levels if >10 realms; Inventory uses scrollable grid for >12 artifacts
- **Performance**: 3D animations pause when tab is backgrounded; particle count reduces on mobile; heavy blur effects simplify on lower-end devices

## Design Direction

The design should evoke a sense of wonder and power, blending the ethereal beauty of floating glass interfaces with the tactile satisfaction of video game progression systems. The aesthetic pulls from sci-fi HUDs (Halo, Mass Effect) and fantasy RPGs (World of Warcraft talent trees, Destiny's director map) while maintaining clarity and accessibility. The interface should feel simultaneously futuristic and magical, with every interaction reinforced by purposeful motion and light.

## Color Selection

**Triadic + Theme-Specific** - Each of the four themes uses a distinct triadic palette to create complete visual transformation

**Fantasy (High Fantasy)**:
- **Primary Color**: Deep Slate `oklch(0.25 0.02 240)` - Mysterious midnight blue that suggests ancient magic and distant realms
- **Secondary Colors**: Warm Amber `oklch(0.70 0.15 70)` for energy/warmth, Mystic Purple `oklch(0.50 0.12 300)` for magical accents
- **Accent Color**: Radiant Gold `oklch(0.80 0.18 85)` - Used for quest completion, XP gains, and loot drops
- **Foreground/Background Pairings**:
  - Background (Deep Slate `oklch(0.15 0.02 240)`): Amber text `oklch(0.92 0.08 70)` - Ratio 11.2:1 ✓
  - Card (Slate Glass `oklch(0.22 0.02 240 / 0.7)`): White text `oklch(0.98 0 0)` - Ratio 13.5:1 ✓
  - Primary (Amber `oklch(0.70 0.15 70)`): Dark text `oklch(0.20 0.02 240)` - Ratio 8.9:1 ✓
  - Accent (Gold `oklch(0.80 0.18 85)`): Dark text `oklch(0.20 0.02 240)` - Ratio 12.1:1 ✓

**Sci-Fi (Cyberpunk)**:
- **Primary Color**: Void Black `oklch(0.12 0 0)` - Digital darkness of cyberspace
- **Secondary Colors**: Neon Cyan `oklch(0.75 0.15 195)` for holographic interfaces, Electric Magenta `oklch(0.65 0.22 330)` for warnings
- **Accent Color**: Plasma Green `oklch(0.85 0.20 145)` - Terminal success states, data streams
- **Foreground/Background Pairings**:
  - Background (Void Black `oklch(0.12 0 0)`): Cyan text `oklch(0.90 0.12 195)` - Ratio 14.8:1 ✓
  - Card (Glass Black `oklch(0.18 0 0 / 0.8)`): Cyan text `oklch(0.90 0.12 195)` - Ratio 12.1:1 ✓
  - Primary (Neon Cyan `oklch(0.75 0.15 195)`): Black text `oklch(0.12 0 0)` - Ratio 9.3:1 ✓
  - Accent (Plasma Green `oklch(0.85 0.20 145)`): Black text `oklch(0.12 0 0)` - Ratio 13.7:1 ✓

**Medieval (Royal Court)**:
- **Primary Color**: Castle Stone `oklch(0.40 0.01 60)` - Weathered fortress walls
- **Secondary Colors**: Royal Crimson `oklch(0.45 0.20 25)` for authority, Heraldic Gold `oklch(0.75 0.15 80)` for prestige
- **Accent Color**: Crown Ruby `oklch(0.55 0.25 20)` - Rewards and achievements
- **Foreground/Background Pairings**:
  - Background (Stone `oklch(0.25 0.01 60)`): Light parchment `oklch(0.95 0.05 80)` - Ratio 13.2:1 ✓
  - Card (Stone Glass `oklch(0.35 0.01 60 / 0.75)`): Parchment text `oklch(0.95 0.05 80)` - Ratio 9.8:1 ✓
  - Primary (Crimson `oklch(0.45 0.20 25)`): Light text `oklch(0.98 0 0)` - Ratio 7.1:1 ✓
  - Accent (Ruby `oklch(0.55 0.25 20)`): White text `oklch(0.98 0 0)` - Ratio 5.2:1 ✓

**Modern (Glass Classroom)**:
- **Primary Color**: Clean White `oklch(0.98 0 0)` - Minimalist clarity
- **Secondary Colors**: Sky Blue `oklch(0.65 0.12 230)` for interactive elements, Soft Grey `oklch(0.70 0 0)` for structure
- **Accent Color**: Learning Orange `oklch(0.70 0.15 50)` - Engagement and energy
- **Foreground/Background Pairings**:
  - Background (White `oklch(0.98 0 0)`): Charcoal text `oklch(0.25 0 0)` - Ratio 14.1:1 ✓
  - Card (Glass White `oklch(0.96 0 0 / 0.9)`): Charcoal text `oklch(0.25 0 0)` - Ratio 13.2:1 ✓
  - Primary (Sky Blue `oklch(0.65 0.12 230)`): White text `oklch(0.98 0 0)` - Ratio 5.9:1 ✓
  - Accent (Orange `oklch(0.70 0.15 50)`): Dark text `oklch(0.20 0 0)` - Ratio 8.5:1 ✓

## Font Selection

Typography should reinforce each theme's narrative while maintaining exceptional readability across dense content.

**Fantasy**: Cinzel (headers) + Crimson Pro (body) - Elegant serifs that evoke medieval manuscripts and arcane tomes
**Sci-Fi**: Orbitron (headers) + Roboto Mono (body) - Geometric and monospaced fonts suggesting computer terminals and digital displays
**Medieval**: IM Fell English (headers) + Lora (body) - Classic blackletter feel softened with readable serif body
**Modern**: Inter (universal) - Clean, highly legible sans-serif for professional education environment

- **Typographic Hierarchy**:
  - H1 (Page Title/Realm Name): Theme-specific Bold / 36px / tight (-0.02em)
  - H2 (Section Headers): Theme-specific Semibold / 28px / tight (-0.01em)
  - H3 (Quest Titles): Theme-specific Semibold / 20px / normal
  - Body (Descriptions/Content): Theme-specific Regular / 16px / relaxed (1.6 line-height)
  - UI Labels: Theme-specific Medium / 14px / normal / uppercase for buttons
  - Captions (XP/Stats): Theme-specific Regular / 12px / wide (0.05em)

## Animations

Animations should feel powerful and consequential while maintaining clarity - every motion should communicate meaning, whether it's the weight of a successful quest submission or the ethereal float of glass panels.

- **Purposeful Meaning**: Motion reinforces the "living world" metaphor - particles drift to show depth, UI panels slide from impossible spaces (like HUD elements materializing), quest cards flip to reveal results creating dramatic reveals
- **Hierarchy of Movement**:
  - Critical (Quest submission result, Level up): 800ms dramatic scale + glow pulse + screen flash
  - Important (XP gain, Constellation star lighting): 500ms smooth fade-in + subtle scale
  - Standard (Navigation, Panel transitions): 300ms ease-out slides
  - Ambient (Particle drift, 3D rotation): Continuous slow motion at 0.2-0.5 speed
  - Micro (Button hover, Card lift): 150ms spring-like response

## Component Selection

- **Components**: 
  - **Dialog** for Quest submission interface and Knowledge Crystal modals (full-screen overlay)
  - **Card** for Quest items, Artifacts in inventory, Knowledge Crystals (with custom glass styling)
  - **Progress** for XP bar (styled as liquid/energy fill)
  - **Tabs** for switching between Quests/Archives/Constellation within a Realm
  - **Button** with heavy customization for theme-specific glows and hover states
  - **Textarea** for quest submissions
  - **Badge** for XP values, due dates, quest difficulty
  - **Separator** for subtle dividing lines in glass panels
  - **Tooltip** for artifact hover details and stat explanations
  - **ScrollArea** for long quest lists and archive content

- **Customizations**:
  - Custom 3D canvas component using Three.js for Realm Map (floating geometries with raycasting for clicks)
  - Custom Constellation canvas using Canvas API for connected star visualization
  - Custom glass panel wrapper with backdrop-blur-xl and theme-specific borders/glows
  - Custom XP bar with animated gradient fill and particle burst on level-up
  - Custom "Oracle Voice" component for AI feedback with typewriter effect

- **States**:
  - Buttons: Default (glass with border), Hover (lift + glow + brighten), Active (scale down), Disabled (50% opacity + no glow)
  - Quest Cards: Locked (greyed + lock icon), Available (pulsing border), In Progress (orange accent), Completed (green check + lit effect), Failed (red + redemption link)
  - Constellation Stars: Unlit (grey circle), Lit (golden glow + rays), Active/Hover (scale + tooltip)
  - 3D Nodes: Idle (slow rotation), Hover (faster rotation + glow + scale 1.2x), Active (zoom camera toward)

- **Icon Selection**: 
  - @phosphor-icons: `Sword`, `Castle`, `Scroll`, `Crown` (Fantasy) | `Brain`, `Terminal`, `CircuitBoard`, `Cube` (Sci-Fi) | `Shield`, `Flag`, `Scepter` (Medieval) | `Book`, `GraduationCap`, `ChalkboardTeacher` (Modern)
  - Navigation: `House` (World Map), `User` (Character), `BookOpen` (Archives), `Target` (Quests)
  - Actions: `Play` (Start Quest), `PaperPlaneRight` (Submit), `ArrowCounterClockwise` (Retry), `Star` (Favorite)

- **Spacing**: 
  - Glass panels: `p-6` internal padding, `gap-4` between sections
  - Card grids: `gap-6` for quest lists, `gap-4` for inventory items
  - Sidebar: `space-y-6` for major sections, `space-y-2` for menu items
  - Form fields: `space-y-4` for question groups
  - Consistent `border-2` for glass panel borders, `rounded-xl` for cards, `rounded-full` for avatar/badges

- **Mobile**: 
  - Sidebar collapses to hamburger menu at <768px
  - 3D Realm Map shows single centered node with left/right arrows for navigation (replaces mouse parallax)
  - Quest cards stack vertically in single column
  - Constellation view allows pinch-zoom instead of fixed viewport
  - XP bar moves to top of screen as sticky header
  - Inventory grid reduces to 2 columns on mobile
  - All glass panels become full-width with reduced blur for performance
