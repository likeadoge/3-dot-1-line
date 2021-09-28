import { Point } from '@/base/Point'
import { Display } from '@/game/Display'
import { images, ResImg } from '@/res/ResImg'
import { View } from './View'


export abstract class SightView extends View {

    abstract img: ResImg

    constructor(screen: Display) {
        super(screen)
        this.left = 0
        this.right = 400
        this.updateWidth()

        this.top = 0
        this.bottom = 800
        this.updateHeight()

        this.setCenter(new Point(200, 400))
    }


    draw(point: Point, num: number) {
        this.screen.ctx.drawImage(this.img.img.get(),
            ...this.scale(num, this.down(num, point))
        )
    }


    private scale(num: number, p: Point): [number, number, number, number] {
        const n = (num > 0.8 ? 0.8 : num) / 0.8
        const s = (1 + n) / 3
        const width = this.width * s
        const height = this.height * s
        const left = p.x - width / 2
        const top = p.y - height / 2

        return [left, top, width, height]
    }
    private down(num: number, p: Point) {
        const n = (num > 0.8 ? 0.8 : num) / 0.8
        return p.trans(x => x, y => y + 200 * (1 - n))
    }
}

 
export class FrontSightView extends SightView{
    img = images.frontSight
}

export class BackSightView extends SightView{
    img = images.backSight
}
