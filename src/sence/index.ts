import Camera from "./camera"
import { e3, vec3 } from "./vec3"


export class Sence {
    width: number
    height: number
    camera: Camera
    constructor(height: number, width: number) {
        this.height = height
        this.width = width

        this.camera = new Camera(
            vec3(-2, 2, 1),
            vec3(0, 0, -1),
            vec3(0, 1, 0),
            90, width / height
        )
    }
    render(left: number, top: number):[number,number,number] {
        const x = left / this.width
        const y = 1 - top / this.height

        const r = this.camera.getRay(x, y)

        // 设置背景色
        const unitDirection = r.direction.unitVec(),
            t = (unitDirection[0] + 1.0) * 0.5


        const res = e3(vec3(1 - t), "+", e3(vec3(0.3, 0.5, 1), "*", vec3(t)))

        return [res[0], res[1], res[2]].map(v => Math.floor(v * 255.9)) as [number,number,number]
    }
}