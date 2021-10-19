import { PressButton } from '@/control/components/Button'
import { Context2D } from '@/utils/canvas'
import { device } from '@/utils/device'
import { TouchListener } from '@/utils/touch'
import { App } from './App'

export class ControlApp extends App {

    screen = Context2D.main

    game = new Game()

    constructor() {
        super()

        TouchListener.init(this.screen.canvas)
    }
}


export class Game {
    // 运行状态
    private isRun = true

    // 绘制图像
    private render() {
        if (!this.isRun) return

        Context2D.main.clear()
        device.curtime()
        this.draw()

        requestAnimationFrame(() => this.render())
    }

    constructor(){
        this.start()
    }

    private button = new PressButton()

    private draw(){
        this.button.draw(Context2D.main)
    }


    async start() {
        this.isRun = true
        this.render()
    }

}



export const main = new ControlApp()