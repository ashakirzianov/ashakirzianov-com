'use client'
import { LaunchProps, launcher } from '@/sketcher'
import { useEffect } from 'react'
import { getCanvasFromRef, useCanvases } from '@/utils/canvas'

type SketcherProps<S> = Omit<LaunchProps<S>, 'getCanvas'>
export function Sketcher<State>({
    scene, dimensions, period, skip, chunk
}: SketcherProps<State> & {
    dimensions?: [width: number, height: number],
}) {
    const actualDimensions = dimensions ?? scene.dimensions ?? [undefined, undefined]
    const { node, refs } = useCanvases(actualDimensions, scene.layers.length)
    useEffect(() => {
        const { start, cleanup } = launcher({
            scene,
            period, skip, chunk,
            getCanvas: idx => getCanvasFromRef(
                refs[idx],
                scene.layers[idx]?.kind === '3d' ? 'webgl' : '2d',
            ),
        })
        start()

        return cleanup
    }, [node, refs, scene, period, skip, chunk])
    return node
}

export function useSketcherPlayer<State>(props: SketcherProps<State> & {
    dimensions?: [width: number, height: number],
}) {
    const dimensions = props.dimensions ?? props.scene.dimensions ?? [undefined, undefined]
    const layers = props.scene.layers
    const { node, refs } = useCanvases(dimensions, layers.length)
    const { start, pause, isPaused, cleanup } = launcher({
        ...props,
        getCanvas: idx => getCanvasFromRef(
            refs[idx],
            props.scene.layers[idx]?.kind === '3d' ? 'webgl' : '2d',
        ),
    })
    function setPlay(play: boolean) {
        if (isPaused() && play) {
            start()
        } else if (!isPaused() && !play) {
            pause()
        }
    }
    return { node, setPlay, cleanup }
}