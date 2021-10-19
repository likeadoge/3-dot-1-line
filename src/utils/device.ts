class Device {
    mode: 'pc' | 'mobile'
    width: number
    height: number
    time: number = 0

    constructor() {
        const { width, height } = document.body.getClientRects()[0]
        const mode = (height > width && width > 320) ? 'mobile' : 'pc'
        this.mode = mode;

        [this.width, this.height] = this.mode === 'mobile'
            ? [width, height]
            : [360, 640]

        this.curtime()
    }

    vibrate() {
        return window.navigator.vibrate(200)
    }

    curtime(){
        this.time = new Date().getTime();
    }

}

export const device = new Device()