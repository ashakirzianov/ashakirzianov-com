'use client'
import { playgroundScene } from '@/sketches/playground'
import { SingleSketchImpl } from '../sketches/[collection]/[sketch]/client'
import { useEffect, useState } from 'react'
import { Scene } from '@/sketcher'

export default function Playground() {
    const [scene, setScene] = useState<Scene<any> | null>(null)

    useEffect(() => {
        playgroundScene().then(setScene)
    }, [])

    if (!scene) {
        return <div>Loading...</div>
    }

    return <SingleSketchImpl scene={scene} />
}