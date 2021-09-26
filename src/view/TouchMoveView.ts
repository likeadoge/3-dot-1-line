import { View } from "./View";
import { Point } from "@/base/Point"

export class TouchMoveView extends View {

    private startMoveEvent: TouchEvent | null = null
    private currentMoveEvent: TouchEvent | null = null

    private cachePoint = new Point(0, 0)

    constructor() {
        super()

        const app = document.querySelector('#app')

        if (!app || !(app instanceof HTMLElement)) throw new Error()


        this.startMoveEvent = null
        this.currentMoveEvent = null

        app.addEventListener('touchstart', e => this.start(e))
        app.addEventListener('touchmove', e => this.move(e))
        app.addEventListener('touchend', e => this.over(e))
        app.addEventListener('touchcancel', e => this.over(e))


    }

    private start(e: TouchEvent) {
        e.preventDefault()
    }

    private move(e: TouchEvent) {
        e.preventDefault()
        if (!this.startMoveEvent) this.startMoveEvent = e
        this.currentMoveEvent = e
    }

    private over(e: TouchEvent) {

        // e.preventDefault()


        if (this.currentMoveEvent && this.startMoveEvent) {


            const current = new Point(
                this.currentMoveEvent.touches[0].clientX - this.startMoveEvent.touches[0].clientX,
                this.currentMoveEvent.touches[0].clientY - this.startMoveEvent.touches[0].clientY
            )

            this.cachePoint = this.cachePoint.add(current)
            // console.log(this.cachePoint)

        }

        this.startMoveEvent = null

    }

    getPoint() {

        if (this.currentMoveEvent && this.startMoveEvent) {

            const current = new Point(
                this.currentMoveEvent.touches[0].clientX - this.startMoveEvent.touches[0].clientX,
                this.currentMoveEvent.touches[0].clientY - this.startMoveEvent.touches[0].clientY
            )
            console.log(current)

            return current.add(this.cachePoint)
        }

        else
            return this.cachePoint
    }

}