import { RandomPointView } from "@/view/RandomView"
import { Display } from "./Display"
import { ResImg } from '@/res/ResImg'
import { Point } from "@/base/Point"
import { TouchMoveView } from "@/view/TouchMoveView"
import { TouchTimeView } from "@/view/TouchTimeView"

export type GameOpiton = { height: number, width: number, cntr: Element }


export class Game {

    private option: GameOpiton

    private screen: Display = (null as any)

    // 目标靶位置
    private targetPosition = new RandomPointView()

    // 照门相对于目标位置
    private sightPosition = new RandomPointView()

    // 准星相对于照门位置
    private frontPosition = new RandomPointView()

    // 视角位置
    private cameraPosition = new TouchMoveView()

    // 点击状态
    private touchTime = new TouchTimeView()

    // 运行状态
    private isRun = false

    constructor(option: GameOpiton) {
        this.option = option
        this.initScreen()
        this.start()
    }

    // 初始化视图
    private initScreen() {
        this.screen = new Display(this.option)
    }

    // 绘制图像
    private draw() {
        if (!this.isRun) return

        this.screen.clear()

        const target = this.targetPosition.next().trans(
            x => x * this.option.width / 2 / 10 + this.option.width / 2,
            y => y * this.option.height / 2 / 10 + this.option.height / 2,
        )

        
        const touch = this.cameraPosition.getPoint()

        this.screen.img(
            ResImg.files.target,
            target.add(touch),
            new Point(0.5)
        )

        const sight = this.sightPosition.next().trans(
            x => x * this.option.width / 2 / 100 + this.option.width / 2,
            x => x * this.option.height / 2 / 100 + this.option.height / 2
        )


        const front = sight.add(
            this.frontPosition.next().trans(
                x => x * this.option.width / 2 / 100,
                y => y * this.option.height / 2 / 100
            )
        )

        this.screen.dot(
            front,
            [0, 255, 0, 1],
            4
        )

        this.screen.dot(
            sight,
            [255, 0, 0, 0.7],
            4
        )

        console.log(this.touchTime.num())


        requestAnimationFrame(() => this.draw())
    }

    async start() {
        await Promise.all(
            Array.from(Object.values(ResImg.files))
                .map((v: any) => v.onload)
        )
        this.isRun = true
        this.draw()
    }

    stop() {
        this.isRun = false
    }
}