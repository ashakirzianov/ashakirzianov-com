import { colorLayer, combineScenes, fromLayers, gray } from "@/sketcher";
import { balanced } from "../forms";

export function number34() {
    return combineScenes(
        fromLayers(colorLayer(gray(230))),
        balanced(),
    );
}