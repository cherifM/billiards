# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm ci` - Install dependencies
- `npm run dev` - Start development server on http://localhost:5173
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally

## Architecture

This is a Three.js-based 3D billiards game using Vite as the build tool. The architecture follows a modular pattern with clear separation of concerns:

**Core Systems:**
- **main.js**: Application bootstrap, main game loop, and DOM event handling
- **scene.js**: Three.js renderer, scene setup, camera, and lighting configuration
- **game.js**: Game state management and high-level game logic coordination

**Game Logic:**
- **physics.js**: Ball physics simulation, collision detection, cushion/pocket interactions
- **input.js**: Mouse and keyboard input handling for aiming and controls
- **ball.js**: Ball geometry creation and ball set management
- **cue.js**: Cue stick visualization and positioning
- **table.js**: Billiards table geometry and dimensions

**Key Patterns:**
- Each module exports creation functions (e.g., `createGame`, `createRenderer`)
- Game state is centralized in the `state` object passed between systems
- Physics runs at 60fps with delta time for consistent simulation
- Camera follows cue ball with smooth interpolation using `lerp()`

**Input System:**
- Click and drag for aiming (yaw rotation) and power setting
- Shift key enables fine aiming mode
- Mouse wheel controls camera zoom
- 'R' key and button trigger ball re-racking

**Physics Constants:**
- Located in physics.js: gravity, friction coefficients, restitution values
- Ball collisions use simplified sphere-sphere collision detection
- Cushion bounces and pocket detection are handled separately

The codebase uses ES6 modules and modern JavaScript features. All materials and geometry are procedurally generated without external textures.