import { RandomPathState } from "@/state/RandomPathState"
import { Display } from "./Display"
import { images } from '@/res/ResImg'
import { Point } from "@/base/Point"
import { TouchMoveState } from "@/state/TouchMoveState"
import { TouchTimeState } from "@/state/TouchTimeState"
import { StatusBarView } from "@/view/StatusBarView"
import { BackSightView, FrontSightView } from "@/view/SightView"

export type GameOpiton = { height: number, width: number, cntr: Element }


export class Game {

    private option: GameOpiton

    private screen: Display = (null as any)

    // 目标靶位置
    private targetPosition = new RandomPathState()

    // 照门相对于目标位置
    private sightPosition = new RandomPathState()

    // 准星相对于照门位置
    private frontPosition = new RandomPathState()

    // 视角位置
    private cameraPosition = new TouchMoveState()

    // 点击状态
    private touchTime = new TouchTimeState()

    // 运行状态
    private isRun = false

    // 姿势状态参数
    private statusBar: StatusBarView = null as any

    private backSightView: BackSightView = null as any

    private frontSightView: FrontSightView = null as any

    constructor(option: GameOpiton) {
        this.option = option
        this.initScreen()

        this.statusBar = new StatusBarView(this.screen)
        this.backSightView = new BackSightView(this.screen)
        this.frontSightView = new FrontSightView(this.screen)

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
            images.target,
            target.add(touch),
            new Point(0.5)
        )

        const back = this.sightPosition.next().trans(
            x => x * this.option.width / 2 / 100 * 4 + this.option.width / 2,
            x => x * this.option.height / 2 / 100 * 4 + this.option.height / 2
        )
        const front = back.add(
            this.frontPosition.next().trans(
                x => x * this.option.width / 2 * 2 / 100,
                y => y * this.option.height / 2 * 2 / 100
            )
        )
        const { focus,trigger } = this.touchTime.num()

        this.screen.dot(
            front,
            [0, 255, 0, 1],
            4
        )
        this.frontSightView.draw(front, focus)
        this.backSightView.draw(back, focus)
        this.statusBar.draw({focus,trigger})

        requestAnimationFrame(() => this.draw())
    }

    async start() {
        await Promise.all(
            Array.from(Object.values(images))
                .map((v: any) => v.onload)
        )
        this.isRun = true
        this.draw()
    }

    stop() {
        this.isRun = false
    }
}