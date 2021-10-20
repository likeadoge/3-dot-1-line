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

    fillStyle({ color, shadow, opacity }: Styleable) {
        this.ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${opacity})`
        if (shadow) {
            this.ctx.shadowOffsetX = shadow[0]
            this.ctx.shadowOffsetY = shadow[1]
            this.ctx.shadowBlur = shadow[2]
            this.ctx.shadowColor = `rgba(${shadow[3][0]},${shadow[3][1]},${shadow[3][2]},${shadow[4]})`;
        }
    }

    strokeStyle({ color, shadow, opacity }: Styleable) {
        this.ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${opacity})`
        if (shadow) {
            this.ctx.shadowOffsetX = shadow[0]
            this.ctx.shadowOffsetY = shadow[1]
            this.ctx.shadowBlur = shadow[2]
            this.ctx.shadowColor = `rgba(${shadow[3][0]},${shadow[3][1]},${shadow[3][2]},${shadow[4]})`;
        }
    }


    dot(op: DotDrawable) {
        this.ctx.beginPath()
        const { pos, size } = op
        const { left, top } = pos
        this.fillStyle(op)
        this.ctx.arc(left, top, size, 0, 2 * Math.PI)
        this.ctx.fill()
    }

    arc(op: ArcDrawable) {
        this.ctx.beginPath()
        const { pos, size, start, end, clock, width } = op
        const { left, top } = pos
        this.strokeStyle(op)
        this.ctx.lineWidth = width
        this.ctx.arc(left, top, size, start, end, clock)
        this.ctx.stroke()
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }
}

export interface Styleable {
    color: [number, number, number],
    opacity: number,
    shadow?: [number, number, number, [number, number, number], number]
}

export interface DotDrawable extends Styleable {
    size: number,
    pos: { top: number, left: number, }
}

export interface ArcDrawable extends Styleable {
    size: number,
    start: number,
    end: number,
    width: number,
    clock?: boolean,
    pos: { top: number, left: number, }
}

export class ColorTransOption {
    form: [number, number, number]
    to: [number, number, number]

    constructor(
        form: [number, number, number],
        to: [number, number, number] = form) {
        this.form = form
        this.to = to
    }

    get(t: number): [number, number, number] {

        return [
            this.form[0] * (1 - t) + this.to[0] * t,
            this.form[1] * (1 - t) + this.to[1] * t,
            this.form[2] * (1 - t) + this.to[2] * t
        ]
    }
}

export class ShadowTransOption {

    form: [number, number, number]
    to: [number, number, number]
    color: [number, number, number] | ColorTransOption
    opacity: number | OpacityTransOptions

    constructor(
        form: [number, number, number],
        to: [number, number, number],
        color: [number, number, number] | ColorTransOption,
        opacity: number | OpacityTransOptions
    ) {
        this.form = form
        this.to = to
        this.color = color
        this.opacity = opacity
    }

    get(t: number): [number, number, number, [number, number, number], number] {

        return [
            this.form[0] * (1 - t) + this.to[0] * t,
            this.form[1] * (1 - t) + this.to[1] * t,
            this.form[2] * (1 - t) + this.to[2] * t,
            this.color instanceof Array
                ? this.color
                : this.color.get(t),
            typeof this.opacity === 'number'
                ? this.opacity
                : this.opacity.get(t)
        ]
    }

}

export class PosTransOptions {
    form: { left: number, top: number }
    to: { left: number, top: number }

    constructor(form: { left: number, top: number }, to: { left: number, top: number }) {
        this.form = form
        this.to = to
    }

    get(t: number): { left: number, top: number } {

        const left = this.form.left * (1 - t) + this.to.left * t
        const top = this.form.top * (1 - t) + this.to.top * t
        return { left, top }
    }
}

export class SizeTransOptions {
    form: number
    to: number

    constructor(form: number, to: number) {
        this.form = form
        this.to = to
    }

    get(t: number): number {
        return this.form * (1 - t) + this.to * t
    }
}

export class OpacityTransOptions {
    form: number
    to: number

    constructor(form: number, to: number) {
        this.form = form
        this.to = to
    }

    get(t: number): number {
        return this.form * (1 - t) + this.to * t
    }
}