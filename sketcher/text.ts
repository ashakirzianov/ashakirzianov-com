import { Canvas2DContext, Color, Vector2d } from "./base";
import { resolveColor } from "./color";

export function drawText({
    context, text, family, size, fill, stroke,
    position: [x, y],
}: {
    context: Canvas2DContext,
    position: Vector2d,
    text: string,
    family: string,
    size: number,
    fill?: Color,
    stroke?: Color,
}) {
    context.save();
    context.font = `${size}px ${family}`;
    if (fill) {
        context.fillStyle = resolveColor(fill);
        context.fillText(text, x, y);
    }
    if (stroke) {
        context.strokeText(text, x, y);
    }
    context.restore();
}