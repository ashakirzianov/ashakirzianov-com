# Sketch CLI

This CLI tool allows you to render and save sketches as image files.

## Installation

First, install the required dependencies:

```bash
npm install
```

## Usage

The CLI tool can be used to render and save sketches as PNG images:

```bash
npm run sketch <collection>/<sketch> [--width <width>] [--height <height>] [--time <time_ms>] [--output <filename>]
```

You can also use the longer form:

```bash
npm run cli -- save <collection>/<sketch> [--width <width>] [--time <time_ms>] [--output <filename>]
```

### Arguments

- `<collection>/<sketch>`: The collection and sketch IDs (required)
- `--width <width>`: Canvas width in pixels (default: 1024)
- `--height <height>`: Canvas height in pixels (default: 1024)
- `--time <time_ms>`: Animation time in milliseconds (default: 0)
- `--output <filename>`: Output filename (default: <collection>-<sketch>.png)

### Example

```bash
# Render the 'web' sketch from 'rythm' collection with width 1024px after 1000ms of animation
npm run sketch rythm/web --width 1024 --time 1000

# Render with custom output filename
npm run sketch rythm/web --width 1024 --time 1000 --output my-sketch.png
```

## How It Works

The CLI tool:

1. Finds the specified sketch in the collections
2. Creates an offscreen canvas with the specified dimensions
3. Renders the sketch to the canvas
4. If animation time is specified, runs the animation for the given duration
5. Saves the resulting image as a PNG file