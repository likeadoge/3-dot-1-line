class Point {
    x = 0
    y = 0

    constructor(x: number, y: number) {
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

class View {
    height = 2
    width = 2

    bottom = -1
    top = 1
    left = -1
    right = 1

    centerPoint() {
        return new Point(
            (this.left + this.width) / 2,
            (this.top + this.bottom) / 2,
        )
    }

    randomPoint() {
        return new Point(
            (this.left + Math.random() * (this.right - this.left)),
            (this.top + Math.random() * (this.bottom - this.top)),
        )
    }
}

class RandomPathView extends View {

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

class Display {

    height = 400
    width = 400
    canvas = document.createElement('canvas')
    ctx: CanvasRenderingContext2D

    constructor() {
        this.canvas.height = this.height
        this.canvas.width = this.width

        const ctx = this.canvas.getContext('2d')
        if (!ctx)
            throw new Error('ctx is null !!!')
        else
            this.ctx = ctx

        document.body.appendChild(this.canvas)
    }

    dot(point: Point, color: [number, number, number, number] = [255, 255, 255, 0.3], size: number = 2) {
        const ctx = this.ctx

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2, true);
        ctx.fillStyle = `rgba(${color.join(',')})`
        ctx.fill();
    }

}

class Game {

    static main = new Game()

    screen = new Display()
    view = new RandomPathView()

    constructor() {
        this.start()
    }

    draw() {
        this.view.path.forEach(({ control, point }) => {
            this.screen.dot(control.trans(x => (x + 1) * 200), [255, 0, 0, 1])
            this.screen.dot(point.trans(x => (x + 1) * 200), [0, 255, 0, 1])
        })
    }

    async start() {
        while (true) {
            this.draw()
            for (const p of this.view.createNextPath()) {
                this.screen.dot(p.trans(x => (x + 1) * 200), [0, 0, 0, 0.3])
                await this.wait()
            }

        }
    }

    wait(timeout = 1000 / 60) {
        return new Promise(res =>
            setTimeout(() => { res(null) }, timeout)
        )
    }
}