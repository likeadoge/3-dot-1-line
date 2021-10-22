
const emit = Symbol('emit')

export class TouchListener {
    static list: TouchListener[] = []

    static init(target: HTMLElement) {
        target.addEventListener('touchstart', e => TouchListener[emit]('start', e))
        target.addEventListener('touchmove', e => TouchListener[emit]('move', e))
        target.addEventListener('touchend', e => TouchListener[emit]('end', e))
        target.addEventListener('touchcancel', e => TouchListener[emit]('cancel', e))
    }

    static [emit](name: 'start' | 'move' | 'end' | 'cancel', e: TouchEvent) {

        if (name === 'start') e.preventDefault()
        if (name === 'move') e.preventDefault()

        if (name !== 'start') {
            TouchListener.list.forEach(listener => {
                if (listener.active) listener[emit](name, e)
            })
        } else {
            const { clientX: left = 0, clientY: top = 0 } = e.touches[0] ?? {}
            TouchListener.list.forEach(listener => {
                if (listener.in(left, top)) listener[emit](name, e)
            })
        }
    }

    start: (e: { left: number, top: number }) => void = () => { }
    move: (e: { left: number, top: number }) => void = () => { }
    end: (e: { left: number, top: number }) => void = () => { }
    cancel: (e: { left: number, top: number }) => void = () => { }

    left: number = 0
    right: number = 0
    top: number = 0
    bottom: number = 0

    lastPos: { top: number, left: number } = { left: this.left, top: this.top }

    active: boolean = false

    constructor() {
        TouchListener.list.push(this)
    }

    in(left: number, top: number) {
        return (
            (left > this.left)
            && (left < this.right)
            && (top > this.top)
            && (top < this.bottom)
        )
    }

    [emit](name: 'start' | 'move' | 'end' | 'cancel', e: TouchEvent) {

        const { clientX: left = 0, clientY: top = 0 } = e.touches[0] ?? {}

        if (name === 'start') {
            this.active = true
        } else if (name === 'end' || name === 'cancel') {
            this.active = false
        }

        this[name]({ left, top })
    }

    quit(e?: { left: number, top: number }) {
        this.active = false
        this.cancel(e ?? this.lastPos)
    }
}


export const touch = () => new TouchListener()