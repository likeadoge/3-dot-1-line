import { MoveButton } from '@/control/widget/Button'
import { Context2D } from '@/utils/canvas2d'
import { device } from '@/utils/device'
import { CanvasPicture } from '@/utils/image'
import { ResImageBitmap } from '@/utils/load'
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
    private isRun = false

    img: ResImageBitmap[] = []
    pic: CanvasPicture[] = []

    loaded: Promise<unknown>

    // 绘制图像
    private render() {
        console.log(3)
        if (!this.isRun) return

        Context2D.main.clear()
        device.updateRenderTime()
        this.draw()

        requestAnimationFrame(() => this.render())
    }

    constructor() {

        this.img = [
            new ResImageBitmap(
                'http://localhost:3000/1911/滑套.png',
                { height: 540, width: 720 },
                { top: 0, left: 0 },
                {
                    pos: { top: 0, left: 0 },
                    size: { height: 540, width: 720 }
                }),
            new ResImageBitmap(
                'http://localhost:3000/1911/下身.png',
                { height: 540, width: 720 },
                { top: 0, left: 0 },
                {
                    pos: { top: 0, left: 0 },
                    size: { height: 540, width: 720 }
                }),
            new ResImageBitmap(
                'http://localhost:3000/1911/击锤.png',
                { height: 540, width: 720 },
                { top: 0, left: 0 },
                {
                    pos: { top: 0, left: 0 },
                    size: { height: 540, width: 720 }
                })
        ]


        this.loaded = Promise.all(this.img.map(v => v.onload))
            .then(() => {
                this.pic = this.img.map(v => new CanvasPicture(v))
            })


        this.start()
    }

    private button = new MoveButton()

    private draw() {
        this.pic.forEach(v => v.draw(Context2D.main))
        this.button.draw(Context2D.main)
    }

    async start() {
        if (this.isRun) return
        this.isRun = true

        console.log(1)
        await this.loaded.then(() => {

            console.log(2)
        })
        this.render()
    }

}



export const main = new ControlApp()