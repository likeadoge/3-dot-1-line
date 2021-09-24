import { RandomPointView } from "@/view/RandomPathView"
import { Display } from "./Display"

export type GameOpiton = { height: number, width: number, cntr: Element }


export class Game {

    private option: GameOpiton

    private screen: Display = (null as any)

    private view = new RandomPointView()

    private isRun = false

    constructor(option: GameOpiton) {
        this.option = option
        this.initScreen()
        this.start()
    }

    private initScreen() {
        this.screen = new Display(this.option)
    }

    private draw() {
        if (!this.isRun) return

        this.screen.clear()

        const point = this.view.next()
        this.screen.dot(point.trans(
            x => (x + 1) * this.option.width / 2,
            x => (x + 1) * this.option.height / 2
        ), [0, 0, 0, 0.3])

        requestAnimationFrame(() => this.draw())
    }

    start() {
        this.isRun = true
        this.draw()
    }

    stop() {
        this.isRun = false
    }
}