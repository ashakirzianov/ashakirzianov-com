import exp from 'constants'
import { Box, boxRange } from './box'
import {
    Color, ColorStop, fromRGBA, multRGBA, resolveColor, resolvePrimitiveColor, RGBAColor, unifromStops,
} from './color'
import { NumRange, rangeLength } from './range'
import { Vector } from './vector'

export type Canvas2DContext = CanvasRenderingContext2D
export type Canvas3DContext = WebGLRenderingContext
export type CanvasContext = Canvas2DContext | Canvas3DContext
export type SketcherCanvas<Context> = {
    context: Context,
    width: number,
    height: number,
}
export type Canvas2d = SketcherCanvas<Canvas2DContext>
export type RenderProps<State, Context = Canvas2DContext> = {
    canvas: SketcherCanvas<Context>,
    frame: number,
    state: State,
}
export type Render<State, Context = Canvas2DContext> = (props: RenderProps<State, Context>) => void

export type WithSets<T> = { sets: T[] }
export function objectSetsRender<ObjectT>(drawObject: (props: { canvas: Canvas2d, object: ObjectT }) => void,
): Render<WithSets<ObjectT[]>> {
    return function render({ canvas, state }) {
        for (const set of state.sets) {
            for (const object of set) {
                drawObject({ canvas, object })
            }
        }
    }
}

export type ShapeProps = {
    lineWidth?: number,
    fill?: Color,
    stroke?: Color,
    center: Vector,
    context: Canvas2DContext,
}

export function rect({
    lineWidth, fill, stroke,
    center: { x, y }, width, height,
    rotation,
    context,
}: ShapeProps & {
    width: number,
    height: number,
    rotation?: number,
}) {
    context.save()
    context.translate(x - width / 2, y - width / 2)
    if (rotation) {
        context.rotate(rotation)
    }
    if (lineWidth) {
        context.lineWidth = lineWidth
    }
    if (fill) {
        context.fillStyle = resolveColor(fill, context)
        context.fillRect(
            -width / 2, -height / 2,
            width, height,
        )
    }
    if (stroke) {
        context.strokeStyle = resolveColor(stroke, context)
        context.strokeRect(
            -width / 2, -height / 2,
            width, height,
        )
    }
    context.restore()
}

export function square({
    radius, rotation, ...rest
}: ShapeProps & {
    radius: number,
    rotation?: number,
}) {
    rect({
        width: radius,
        height: radius,
        rotation,
        ...rest,
    })
}

export function circle({
    lineWidth, fill, stroke,
    center: { x, y }, radius,
    context,
}: ShapeProps & {
    radius: number,
}) {
    context.save()
    if (lineWidth) {
        context.lineWidth = lineWidth
    }
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    if (fill) {
        context.fillStyle = resolveColor(fill, context)
        context.fill()
    }
    if (stroke) {
        context.strokeStyle = resolveColor(stroke, context)
        context.stroke()
    }
    context.restore()
}

export function ellipse({
    lineWidth, fill, stroke,
    center: { x, y }, radius, radius2, rotation,
    context,
}: ShapeProps & {
    rotation: number,
    radius: number,
    radius2: number,
}) {
    context.save()
    if (lineWidth) {
        context.lineWidth = lineWidth
    }
    context.beginPath()
    context.ellipse(x, y, radius, radius2, rotation, 0, Math.PI * 2)
    if (fill) {
        context.fillStyle = resolveColor(fill, context)
        context.fill()
    }
    if (stroke) {
        context.strokeStyle = resolveColor(stroke, context)
        context.stroke()
    }
    context.restore()
}

export function concentringCircles({
    context, position, radius, fills,
}: {
    context: Canvas2DContext,
    position: Vector,
    radius: number,
    fills: Color[],
}) {
    const n = fills.length
    for (let i = 0; i < n; i++) {
        const fill = fills[i]!
        circle({
            context, fill, center: position,
            radius: radius * (n - i + 1) / n,
        })
    }
}

export function strokeDimensions({
    context, color, dimensions,
}: {
    color: Color,
    dimensions: {
        x: NumRange,
        y: NumRange,
    },
    context: Canvas2DContext,
}) {
    context.save()
    context.strokeStyle = resolveColor(color, context)
    context.strokeRect(
        dimensions.x.min, dimensions.y.min,
        rangeLength(dimensions.x), rangeLength(dimensions.y),
    )
    context.restore()
}

export function colorRect({
    context, width, height, start: { x, y },
    colors: [top, bottom, left, right],
}: {
    context: Canvas2DContext,
    start: Vector,
    width: number,
    height: number,
    colors: [Color, Color, Color, Color],
}) {
    context.save()
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x, height)
    context.strokeStyle = resolveColor(left, context)
    context.stroke()
    context.beginPath()
    context.moveTo(x, height)
    context.lineTo(width, height)
    context.strokeStyle = resolveColor(bottom, context)
    context.stroke()
    context.beginPath()
    context.moveTo(width, height)
    context.lineTo(width, y)
    context.strokeStyle = resolveColor(right, context)
    context.stroke()
    context.beginPath()
    context.moveTo(width, y)
    context.lineTo(x, y)
    context.strokeStyle = resolveColor(top, context)
    context.stroke()
    context.restore()
}

