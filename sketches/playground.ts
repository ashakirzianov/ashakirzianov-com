import {
    velocityStep, gravity, reduceAnimators, arrayAnimator,
    cubicBox, scene, drawImage,
    gray, randomObject, zoomToBoundingBox, clearFrame, Scene,
} from '@/sketcher'

let circleImage: HTMLImageElement | null = null
let crownImage: HTMLImageElement | null = null

function loadCircleImage(): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        if (circleImage) {
            resolve(circleImage)
            return
        }
        const img = new Image()
        img.onload = () => {
            circleImage = img
            resolve(img)
        }
        img.onerror = reject
        img.src = '/images/circle.png'
    })
}

function loadCrownImage(): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        if (crownImage) {
            resolve(crownImage)
            return
        }
        const img = new Image()
        img.onload = () => {
            crownImage = img
            resolve(img)
        }
        img.onerror = reject
        img.src = '/images/crown.png'
    })
}

export async function playgroundScene(): Promise<Scene<any>> {
    // Load images once at initialization
    const [circleImg, crownImg] = await Promise.all([
        loadCircleImage(),
        loadCrownImage()
    ])

    const maxVelocity = 5
    const fixedMass = 2
    const fixedRadius = 50
    const box = cubicBox(500)

    // First set: 4 circle objects
    const circleSet = Array(4).fill(undefined).map(() => {
        const obj = randomObject({
            massRange: { min: fixedMass, max: fixedMass },
            maxVelocity,
            box,
            rToM: 1,
        })
        obj.radius = fixedRadius
        ;(obj as any).imageType = 'circle'
        return obj
    })

    // Second set: 3 crown objects
    const crownSet = Array(3).fill(undefined).map(() => {
        const obj = randomObject({
            massRange: { min: fixedMass, max: fixedMass },
            maxVelocity,
            box,
            rToM: 1,
        })
        obj.radius = fixedRadius
        ;(obj as any).imageType = 'crown'
        ;(obj as any).rotation = 0
        ;(obj as any).rotationSpeed = (Math.random() - 0.5) * 0.1 // Random rotation speed between -0.05 and 0.05
        return obj
    })

    const sets = [circleSet, crownSet]

    return scene({
        id: 'playground',
        state: sets,
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.2, power: 2 }),
            gravity({ gravity: -0.002, power: 5 }),
            // Custom center-seeking gravity
            (objects) => {
                const centerX = 0
                const centerY = 0
                const centerGravity = 0.5

                return objects.map(obj => {
                    const dx = centerX - obj.position.x
                    const dy = centerY - obj.position.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance > 0) {
                        const force = centerGravity / obj.mass
                        const normalizedDx = dx / distance
                        const normalizedDy = dy / distance

                        return {
                            ...obj,
                            velocity: {
                                x: obj.velocity.x + normalizedDx * force,
                                y: obj.velocity.y + normalizedDy * force,
                                z: obj.velocity.z, // Assuming 2D for simplicity
                            }
                        }
                    }

                    return obj
                })
            },
            // Custom rotation animator for crowns
            (objects) => {
                return objects.map(obj => {
                    if ((obj as any).imageType === 'crown') {
                        const rotation = (obj as any).rotation || 0
                        const rotationSpeed = (obj as any).rotationSpeed || 0
                        ;(obj as any).rotation = rotation + rotationSpeed
                    }
                    return obj
                })
            },
            velocityStep(),
        )),
        layers: [{
            prepare({ canvas }) {
                clearFrame({ canvas, color: gray(230) })
            }
        }, {
            prepare({ canvas, state }) {
                zoomToBoundingBox({
                    canvas,
                    objects: state.flat(),
                    scale: 1.2,
                })
            },
            render({ canvas, state }) {
                state.forEach((set) => set.forEach(
                    object => {
                        const image = (object as any).imageType === 'crown' ? crownImg : circleImg
                        const rotation = (object as any).imageType === 'crown' ? (object as any).rotation : undefined
                        drawImage({
                            image,
                            center: object.position,
                            context: canvas.context,
                            width: object.radius * 2,
                            height: object.radius * 2,
                            rotation,
                        })
                    }
                ))
            },
        }],
    })
}