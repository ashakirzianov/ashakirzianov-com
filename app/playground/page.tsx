'use client'
import { playgroundScene } from '@/sketches/playground'
import { SingleSketchImpl } from '../sketches/[collection]/[sketch]/client'

export default function Playground() {
    return <SingleSketchImpl scene={playgroundScene()} />
}