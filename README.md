# Advent Calendar 2025

A web-based Advent Calendar for 2025, featuring daily reveals, folklore, traditions, and mini-games.

[**Live Demo**](https://clementad.github.io/advent_2025/)

## Features

- **Daily Reveals**: Doors open one by one starting December 1st.
- **Content**: Includes folklore, traditions, history, and interactive mini-games.
- **Persistence**: Remembers opened doors using local storage.
- **Responsive Design**: Works on desktop and mobile.

## Development

### Prerequisites

- Node.js (v20 recommended)
- npm

### Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:
```bash
npm run dev
```
Visit `http://localhost:5173/` (or the URL shown in the terminal).

### Debugging

You can test specific dates by adding the `debug_date` query parameter to the URL:
- `?debug_date=2025-12-05` (Simulates December 5th)
- `?debug_date=2025-12-24` (Simulates Christmas Eve)

## Deployment

The project is deployed to GitHub Pages.

### Manual Deployment

To build and deploy manually:
```bash
npm run build
npm run deploy
```

### CI/CD

This repository is configured with GitHub Actions to automatically deploy changes pushed to the `main` branch.

## Project Structure

- `index.html`: Entry point.
- `main.js`: Main application logic.
- `messages.js`: Data for each day (text, type, source).
- `style.css`: Styles.
- `vite.config.js`: Vite configuration.
