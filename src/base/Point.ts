export class Point {
    x = 0
    y = 0

    constructor(x: number, y: number = x) {
        this.x = x
        this.y = y
    }

    trans(fnx: (n: number) => number, fny = fnx) {
        return new Point(fnx(this.x), fny(this.y))
    }

    goto(next: Point, ratio: number) {
        return new Point(
            this.x + ratio * (next.x - this.x),
            this.y + ratio * (next.y - this.y)
        )
    }
}
