import { RandomPathView } from "@/view/RandomPathView"
import { Display } from "./Display"

export type GameOpiton = { height: number, width: number, cntr: Element }


export class Game {

    option: GameOpiton

    screen: Display = (null as any)

    view  = new RandomPathView()

    constructor(option: GameOpiton) {
        this.option = option
        this.initScreen()
        this.start()
    }

    private initScreen() {
        this.screen = new Display(this.option)
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