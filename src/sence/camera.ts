import { e3, vec3, Vec3 } from "./vec3";

export default class Camera {

    origin: Vec3
    vertical: Vec3
    horizontal: Vec3
    leftBottom: Vec3

    u: Vec3
    v: Vec3
    w: Vec3

    constructor(lookfrom: Vec3, lookto: Vec3, vup: Vec3, vfov: number, aspect: number) {
        let theta = vfov * Math.PI / 180
        let harf_height = Math.tan(theta / 2)
        let harf_width = harf_height * aspect

        this.origin = lookfrom

        this.w = e3(lookfrom, `-`, lookto)

        this.u = e3(vup, 'x', this.w)
        this.v = e3(this.w, 'x', this.u)
        this.vertical = e3(this.u, '*', vec3(harf_width * 2))
        this.horizontal = e3(this.u, '*', vec3(harf_width * 2))

        this.leftBottom = e3(
            this.origin,
            '-', e3(this.vertical, '*', vec3(0.5)),
            '-', e3(this.horizontal, '*', vec3(0.5)),
            '-', this.w
        )
    }

    getRay(x: number, y: number) {
        return new Ray(
            this.origin,
            e3(this.leftBottom,
                "+", e3(this.horizontal, "*", vec3(x)),
                "+", e3(this.vertical, "*", vec3(y)),
                "-", this.origin
            )
        )
    }
}

export class Ray {
    origin: Vec3
    direction: Vec3
    constructor(origin: Vec3, direction: Vec3) {
        this.origin = origin
        this.direction = direction
    }

    getPoint(t: number) {
        return e3(
            this.origin,
            '+', e3(this.direction, `*`, vec3(t))
        )
    }
}



// export  function renderPixel(
//     v: Px,
//     width: number,
//     height: number) {
//     [v.r, v.g, v.b, v.a] = [...color(v.x / width, v.y / height), 1]
//         .map(v => Math.floor(v * 255.9))
// }

// function color(_x: number, _y: number) {
//     const [x, y] = [_x, 1 - _y]

    
//     const r = camera.getRay(x, y)

//     // 设置背景色
//     const unitDirection = r.direction.unitVec(),
//         t = (unitDirection.e1 + 1.0) * 0.5

//     const res =  Vec3.add(new Vec3(1, 1, 1).mul(1 - t), new Vec3(0.3, 0.5, 1).mul(t))

//     return [res.e0, res.e1, res.e2]
// }