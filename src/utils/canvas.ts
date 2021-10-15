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

export class Context2D extends CanvasContext {


    static new(cntr: HTMLElement, height: number, width: number) {
        const canvas = document.createElement('canvas')
        canvas.height = height
        canvas.width = width
        cntr.appendChild(canvas)
    }

    static fromCtx(ctx: CanvasContext) {
        return new Context2D(ctx.canvas)
    }

    ctx: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement) {
        super(canvas)

        const ctx = this.canvas.getContext('2d')

        if (!ctx) throw new Error('ctx is null!')

        this.ctx = ctx
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