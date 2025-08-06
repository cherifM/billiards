# Three.js Billiards

A minimal 3D billiards demo built with Three.js and Vite.

## Features
- 16 balls with simple rolling, cushions, and pockets
- Mouse-based aiming and power
- Basic cue visualization and camera follow
- Re-rack control

## Getting started
Requirements: Node 18+.

Install and run in development:

```
npm ci
npm run dev
```

Then open the URL printed by Vite (defaults to http://localhost:5173).

Build for production:

```
npm run build
```

The output is in `dist/`. Preview the build locally:

```
npm run preview
```

## Controls
- Click and drag to aim; drag down to set power
- Release mouse to shoot
- Mouse wheel: zoom
- Hold Shift: fine aim
- R or button: re-rack

## Project structure
- `public/index.html` – HTML entry
- `src/main.js` – app bootstrap and loop
- `src/scene.js` – renderer, scene, camera, resize
- `src/game.js` – game state and update loop
- `src/input.js` – input handling
- `src/physics.js` – collisions, cushions, pockets, motion
- `src/ball.js` – ball geometry and set creation
- `src/cue.js` – cue model and positioning
- `src/table.js` – table model and dimensions
- `src/utils/` – small math helpers

## Notes
- Physics are intentionally simplified for performance and clarity.
- No external textures; only materials and simple geometry.
