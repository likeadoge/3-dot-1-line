import { DotDrawable, Context2D, ColorTransOption, OpacityTransOptions, ShadowTransOption, ArcDrawable, SizeTransOptions, LineDrawable } from "@/utils/canvas2d";
import { TouchListener } from "@/utils/touch";
import { device } from '@/utils/device'
import { TouchTimeState } from "@/state/TouchTimeState";

export class Transition {

    private status: 0 | 1 = 0

    private last: [number, number]
    private duration: [number, number]

    constructor(initial: boolean, duration: [number, number] | number) {
        this.status = initial ? 1 : 0
        this.last = [device.getCurTime(), device.getCurTime()]
        this.duration = duration instanceof Array ? duration : [duration, duration]
    }

    off() {
        if (this.status === 0) return
        this.status = 0
        this.last[this.status] = device.getCurTime()
    }

    on() {
        if (this.status === 1) return
        this.status = 1
        this.last[this.status] = device.getCurTime()
    }

    trigger() {
        if (this.status === 0) return this.on()
        if (this.status === 1) return this.off()
    }



    current(): boolean {
        return !!this.status
    }

    ratio() {
        const last = this.last[this.status]
        const duration = this.duration[this.status]
        const current = device.getCurTime()
        const r = (current - last) / duration
        const ratio = r < 0 ? 0 : r > 1 ? 1 : r
        return this.status ? ratio : 1 - ratio
    }
}

export class PressButton {

    protected isPressing = new Transition(false, [200, 2000])

    protected enable = new Transition(true, 200)

    protected touch = new TouchListener()

    protected isDone: boolean = false

    protected opacity = new OpacityTransOptions(0, 1)

    protected pos = { top: 100, left: 100 }

    protected size = 30

    protected dot: DotDrawable = {} as any

    protected dotOps = {
        color: new ColorTransOption([203, 0, 140], [252, 103, 103]),
        shadow: new ShadowTransOption([0, 4, 10], [0, 0, 0], [0, 0, 0],
            new OpacityTransOptions(0.3, 0)
        )
    }

    protected arc: ArcDrawable = {} as any
    protected arcOps = {
        size: new SizeTransOptions(0, 2 * Math.PI)
    }

    constructor() {
        this.touch.top = this.pos.top - this.size
        this.touch.bottom = this.pos.top + this.size
        this.touch.left = this.pos.left - this.size
        this.touch.right = this.pos.left + this.size

        this.touch.start = () => {
            this.isPressing.on()
        }
        this.touch.end = this.touch.cancel = () => {
            this.isPressing.off()
        }
    }

    protected update() {

        const opacity = this.opacity.get(this.enable.ratio())
        const ratio = this.isPressing.ratio()


        const color = this.dotOps.color.get(ratio)
        const pos = this.pos
        const size = this.size
        const shadow = this.dotOps.shadow.get(ratio)

        shadow[4] = shadow[4] * opacity

        this.dot = {
            opacity, color, pos, size, shadow
        }

        this.arc = {
            pos,
            size,
            width: 10,
            start: -0.5 * Math.PI,
            end: -0.5 * Math.PI + this.arcOps.size.get(ratio),
            opacity,
            color: [252, 103, 103]
        }

    }

    protected done() {
        console.log('done'); device.vibrate()
    }

    draw(context: Context2D) {
        if (this.enable.ratio() || this.enable.current()) {
            this.update()
            context.arc(this.arc)
            context.dot(this.dot)
        }
        const current = this.isPressing.current()
        const ratio = this.isPressing.ratio()
        if ((!this.isDone) && ratio >= 1 && current === true) {
            this.done()
            this.isDone = true
        }

        if (this.isDone && (ratio === 0) && (!current)) {
            this.isDone = false
        }

    }
}

export class MoveButton extends PressButton {

    private toPos = { top: 200, left: 200 }
    private fromPos = this.pos

    private direction = [
        this.toPos.left - this.fromPos.left,
        this.toPos.top - this.fromPos.top,
    ]

    private directionLen = (this.direction[0] ** 2 + this.direction[1] ** 2)


    private movePos = this.pos

    private beginPos = this.pos

    protected move = new Transition(false, 200)
    protected opacity = new OpacityTransOptions(0, 1)



    constructor() {
        super()

        this.touch.start = () => {
            this.isPressing.on()
        }
        this.touch.move = (pos) => {

            if (!this.touch.in(pos.left, pos.top)
                && !this.move.current()
            ) this.touch.quit()

            this.movePos = pos
        }
        this.touch.end = this.touch.cancel = () => {
            this.isPressing.off()
            this.move.off()
        }
    }

    protected done() {
        super.done()
        console.log('begin move')
        this.beginPos = this.movePos
        this.move.on()
    }

    protected updatePos(): void {
        const isMove = this.move.current()

        if (!isMove) {
            this.pos = this.fromPos
        } else {
            const vec = [
                this.movePos.left - this.beginPos.left,
                this.movePos.top - this.beginPos.top
            ]

            let len = (
                this.direction[0] * vec[0] +
                this.direction[1] * vec[1]
            ) / this.directionLen

            len = len < 0 ? 0 : len > 1 ? 1 : len

            const pos = {
                left: this.fromPos.left + len * this.direction[0],
                top: this.fromPos.top + len * this.direction[1]
            }

            this.pos = pos
        }
    }

    protected update() {
        this.updatePos()
        const opacity = this.opacity.get(this.enable.ratio())
        const ratio = this.isPressing.ratio()
        const isPressing = this.isPressing.current()

        const color = this.dotOps.color.get(ratio)
        const pos = this.pos
        const size = this.size
        const shadow = this.dotOps.shadow.get(ratio)

        shadow[4] = shadow[4] * opacity

        this.dot = {
            opacity, color, pos, size, shadow
        }

        this.arc = {
            pos, size, opacity,
            width: isPressing ? 10 : 0,
            start: -0.5 * Math.PI,
            end: -0.5 * Math.PI + (isPressing ? this.arcOps.size.get(ratio) : 0),
            color: [252, 103, 103]
        }
    }

    private targetDot: DotDrawable = {
        pos: this.toPos,
        size: this.size,
        color: [0, 0, 0],
        opacity: 0.3
    }

    private line: LineDrawable = {
        from: this.fromPos,
        to: this.toPos,
        color: [0, 0, 0],
        opacity: 0.3,
        dash: [10,20],
        cap: 'round',
        width: 10
    }

    draw(context: Context2D) {
        if (this.enable.ratio() || this.enable.current()) {
            this.update()
            context.arc(this.arc)
            context.dot(this.dot)

            if (this.move.current()) {
                context.dot(this.targetDot)
                context.line(this.line)
            }
        }
        const current = this.isPressing.current()
        const ratio = this.isPressing.ratio()
        if ((!this.isDone) && ratio >= 1 && current === true) {
            this.done()
            this.isDone = true
        }

        if (this.isDone && (ratio === 0) && (!current)) {
            this.isDone = false
        }

    }

}