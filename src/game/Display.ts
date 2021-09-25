import { Point } from '@/base/Point'
import { ResImg } from '@/res/ResImg'
import { GameOpiton } from './Game'
export class Display {
    height: number
    width: number
    canvas = document.createElement('canvas')
    cntr: Element
    ctx: CanvasRenderingContext2D

    constructor(option: GameOpiton) {
        this.height = option.height
        this.width = option.width
        this.cntr = option.cntr

        this.canvas.height = this.height
        this.canvas.width = this.width

        console.log(this.cntr)

        this.cntr.appendChild(this.canvas)

        const ctx = this.canvas.getContext('2d')

        if (!ctx)
            throw new Error('ctx is null !!!')
        else
            this.ctx = ctx

    }


    dot(point: Point, color: [number, number, number, number] = [255, 255, 255, 0.3], size: number = 3) {
        const ctx = this.ctx

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2, true);
        ctx.fillStyle = `rgba(${color.join(',')})`
        ctx.fill();
    }

    img(img: ResImg, p: Point, s: Point = new Point(1)) {
        const ctx = this.ctx

        ctx.drawImage(
            img.img.get(),
            p.x - img.width / 2 * s.x,
            p.y - img.height / 2 * s.y,
            s.x * img.width,
            s.y * img.height
        )
    }

    clear() {
        // this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
        // this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.clearRect(0, 0, this.width, this.height)
    }

}


