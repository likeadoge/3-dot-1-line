
import { Display, GlDisplay } from "./Display"

export type GameOpiton = { height: number, width: number, cntr: Element }


export class Game {

    private option: GameOpiton

    private screen: GlDisplay = (null as any)

   
    // 运行状态
    private isRun = false

    constructor(option: GameOpiton) {
        this.option = option
        this.initScreen()
        this.start()
    }

    // 初始化视图
    private initScreen() {
        this.screen = new GlDisplay(this.option)
    }

    // 绘制图像
    private draw() {
        if (!this.isRun) return

        this.screen.clear()
        this.screen.initShaderProgram()

        // requestAnimationFrame(() => this.draw())
    }

    async start() {
        this.isRun = true
        this.draw()
    }

    stop() {
        this.isRun = false
    }
}