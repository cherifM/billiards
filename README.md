# Three.js 8-Ball Pool

A realistic 3D 8-ball pool game built with Three.js and Vite, featuring authentic gameplay mechanics and physics simulation.

## Features

### Authentic 8-Ball Pool Experience
- **Numbered balls (1-15)** with correct colors and realistic striped designs
- **Official 8-ball rules** including solids vs stripes assignment
- **Turn-based gameplay** with legal shot validation
- **Win/loss conditions** with proper 8-ball pocketing rules
- **Foul detection** for illegal shots and cue ball scratches

### Realistic Physics
- **Accurate collision detection** with proper ball-to-ball momentum transfer
- **Cushion physics** with realistic bouncing and spin effects
- **Rolling friction** and spin decay simulation
- **Pocket detection** with smooth ball capture animations

### Immersive Audio & Visuals
- **Dynamic sound effects** for collisions, cushions, pockets, and shots
- **Procedural ball textures** with numbers and stripes
- **Smooth camera follow** that tracks the cue ball
- **Professional table design** with authentic proportions

### Intuitive Controls
- **Mouse-based aiming** with visual power feedback
- **Fine aim mode** (hold Shift for precision)
- **Dynamic zoom** with mouse wheel
- **Visual game status** showing current player and ball counts

## Getting Started

**Requirements:** Node.js 18+

### Development
```bash
npm ci
npm run dev
```

Open http://localhost:5173 to start playing.

### Production Build
```bash
npm run build
npm run preview
```

## How to Play

### Basic Controls
- **Aim**: Click and drag to rotate around the cue ball
- **Power**: Drag down to set shot power (visual power bar)
- **Shoot**: Release mouse button to take the shot
- **Fine Aim**: Hold Shift for precise aiming
- **Zoom**: Mouse wheel to zoom in/out
- **Re-rack**: Press 'R' key or click the button

### 8-Ball Rules
1. **Breaking**: Player 1 breaks to start the game
2. **Group Assignment**: First pocketed ball(s) determine solids/stripes
3. **Legal Shots**: Must hit your group first, then pocket your balls
4. **Winning**: Pocket all your group balls, then legally pocket the 8-ball
5. **Fouls**: Scratching, hitting wrong balls first, or illegally pocketing 8-ball

## Technical Architecture

### Core Systems
- **`main.js`** - Application bootstrap and main game loop
- **`scene.js`** - Three.js renderer, lighting, and camera setup
- **`game.js`** - High-level game logic coordination
- **`gamestate.js`** - 8-ball rules engine and turn management

### Physics & Interaction
- **`physics.js`** - Ball physics, collisions, and table interactions
- **`input.js`** - Mouse and keyboard input handling
- **`audio.js`** - Web Audio API sound system

### Game Objects
- **`ball.js`** - Ball creation with numbers, stripes, and physics properties
- **`table.js`** - Billiards table geometry with pockets and cushions
- **`cue.js`** - Cue stick visualization and positioning
- **`utils/math.js`** - Mathematical utilities for physics calculations

## Technical Highlights

- **Procedural Content**: All textures and geometry generated at runtime
- **Performance Optimized**: 60fps physics simulation with delta time stepping
- **Responsive Design**: Automatic canvas resizing and camera adjustment
- **Web Standards**: Pure ES6 modules with no external dependencies beyond Three.js

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **WebGL Required**: Hardware-accelerated graphics support
- **Web Audio**: Sound effects require user interaction to enable
