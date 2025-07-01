# Copilot Familiarization

## Project Overview
This is a crochet project management and pattern design app.

- **Frontend:** Vue.js (using Vite)
- **Backend:** .NET 9 (ASP.NET Core)
- The main focus is on a grid-based crochet pattern designer, where users can select stitch types, shapes, grid sizes, colors, and zoom level.

## Key Components
- **App.vue**: The root component. Manages the main state (selected stitch type, shape, grid size, zoom, color, and the 2D grid of stitches). Handles import/export of grid data as JSON, and passes state/handlers to child components.
- **SidePanel.vue**: The left sidebar. Lets users pick stitch type, color, shape, grid size, and zoom. Emits events to update the main state in `App.vue`. Also provides buttons for grid reset, export, and import.
- **ShapePreview.vue**: The main content area. Renders the crochet grid as an SVG, supporting different shapes (Square, Rectangle, Circle, Triangle). Handles drawing, panning, and visualizing stitches with their types and colors.

## State Management
- State is managed locally in `App.vue` using Vue's `ref` and `computed`.
- Props and events are used for communication between `App.vue` and its children (`SidePanel` and `ShapePreview`).

## Features
- Users can select stitch type, color, shape, grid size, and zoom.
- The grid is interactive: users can "draw" stitches by clicking or touching cells.
- The grid can be exported/imported as JSON, preserving all relevant data.
- The preview supports panning (right-click drag) and zooming.
- The UI is responsive, with a mobile menu for the sidebar.

## Styling
- Uses scoped CSS for each component.
- The app uses a two-column layout with a styled sidebar and a scrollable, resizable preview area.

## State Management Libraries
- No external state management (like Pinia or Vuex) is used.

---
If you need a deeper dive into a specific part of the codebase or want to know how to extend or modify a feature, let me know!
