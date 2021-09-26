
import { Point } from "@/base/Point"
import { Display } from "@/game/Display"
import { LoadTask, Resource } from "./Rescource"

export class ImgLoadTask extends LoadTask<HTMLImageElement> {

    height: number = 0
    width: number = 0

    constructor(src: string) {
        super()

        const img = new Image()

        let resolve = (_: HTMLImageElement) => { }
        let reject = (_: string | Event) => { }

        this.onload = new Promise<HTMLImageElement>((res, rej) => {
            resolve = res
            reject = rej
        })
        this.onload.then(img => {
            this.val = img
            this.height = img.height
            this.width = img.width
        })

        img.src = src
        img.onload = () => { resolve(img) }
        img.onerror = (e) => { reject(e) }
    }
}

export class ResImg extends Resource {

    static files = {
        target: new ResImg(new ImgLoadTask('/img/target.png'))
    }

    img: ImgLoadTask
    height: number = 0
    width: number = 0

    onload: Promise<unknown>

    constructor(img: ImgLoadTask) {
        super()
        this.img = img
        this.img.onload.then(() => {
            this.height = img.height
            this.width = img.width
        })
        this.onload = this.img.onload
    }

    draw(screen: Display, p: Point, scaleX = 1, scaleY = scaleX) {
        screen.ctx.drawImage(
            this.img.get(),
            p.x - this.width / 2 * scaleX,
            p.y - this.height / 2 * scaleY,
            scaleX, scaleY
        )
    }
}