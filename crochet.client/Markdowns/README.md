# Crochet App

This project is a crocheting app built with the following technologies:

- **Frontend:** Vue.js (with Vite)
- **Backend:** .NET 9 (ASP.NET Core)

## Project Structure

- `crochet.client/` — Vue.js frontend application (Vite-powered)
- `Crochet.Server/` — .NET 9 backend API

## Purpose

This app is designed to help users manage their crocheting projects. Planned features may include:
- Project tracker
- Pattern library
- Yarn inventory
- Tools and supplies list
- Progress photos and notes

## Getting Started

1. Run the backend (.NET 9 API) from the `Crochet.Server` directory.
2. Run the frontend (Vue app) from the `crochet.client` directory using Vite.

---

## Features and Implementation Progress

### UI and State Management
- The app uses a two-column layout: SidePanel on the left, main content (preview) on the right.
- SidePanel allows users to select:
  - Crochet type (style/technique, e.g., Tunisian Crochet, Filet Crochet, etc.)
  - Crochet shape (Square, Circle, Rectangle, Triangle, Custom)
  - Grid items per row (e.g., 8 for 8x8 grid)
  - Zoom (scales the preview window)
- State for these selections is managed in App.vue and passed to SidePanel and ShapePreview components.

### Shape Preview
- The selected shape and grid are visually rendered in the main content area using the ShapePreview component.
- Supported shapes: Square, Rectangle, Circle, Triangle.
- The grid overlays match the number of grid items per row, and each grid square is 10x10 pixels.
- The preview window can be zoomed in/out using a slider.
- When zoomed in, you can pan (scroll) the preview by right-clicking and dragging.
- The preview window fills all available space in the main-content area and supports both horizontal and vertical scrolling.

### Component Structure
- **App.vue**: Manages state and layout, passes props to SidePanel and ShapePreview.
- **SidePanel.vue**: Receives props and emits updates for crochet type, shape, grid size, and zoom.
- **ShapePreview.vue**: Receives shape, grid size, and zoom as props and renders the corresponding SVG with grid and panning support.

### Styling & Layout
- Uses a flex layout for the main app: SidePanel is fixed width on the left, preview takes the rest.
- Dark background for the app, with SidePanel styled for contrast.
- The preview window is scrollable and resizes to fill the available space.
- Labels use a dark color (#222831) and h2 uses a strong blue (#1769aa) for contrast on a white background.

---

This file serves as a reference for the project’s stack, structure, and implementation progress. Update as the project evolves.
