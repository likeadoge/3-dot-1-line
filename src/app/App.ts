import { Game } from "@/game/Game"

export class App {
    // 主程序
    static main = new App()

    device: {
        mode: 'pc' | 'mobile',
        width: number,
        height: number,
    } = {
            mode: 'pc',
            width: 360,
            height: 640,
        }

    game: Game = (null as any)

    element: HTMLElement =  (null as any)

    constructor() {
        //  单例
        if (App.main) return App.main

        this.initDeviceInfo()
        this.initElement()
        this.initGame()
    }

    private initDeviceInfo() {
        // 判断设备
        // 如果屏幕宽度小于长度且最小宽度大于 320 则视为手机端
        const { width, height } = document.body.getClientRects()[0]

        const mode = (height > width && width > 320) ? 'mobile' : 'pc'

        console.log(mode)

        this.device = { width, mode, height }
    }

    private initGame() {
        const { width, height } = this.device.mode === 'mobile'
            ? this.device
            : { width: 360, height: 640, }

        const cntr = this.element
        
        this.game = new Game({ width, height, cntr })
    }

    private initElement(){
        this.element = document.createElement('div')
        this.element.id = 'app'
        this.element.dataset.mode = this.device.mode
        document.body.appendChild(this.element)
    }

    onLog(fn: (msg: string) => void) {
        fn('game init!')
    }
}