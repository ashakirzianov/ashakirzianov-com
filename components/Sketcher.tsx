'use client'
import { LaunchProps, launcher } from '@/sketcher'
import { useEffect } from 'react'
import { getCanvasFromRef, useCanvases } from '@/utils/canvas'

type SketcherProps<S> = Omit<LaunchProps<S>, 'getCanvas'>
export function Sketcher<State>(props: SketcherProps<State> & {
    dimensions?: [width: number, height: number],
}) {
    const dims = Array(props.scene.layers.length).fill(props.dimensions ?? props.scene.dimensions ?? [undefined, undefined])
    const { node, refs } = useCanvases(dims)
    useEffect(() => {
        const { start, cleanup } = launcher({
            ...props,
            getCanvas: idx => getCanvasFromRef(
                refs[idx],
                props.scene.layers[idx]?.kind === '3d' ? 'webgl' : '2d',
            ),
        })
        start()

        return cleanup
    }, [])
    return node
}

export function useSketcherPlayer<State>(props: SketcherProps<State> & {
    dimensions?: [width: number, height: number],
}) {
    const dims = Array(props.scene.layers.length).fill(props.dimensions ?? props.scene.dimensions ?? [undefined, undefined])
    const { node, refs } = useCanvases(dims)
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