import { device } from "./device"

export abstract class CanvasContext {

    height: number
    width: number
    canvas = document.createElement('canvas')

    constructor(canvas: HTMLCanvasElement) {
        this.height = canvas.height
        this.width = canvas.width
        this.canvas = canvas
    }

}

export interface Styleable {
    color: string,
    shadow?: [number, number, number, string]
}

export interface CircleFillable extends Styleable {
    top: number, left: number, size: number,
}

export class Context2D extends CanvasContext {

    static new(cntr: HTMLElement, height: number, width: number) {
        const canvas = document.createElement('canvas')
        canvas.height = height
        canvas.width = width
        cntr.appendChild(canvas)

        return new Context2D(canvas)
    }

    static fromCtx(ctx: CanvasContext) {
        return new Context2D(ctx.canvas)
    }

    static main = Context2D.new(
        document.querySelector('#app') as HTMLDivElement,
        device.height,
        device.width
    )

    ctx: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement) {
        super(canvas)

        const ctx = this.canvas.getContext('2d')

        if (!ctx) throw new Error('ctx is null!')

        this.ctx = ctx
    }

    style({ color, shadow }: Styleable) {
        this.ctx.fillStyle = color
        if (shadow) {
            [
                this.ctx.shadowOffsetX,
                this.ctx.shadowOffsetY,
                this.ctx.shadowBlur,
                this.ctx.shadowColor,
            ] = shadow
        }
    }


    fillCircle(op: CircleFillable) {
        const { top, left, size } = op
        this.style(op)
        this.ctx.arc(left, top, size, 0, 2 * Math.PI)
        this.ctx.fill()
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }
}




export class ContextWebGL extends CanvasContext {

    ctx: WebGLRenderingContext

    constructor(canvas: HTMLCanvasElement) {
        super(canvas)

        const ctx = this.canvas.getContext('webgl')

        if (!ctx) throw new Error('ctx is null!')

        this.ctx = ctx
    }
}