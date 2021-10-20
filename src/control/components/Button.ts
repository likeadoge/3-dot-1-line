import { DotDrawable, Context2D, ColorTransOption, OpacityTransOptions, ShadowTransOption, ArcDrawable, SizeTransOptions } from "@/utils/canvas2d";
import { TouchListener } from "@/utils/touch";
import { device } from '@/utils/device'

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

    private isPressing = new Transition(false, [200, 2000])

    private enable = new Transition(true, 200)

    private touch = new TouchListener()

    private isDone: boolean = false

    private done: () => void = () => { console.log('done'); device.vibrate() }


    private opacity = new OpacityTransOptions(0, 1)

    private pos = { top: 100, left: 100 }

    private size = 30

    private dot: DotDrawable = {} as any

    private dotOps = {
        color: new ColorTransOption([203, 0, 140], [252, 103, 103]),
        shadow: new ShadowTransOption([0, 4, 10], [0, 0, 0], [0, 0, 0],
            new OpacityTransOptions(0.3, 0)
        )
    }

    private arc: ArcDrawable = {} as any
    private arcOps = {
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
        this.touch.end = () => {
            this.isPressing.off()
        }
        this.touch.cancel = () => {
            this.isPressing.off()
        }
    }

    private update() {

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

    draw(context: Context2D) {
        if ( this.enable.ratio() || this.enable.current()) {
            this.update()
            context.arc(this.arc)
            context.dot(this.dot)

            // context.fillCircle(this.circleFillOption)
        }

        // console.log(this.isDone)

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