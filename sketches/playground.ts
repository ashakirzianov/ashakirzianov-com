import {
    velocityStep, gravity, reduceAnimators, arrayAnimator,
    scene, drawImage, zoomToBoundingBox, clearFrame, Scene,
    circle, combineAnimators,
} from '@/sketcher'

async function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

export function playgroundScene(): Scene<any> {
    async function buildState() {
        // Load images once at initialization
        const [circleImg, crownImg] = await Promise.all([
            loadImage('/images/circle.png'),
            loadImage('/images/crown.png'),
        ])

        type ObjectType = {
            position: { x: number, y: number, z: number },
            velocity: { x: number, y: number, z: number },
            mass: number,
            radius: number,
            imageType: 'circle' | 'crown',
            rotation: number,
            angularVelocity: number,
            growthRate: number, // For crowns
        }
        const circleDefault: ObjectType = {
            mass: 2,
            velocity: { x: 0, y: 0, z: 0 },
            position: { x: 0, y: 0, z: 0 },
            radius: 20,
            imageType: 'circle',
            rotation: 0,
            angularVelocity: 0, // No rotation for circles
            growthRate: 0, // No growth for circles
        }

        const circles: ObjectType[] = [
            {
                ...circleDefault,
                velocity: { x: -5, y: 5, z: 0 },
                position: { x: -100, y: -100, z: 0 },
            },
            {
                ...circleDefault,
                velocity: { x: 5, y: -5, z: 0 },
                position: { x: 100, y: 100, z: 0 },
            },
            {
                ...circleDefault,
                velocity: { x: -5, y: -5, z: 0 },
                position: { x: 100, y: -100, z: 0 },
            },
            {
                ...circleDefault,
                velocity: { x: 5.5, y: 5, z: 0 },
                position: { x: -100, y: 100, z: 0 },
            },
        ]

        const couchDefault: ObjectType = {
            mass: 20,
            radius: 40,
            imageType: 'crown',
            rotation: 0,
            velocity: { x: 0, y: 0, z: 0 },
            position: { x: 0, y: 0, z: 0 },
            angularVelocity: 0.05, // Random rotation speed between -0.05 and 0.05
            growthRate: 0.05, // Slow growth rate
        }
        const couches: ObjectType[] = [
            {
                ...couchDefault,
                velocity: { x: 1, y: 1, z: 0 },
                position: { x: -10, y: -10, z: 0 },
                angularVelocity: 0.05, // Random rotation speed between -0.05 and 0.05
                growthRate: 0.0, // Slow growth rate
                radius: 80,
            },
        ]

        const sets = [circles, couches]
        return {
            sets,
            crownImage: crownImg,
            circleImage: circleImg,
        }
    }

    const centerGravity = 0.30

    return scene({
        id: 'playground',
        state: buildState(),
        animator: combineAnimators({
            sets: arrayAnimator(reduceAnimators(
                gravity({ gravity: 0.2, power: 2 }),
                gravity({ gravity: -0.002, power: 5 }),
                // Custom center-seeking gravity
                (objects) => {
                    const centerX = 0
                    const centerY = 0

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
                // Custom rotation animator for all objects
                (objects) => {
                    return objects.map(obj => ({
                        ...obj,
                        rotation: obj.rotation + obj.angularVelocity,
                    }))
                },
                // Custom growth animator for crowns
                (objects) => {
                    return objects.map(obj => ({
                        ...obj,
                        radius: obj.radius + obj.growthRate,
                    }))
                },
                velocityStep(),
            )),
            circleImage: image => image,
            crownImage: image => image,
        }),
        layers: [{
            prepare({ canvas }) {
                clearFrame({ canvas, color: 'black' })
            }
        }, {
            // prepare({ canvas, state }) {
            //     zoomToBoundingBox({
            //         canvas,
            //         objects: state.sets.flat(),
            //         scale: 2,
            //     })
            // },
            render({ canvas, state }) {
                canvas.context.save()
                zoomToBoundingBox({
                    canvas,
                    objects: state.sets.flat(),
                    scale: 1.5,
                })
                state.sets.forEach((set) => set.forEach(
                    object => {
                        const kind = object.imageType
                        const image = kind === 'crown'
                            ? state.crownImage
                            : state.circleImage
                        const size = kind === 'crown'
                            ? object.radius * 4
                            : object.radius * 2
                        const width = size
                        const height = size
                        if (kind === 'crown') {
                            drawImage({
                                image,
                                center: object.position,
                                context: canvas.context,
                                width, height,
                                rotation: object.rotation,
                            })
                        } else {
                            circle({
                                center: object.position,
                                radius: object.radius,
                                context: canvas.context,
                                fill: { h: 50, s: 100, l: 60 },
                                stroke: 'black',
                                // stroke: { h: 50, s: 100, l: 30 },
                                lineWidth: 1,
                            })
                        }
                    }
                ))
                canvas.context.restore()
            },
        }],
    })
}