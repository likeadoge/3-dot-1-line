import { State } from "./State";

class TouchLink {
    // above?: TouchLink
    above: number
    start: number
    end: number

    up: number

    constructor(start: number, end: number, above?: TouchLink) {
        this.start = start
        this.end = end
        this.above = above ? above.num(this.start) : 0
        this.up = TouchLink.up(this.start, this.end, this.above)
    }

    static up(start: number, end: number, above: number) {
        const up = (end - start) * 0.0008 + above
        return (up >= 1 ? 1 : up)
    }

    static down(cur: number,end: number) {
        return (cur - end) * 0.001 
    }

    num(t = new Date().getTime()) {

        const up = this.up
        const down = TouchLink.down(t, this.end)

        const res = up - down

        return res > 0 ? res : 0
    }
}


export class TouchTimeState extends State {

    private currentTouchTime: number = 0
    private touchsRecords?: TouchLink

    constructor() {
        super()

        const app = document.querySelector('#app')

        if (!app || !(app instanceof HTMLElement)) throw new Error()

        app.addEventListener('touchstart', e => this.start(e))
        app.addEventListener('touchmove', e => this.move(e))
        app.addEventListener('touchend', e => this.over(e))
        app.addEventListener('touchcancel', e => this.over(e))

    }

    private start(e: TouchEvent) {
        e.preventDefault()
        this.currentTouchTime = new Date().getTime()
    }

    private move(e: TouchEvent) {
        e.preventDefault()
    }

    private over(_: TouchEvent) {
        if (this.currentTouchTime) {
            this.touchsRecords = new TouchLink(
                this.currentTouchTime,
                new Date().getTime(),
                this.touchsRecords
            )
        }
        this.currentTouchTime = 0
    }


    num() {
        const t = new Date().getTime()

        if (this.currentTouchTime) {
            const above = this.touchsRecords
                ? this.touchsRecords.num(this.currentTouchTime)
                : 0

            return TouchLink.up(this.currentTouchTime, t, above)
        } else {
            const above = this.touchsRecords
                ? this.touchsRecords.num(t)
                : 0

            return above
        }

    }

}