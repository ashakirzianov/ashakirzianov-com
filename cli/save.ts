import fs from 'fs'
import path from 'path'
import { Canvas, createCanvas } from 'canvas'
import { collections } from '@/sketches'
import {
  SketcherCanvas, Canvas2DContext, CanvasContext, Scene,
  sceneId, launcher,
} from '@/sketcher'
import type { CommandLineArgs } from './index'

export async function handleSaveCommand({ switches, commands }: CommandLineArgs) {
  const [name] = commands
  const [collectionId, sketchId] = name?.split('/') ?? []
  if (!collectionId || !sketchId) {
    throw new Error('Usage: save <collectionId>/<sketchId> [--width <width>] [--time <time>] [--output <outputPath>]');
  }
  const width = parseInt(switches.width ?? '800')
  const height = switches.height
    ? parseInt(switches.height)
    : undefined
  const time = parseInt(switches.time ?? '0')
  const outputPath = switches.output
    ? path.resolve(switches.output)
    : path.join('output', `${collectionId}-${sketchId}-${time}ms.png`)
  return saveSketch({
    collectionId,
    sketchId,
    width,
    height,
    time,
    outputPath,
  })
}

// Main function to save a sketch to a file
async function saveSketch({
  collectionId,
  sketchId,
  width,
  height,
  time,
  outputPath,
}: {
  collectionId: string,
  sketchId: string,
  width: number,
  height?: number,
  time: number,
  outputPath: string,
}) {
  // Find the specified collection
  const collection = collections.find(c => c.id === collectionId);
  if (!collection) {
    throw new Error(`Collection '${collectionId}' not found`);
  }

  // Find the specified sketch in the collection
  const sketch = collection.sketches.find(s => {
    // Try to match by id field first
    if (s.id === sketchId) {
      return true;
    }
    // Otherwise use sceneId function to derive id from title
    const id = sceneId(s);
    return id === sketchId;
  });

  if (!sketch) {
    throw new Error(`Sketch '${sketchId}' not found in collection '${collectionId}'`);
  }

  if (!height) {
    // Calculate height based on aspect ratio
    if (sketch.dimensions) {
      const [sketchWidth, sketchHeight] = sketch.dimensions;
      // Use sketch's aspect ratio if dimensions are available
      const aspectRatio = sketchWidth / sketchHeight;
      height = Math.round(width / aspectRatio);
    } else {
      // Default to square if no dimensions provided
      height = width;
    }
  }

  // Create a buffer from the canvas
  const buffer = await renderSceneToCanvas({
    scene: sketch,
    width,
    height,
    time,
  })

  // Save the buffer to a file
  fs.writeFileSync(outputPath, buffer as any as Uint8Array);

  console.log(`Saved sketch to ${outputPath}`)
  return outputPath;
}

async function renderSceneToCanvas({
  scene, width, height, time,
}: {
  scene: Scene<any>,
  width: number,
  height: number,
  time: number,
}): Promise<Buffer> {
  type CanvasObject = {
    sketcherCanvas: SketcherCanvas<CanvasContext>,
    canvas: Canvas,
  }
  const canvases: CanvasObject[] = []
  const { start, pause, cleanup } = launcher({
    scene,
    period: 40,
    getCanvas: idx => {
      const kind = scene.layers[idx]?.kind
      if (kind !== undefined && kind !== '2d') {
        throw new Error(`Unsupported scetch: Layer ${idx} is not a 2D layer`);
      }
      let canvasObject = canvases[idx]
      if (!canvasObject) {
        // Create a canvas with the specified dimensions
        const renderCanvas = createCanvas(width, height);
        const context = renderCanvas.getContext('2d') as any as Canvas2DContext;

        // Return a wrapper for the canvas
        canvasObject = {
          sketcherCanvas: {
            context,
            width,
            height,
          },
          canvas: renderCanvas,
        }
        canvases[idx] = canvasObject
      }

      return canvasObject.sketcherCanvas
    }
  })
  start()
  await delay(time) // Wait for the scene to start rendering
  pause() // Pause to get the current frame
  cleanup()
  const finalCanvas = createCanvas(width, height)
  const finalContext = finalCanvas.getContext('2d')
  for (const canvas of canvases) {
    if (canvas) {
      finalContext.drawImage(canvas.canvas, 0, 0, width, height);
    }
  }
  return finalCanvas.toBuffer('image/png')
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}