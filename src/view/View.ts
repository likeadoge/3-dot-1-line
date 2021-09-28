import { Point } from "@/base/Point"
import { Display } from "@/game/Display"


export class View {
    height = 2
    width = 2

    bottom = 1
    top = -1
    left = -1
    right = 1

    centerPoint = new Point(
        (this.left + this.width) / 2,
        (this.top + this.bottom) / 2,
    )

    screen:Display

    randomPoint() {
        return new Point(
            (this.left + Math.random() * (this.right - this.left)),
            (this.top + Math.random() * (this.bottom - this.top)),
        )
    }

    constructor(screen:Display){
        this.screen = screen
    }


    protected updateWidth() {
        this.width = this.right - this.left
    }

    protected updateHeight() {
        this.height = this.bottom - this.top
    }

    protected setCenter(point: Point) {
        this.centerPoint = point
    }
}