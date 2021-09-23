import { Point } from '@/base/Point'
import { View } from './View'

export class RandomPathView extends View {

    path: { point: Point, control: Point }[] = []

    constructor() {
        super()
        const x = Math.random() * (this.right - this.left) + this.left
        const y = Math.random() * (this.top - this.bottom) + this.bottom

        const control = [
            new Point(x, this.bottom),
            new Point(x, this.top),
            new Point(this.left, y),
            new Point(this.right, y)
        ][Math.floor(Math.random() * 4)]

        const point = this.centerPoint()

        this.path.push({ point, control })
    }

    getLastPathPoint() {
        return this.path[this.path.length - 1]
    }

    createNextPath() {
        const pre = this.getLastPathPoint()

        const prePoint = pre.point
        const preControl = pre.control

        const rX = prePoint.x - preControl.x
        const xEdge = rX > 0 ? this.right : this.left

        const rY = prePoint.y - preControl.y
        const yEdge = rY > 0 ? this.top : this.bottom

        const pX = new Point(
            xEdge,
            (xEdge - prePoint.x) / rX * rY + prePoint.y
        )

        const pY = new Point(
            (yEdge - prePoint.y) / rY * rX + prePoint.x,
            yEdge
        )

        const control = (pX.y >= this.bottom && pX.y <= this.top)
            ? pX
            : pY

        let point = this.randomPoint()

        while (point.x ** 2 + point.y ** 2 > 1) {
            point = this.randomPoint()
        }

        this.path.push({ control, point })

        return this.besier2(prePoint, control, point)

    }

    besier2(d0: Point, d1: Point, d2: Point) {
        const step = 100
        const line = []

        for (let current = 0; current <= step; current++) {
            const ratio = current / step
            const p0 = d0.goto(d1, ratio)
            const p1 = d1.goto(d2, ratio)
            const target = p0.goto(p1, ratio)
            line.push(target)
        }

        return line
    }
}
