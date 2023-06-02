import { Scene } from "@/sketcher"
import { WebGLRenderer, Scene as ThreeScene, PerspectiveCamera, BoxGeometry, MeshPhongMaterial, Mesh, DirectionalLight } from 'three'

export function playgroundScene(): Scene<any> {
    return {
        id: 'playground',
        state: {},
        layers: [{
            kind: '3d',
            render({ canvas: { context, width, height }, frame }) {
                let r = new WebGLRenderer({
                    context,
                    canvas: context.canvas,
                })
                let scene = new ThreeScene()
                let camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
                let geometry = new BoxGeometry(1, 1, 1)
                const material = new MeshPhongMaterial({ color: 0x00ff00 })
                const cube = new Mesh(geometry, material)
                scene.add(cube)

                const intensity = 1
                const light = new DirectionalLight('#aaaaaa', intensity)
                light.position.set(-1, 2, 4)
                scene.add(light)

                camera.position.z = 5
                camera.position.y = Math.sin(frame / 10) * 2
                camera.position.x = Math.cos(frame / 10) * 2
                camera.lookAt(0, 0, 0)
                r.render(scene, camera)
            },
        }],
    }
}