export function drawCorner({
    canvas, offset, angle, border, color,
}: {
    canvas: Canvas2d,
    offset: number,
    angle: number,
    border?: number,
    color: RGBAColor,
}) {
    const { context, width, height } = canvas
    context.save()

    function wall({
        stops, border,
    }: {
        stops: ColorStop[],
        border?: number,
    }) {
        context.save()
        const gradient = context.createLinearGradient(0, 0, 0, height)
        stops.forEach(
            ({ offset, color }) => gradient.addColorStop(offset, resolvePrimitiveColor(color)),
        )

        context.fillStyle = gradient
        context.fillRect(0, 0, width, height)

        if (border) {
            context.lineWidth = 2
            context.strokeStyle = 'black'
            context.beginPath()
            context.moveTo(0, height)
            context.lineTo(width, height)
            context.lineTo(width, 0)
            context.stroke()
        }
        context.restore()
    }

    const base = fromRGBA(color)
    const lightest = fromRGBA(multRGBA(color, 1.2))
    const light = fromRGBA(multRGBA(color, 1.05))
    const dark = fromRGBA(multRGBA(color, 0.95))
    context.fillStyle = lightest
    context.fillRect(0, 0, width, height)
    const skew = Math.cos(-Math.PI * angle)
    context.save()
    context.translate(-offset * width, 0)
    context.transform(1, skew, 0, 1, 0, 0)
    wall({
        stops: unifromStops([base, light]),
        border,
    })
    context.restore()
    context.save()
    context.scale(-1, 1)
    context.translate(-width, 0)
    context.translate(-(1 - offset) * width, 0)
    context.transform(1, skew, 0, 1, 0, 0)
    wall({
        stops: unifromStops([dark, base]),
        border,
    })
    context.restore()

    context.restore()
}

export function clearCanvas(canvas: Canvas2d) {
    canvas.context.save()
    canvas.context.resetTransform()
    canvas.context.clearRect(0, 0, canvas.width, canvas.height)
    canvas.context.restore()
}

export function clearFrame({ color, canvas: { context, width, height } }: {
    color: Color,
    canvas: Canvas2d,
}) {
    context.save()
    context.resetTransform()
    context.scale(width, height)
    context.fillStyle = resolveColor(color, context)
    context.fillRect(0, 0, 1, 1)
    context.restore()
}

export function zoomToFit({ canvas, box }: {
    canvas: Canvas2d,
    box: Box,
}) {
    const { widthRange, heightRange } = boxRange(box)
    const uwidth = rangeLength(widthRange)
    const uheight = rangeLength(heightRange)
    const xratio = canvas.width / uwidth
    const yratio = canvas.height / uheight
    const ratio = Math.min(xratio, yratio)
    const shiftx = (canvas.width - uwidth * ratio) / 2
    const shifty = (canvas.height - uheight * ratio) / 2
    canvas.context.translate(
        shiftx, shifty,
    )
    canvas.context.scale(ratio, ratio)
    canvas.context.translate(
        - widthRange.min,
        - heightRange.min,
    )
}

export function zoomToFill({ canvas, box }: {
    canvas: Canvas2d,
    box: Box,
}) {
    const { widthRange, heightRange } = boxRange(box)
    const uwidth = rangeLength(widthRange)
    const uheight = rangeLength(heightRange)
    const xratio = canvas.width / uwidth
    const yratio = canvas.height / uheight
    const ratio = Math.max(xratio, yratio)
    const shiftx = (canvas.width - uwidth * ratio) / 2
    const shifty = (canvas.height - uheight * ratio) / 2
    canvas.context.translate(
        shiftx, shifty,
    )
    canvas.context.scale(ratio, ratio)
    canvas.context.translate(
        - widthRange.min,
        - heightRange.min,
    )
}

export function centerOnPoint({ canvas, point }: {
    point: Vector,
    canvas: Canvas2d,
}) {
    canvas.context.translate(-point.x, -point.y)
}

export function renderMask(
    context: Canvas2DContext,
    render: (context: Canvas2DContext) => void,
) {
    context.save()
    context.globalCompositeOperation = 'destination-out'
    context.fillStyle = 'black'
    render(context)
    context.restore()
}

// Draws grid lines on the canvas
export function drawGrid({
    canvas, rows, columns,
    lineWidth, color,
}: {
    canvas: Canvas2d,
    rows: number,
    columns: number,
    lineWidth?: number,
    color?: Color,
}) {
    // Draw grid
    const { context, width, height } = canvas
    context.save()
    if (lineWidth) {
        context.lineWidth = lineWidth
    }
    if (color) {
        context.strokeStyle = resolveColor(color, context)
    }
    context.beginPath()
    for (let i = 1; i < rows; i++) {
        context.moveTo(0, i * height / rows)
        context.lineTo(width, i * height / rows)
    }
    for (let i = 1; i < columns; i++) {
        context.moveTo(i * width / columns, 0)
        context.lineTo(i * width / columns, height)
    }
    context.stroke()
    context.restore()
}

export function drawBlueprint({
    canvas,
    // background = 'rgb(69,142,204)',
    background,
    lineColor = 'rgb(155,239,248)',
    rows = 4, columns = 3,
}: {
    canvas: Canvas2d,
    lineColor?: Color,
    background?: Color,
    rows?: number,
    columns?: number,
}) {
    if (background) {
        clearFrame({ canvas, color: background })
    }
    drawGrid({
        canvas,
        lineWidth: .4,
        rows: rows,
        columns: columns,
        color: lineColor,
    })
    drawGrid({
        canvas,
        lineWidth: .2,
        rows: rows * 2,
        columns: columns * 2,
        color: lineColor,
    })
    drawGrid({
        canvas,
        lineWidth: .1,
        rows: rows * 10,
        columns: columns * 10,
        color: lineColor,
    })
}