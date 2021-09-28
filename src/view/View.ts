import { Point } from "@/base/Point"


export class View {
    height = 2
    width = 2

    bottom = -1
    top = 1
    left = -1
    right = 1

    centerPoint() {
        return new Point(
            (this.left + this.width) / 2,
            (this.top + this.bottom) / 2,
        )
    }

    randomPoint() {
        return new Point(
            (this.left + Math.random() * (this.right - this.left)),
            (this.top + Math.random() * (this.bottom - this.top)),
        )
    }
}