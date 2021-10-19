import { CircleFillable, Context2D } from "@/utils/canvas";
import { TouchListener } from "@/utils/touch";
import { device } from '@/utils/device'



export class ColorTransition {
    form: [number, number, number, number]
    to: [number, number, number, number]

    constructor(
        form: [number, number, number, number],
        to: [number, number, number, number] = form) {
        this.form = form
        this.to = to
    }

    get(t: number) {
        t = t * t
        return `rgb(${this.form[0] * (1 - t) + this.to[0] * t
            },${this.form[1] * (1 - t) + this.to[1] * t
            },${this.form[2] * (1 - t) + this.to[2] * t
            },${this.form[3] * (1 - t) + this.to[3] * t
            })`
    }
}

export class ShadowTransition {

    form: [number, number, number]
    to: [number, number, number]
    color: string

    constructor(
        form: [number, number, number],
        to: [number, number, number],
        color: string
    ) {
        this.form = form
        this.to = to
        this.color = color
    }

    get(t: number): [number, number, number, string] {
        t = t * t
        return [
            this.form[0] * (1 - t) + this.to[0] * t,
            this.form[1] * (1 - t) + this.to[1] * t,
            this.form[2] * (1 - t) + this.to[2] * t,
            this.color
        ]
    }

}

export class PressButton {

    private circleFillOption: CircleFillable = {
        top: 100,
        left: 100,
        size: 30,
        color: '#66ccff',
        shadow: [0, 2, 10, `rgba(0,0,0,0.3)`]
    }

    private enable = true

    private touch = new TouchListener()

    private pressTime: number = 0

    private dropTime: number = 0

    private state: 'pressing' | 'droped' = 'droped'

    private pressDuration = 1000

    private dropDuration = 200

    private isDone: boolean = false

    private done: () => void = () => { 
        console.log('done');
        device.vibrate()
    }

    private pressColor = new ColorTransition(
        [203, 0, 140, 255], [252, 103, 103, 255]
    )

    private dropColor = new ColorTransition(
        [252, 103, 103, 255], [203, 0, 140, 255]
    )

    private pressShadow = new ShadowTransition(
        [0, 4, 10,], [0, 0, 0], `rgba(0,0,0,0.3)`
    )

    private dropShadow = new ShadowTransition(
        [0, 0, 0], [0, 4, 10,], `rgba(0,0,0,0.3)`
    )


    constructor() {
        this.touch.top = this.circleFillOption.top - this.circleFillOption.size
        this.touch.bottom = this.circleFillOption.top + this.circleFillOption.size
        this.touch.left = this.circleFillOption.left - this.circleFillOption.size
        this.touch.right = this.circleFillOption.left + this.circleFillOption.size

        this.touch.start = () => {
            this.pressTime = device.time
            this.state = 'pressing'
        }
        this.touch.end = () => {
            this.dropTime = device.time
            this.state = 'droped'
        }
        this.touch.cancel = () => {
            this.dropTime = device.time
            this.state = 'droped'
        }
    }

    draw(context: Context2D) {
        if (this.enable) {
            if (this.state === 'droped') {
                const dur = device.time - this.dropTime
                const t = (dur < 0 ? 0 : dur > this.dropDuration ? this.dropDuration : dur) / this.dropDuration
                this.circleFillOption.color = this.dropColor.get(t)
                this.circleFillOption.shadow = this.dropShadow.get(t)
                this.isDone = false
            } else {
                const dur = device.time - this.pressTime
                const t = (dur < 0 ? 0 : dur > this.pressDuration ? this.pressDuration : dur) / this.pressDuration
                this.circleFillOption.color = this.pressColor.get(t)
                this.circleFillOption.shadow = this.pressShadow.get(t)

                if (!this.isDone && t >= 1) {
                    this.done()
                    this.isDone = true
                }
            }
            context.fillCircle(this.circleFillOption)
        }
    }

}