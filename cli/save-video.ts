import fs from 'fs'
import path from 'path'
import os from 'os'
import { Canvas, createCanvas } from 'canvas'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'
import { collections } from '@/sketches'
import {
  SketcherCanvas, Canvas2DContext, CanvasContext, Scene,
  sceneId, launcher,
} from '@/sketcher'
import type { CommandLineArgs } from './index'

// Set ffmpeg binary path
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic)
}

export async function handleSaveVideoCommand({ switches, commands }: CommandLineArgs) {
  const [name] = commands
  const [collectionId, sketchId] = name?.split('/') ?? []
  if (!collectionId || !sketchId) {
    throw new Error('Usage: save-video <collectionId>/<sketchId> [--width <width>] [--duration <duration>] [--fps <fps>] [--output <outputPath>]')
  }
  const width = parseInt(switches.width ?? '800')
  const height = switches.height
    ? parseInt(switches.height)
    : undefined
  const duration = parseInt(switches.duration ?? '3000') // Default 3 seconds
  const fps = parseInt(switches.fps ?? '30') // Default 30fps
  const outputPath = switches.output
    ? path.resolve(switches.output)
    : path.join('output', `${collectionId}-${sketchId}-${duration}ms.mp4`)

  return saveSketchVideo({
    collectionId,
    sketchId,
    width,
    height,
    duration,
    fps,
    outputPath,
  })
}

// Main function to save a sketch video to a file
async function saveSketchVideo({
  collectionId,
  sketchId,
  width,
  height,
  duration,
  fps,
  outputPath,
}: {
  collectionId: string,
  sketchId: string,
  width: number,
  height?: number,
  duration: number,
  fps: number,
  outputPath: string,
}) {
  // Find the specified collection
  const collection = collections.find(c => c.id === collectionId)
  if (!collection) {
    throw new Error(`Collection '${collectionId}' not found`)
  }

  // Find the specified sketch in the collection
  const sketch = collection.sketches.find(s => {
    // Try to match by id field first
    if (s.id === sketchId) {
      return true
    }
    // Otherwise use sceneId function to derive id from title
    const id = sceneId(s)
    return id === sketchId
  })

  if (!sketch) {
    throw new Error(`Sketch '${sketchId}' not found in collection '${collectionId}'`)
  }

  if (!height) {
    // Calculate height based on aspect ratio
    if (sketch.dimensions) {
      const [sketchWidth, sketchHeight] = sketch.dimensions
      // Use sketch's aspect ratio if dimensions are available
      const aspectRatio = sketchWidth / sketchHeight
      height = Math.round(width / aspectRatio)
    } else {
      // Default to square if no dimensions provided
      height = width
    }
  }

  // Create temporary directory for frames
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sketch-video-'))
  const totalFrames = Math.ceil(fps * (duration / 1000))
  console.log(`Generating ${totalFrames} frames...`)

  try {
    // Generate frames
    const buffers = frameBufferGenerator({
      scene: sketch,
      width,
      height,
      duration,
      fps: 25,
    })
    let frameIndex = 0
    for await (const buffer of buffers) {
      const frameFilename = `frame_${frameIndex.toString().padStart(6, '0')}.png`
      const frameFilepath = path.join(tempDir, frameFilename)
      fs.writeFileSync(frameFilepath, buffer as any as Uint8Array)

      // Show progress
      if (frameIndex % 10 === 0 || frameIndex === totalFrames - 1) {
        console.log(`Generated frame ${frameIndex + 1}/${totalFrames}`)
      }
      frameIndex++
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Create video from frames
    console.log('Creating video...')
    await createVideoFromFrames(tempDir, outputPath, fps)

    console.log(`Saved video to ${outputPath}`)
    return outputPath
  } finally {
    // Cleanup temporary directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true })
    } catch (error) {
      console.warn(`Failed to cleanup temp directory: ${error}`)
    }
  }
}

async function* frameBufferGenerator({
  scene, width, height, fps = 25, duration
}: {
  scene: Scene<any>,
  width: number,
  height: number,
  duration: number,
  fps: number | undefined,
}): AsyncGenerator<Buffer> {
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
        throw new Error(`Unsupported sketch: Layer ${idx} is not a 2D layer`)
      }
      let canvasObject = canvases[idx]
      if (!canvasObject) {
        // Create a canvas with the specified dimensions
        const renderCanvas = createCanvas(width, height)
        const context = renderCanvas.getContext('2d') as any as Canvas2DContext

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
  const totalFrames = Math.ceil(fps ? (duration / 1000) * fps : 1)
  const frameDuration = duration / fps
  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
    start()
    await delay(frameDuration)
    pause()
    const finalCanvas = createCanvas(width, height)
    const finalContext = finalCanvas.getContext('2d')
    for (const canvas of canvases) {
      if (canvas) {
        finalContext.drawImage(canvas.canvas, 0, 0, width, height)
      }
    }
    yield finalCanvas.toBuffer('image/png')
  }
  cleanup()
}

async function createVideoFromFrames(framesDir: string, outputPath: string, fps: number): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(path.join(framesDir, 'frame_%06d.png'))
      .inputFPS(fps)
      .videoCodec('libx264')
      .outputOptions([
        '-pix_fmt yuv420p', // Ensure compatibility with most players
        '-crf 18', // High quality
      ])
      .output(outputPath)
      .on('end', () => {
        console.log('Video encoding completed')
        resolve()
      })
      .on('error', (err) => {
        console.error('Error during video encoding:', err)
        reject(err)
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`Encoding progress: ${Math.round(progress.percent)}%`)
        }
      })
      .run()
  })
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}