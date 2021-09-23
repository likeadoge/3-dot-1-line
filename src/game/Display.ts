import { Point } from '@/base/Point'
import { GameOpiton } from './Game'

export class Display {
    height: number
    width: number
    canvas = document.createElement('canvas')
    cntr:Element
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


    dot(point: Point, color: [number, number, number, number] = [255, 255, 255, 0.3], size: number = 2) {
        const ctx = this.ctx

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2, true);
        ctx.fillStyle = `rgba(${color.join(',')})`
        ctx.fill();
    }

}



