import { expr3, vec3, Vec3 } from "./vec3";

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

        this.w = expr3(lookfrom, '-', lookto).val().unitVec()
        this.u = expr3(vup, 'x', this.w).val().unitVec()
        this.v = expr3(this.w, 'x', this.u).val().unitVec()
        this.vertical = expr3(this.u, '*', vec3(harf_width * 2)).val()
        this.horizontal = expr3(this.u, '*', vec3(harf_width * 2)).val()

        this.leftBottom = expr3(
            this.origin,
            '-', [this.vertical, '*', vec3(0.5)],
            '-', [this.horizontal, '*', vec3(0.5)],
            '-', this.w
        ).val()

    }

}